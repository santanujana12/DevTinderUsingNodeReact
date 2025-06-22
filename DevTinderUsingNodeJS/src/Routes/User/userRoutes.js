import express from "express";
import User from "../../Models/userModel.js";
import connectionsInfoModel from "../../Models/connectionsInfoModel.js";
import mongoose from "mongoose";

export const UserRouter = express.Router();

const UserFeed = async function (req, res) {
  const { page, limit } = req.query;
  const { id } = req.User;

  try {
    const isUserConnectionPreExisting = await connectionsInfoModel
      .find({
        $or: [
          {
            fromUserId: id,
          },
          {
            toUserId: id,
          },
        ],
      })
      .populate("fromUserId", "firstName lastName age");

    const userSet = new Set();
    isUserConnectionPreExisting.forEach((user) => {
      userSet.add(user.fromUserId._id.toString());
      userSet.add(user.toUserId._id.toString());
    });

    const findAllUsers = await User.find({
      _id: { $nin: Array.from(userSet) },
    }).skip((page - 1) * limit).limit(limit).select("firstName lastName age");

    res.status(200).send(findAllUsers);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// API to create a connection request
const sendConnectionRequest = async (req, res) => {
  const { id } = req.User;
  const { status, toUserId } = req.params;

  const allowedStatus = ["interested", "ignored"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).send("Invalid status type");
  }

  try {
    // check if both user exists
    const [toUser, fromUser] = await Promise.all([
      User.findById(toUserId),
      User.findById(id),
    ]);

    // Check if user connection is pre-existing forward and backward
    const isExistingRequest = await connectionsInfoModel.findOne({
      $or: [
        {
          fromUserId: id,
          toUserId: toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: id,
        },
      ],
    });

    if (isExistingRequest) {
      return res.status(400).send("Request already exists");
    } else if (toUser && fromUser) {
      await connectionsInfoModel
        .create({
          fromUserId: id,
          toUserId: toUserId,
          status,
        })
        .then((success) => {
          return res.status(200).send("Connection request sent successfully");
        })
        .catch((err) => {
          return res.status(500).send(err.message);
        });
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// API to view active connection requests
const getActiveConnectionRequests = async (req, res) => {
  const { id } = req.User;
  try {
    const activeRequests = await connectionsInfoModel
      .find({
        toUserId: id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName age");

    return res.status(200).send(activeRequests);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const updateConnectionRequest = async (req, res) => {
  const { status, reqId } = req.params;

  // Validate reqId
  if (!mongoose.isValidObjectId(reqId)) {
    return res.status(400).send("Invalid request ID format");
  }
  // Accept only accepted and rejected else discard other statuses
  const allowedStatus = ["accepted", "rejected"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).send("Invalid status type");
  }
  try {
    const isPresent = await connectionsInfoModel.findById(reqId);
    // check if the request is present in database
    if (!isPresent) {
      return res.status(404).send("Connection request not found");
    }
    // check if the request is made by the logged in user
    if (!isPresent.toUserId.equals(req.User.id)) {
      return res
        .status(401)
        .send("You cannot review connection requests of another user");
    }
    // check if the request has already been reviewd
    if (isPresent.status === "rejected" || isPresent.status === "accepted") {
      return res.status(400).send("Request already reviewed");
    }
    isPresent.status = status;
    await isPresent.save();
    return res.status(200).send("Connection request updated successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

UserRouter.get("/feed", UserFeed);
UserRouter.put("/connection-request/:status/:toUserId", sendConnectionRequest);
UserRouter.get(
  "/connection-request/active-requests",
  getActiveConnectionRequests
);
UserRouter.put(
  "/review-connection-request/:status/:reqId",
  updateConnectionRequest
);

/* 

  Scenarios for reviewing connection requests.
    -> Check status should only be interested

*/
