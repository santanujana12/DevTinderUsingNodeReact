import express from "express";
import User from "../../Models/userModel.js";
import connectionsInfoModel from "../../Models/connectionsInfoModel.js";
import mongoose from "mongoose";
import { calculateAge } from "../../utils/utils.js";

export const ProfileRouter = express.Router();

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
    // For new users
    userSet.add(id);
    isUserConnectionPreExisting.forEach((user) => {
      userSet.add(user.fromUserId._id.toString());
      userSet.add(user.toUserId._id.toString());
    });

    const findAllUsers = await User.find({
      _id: { $nin: Array.from(userSet) },
    }).skip((page - 1) * limit).limit(limit).select("firstName lastName gender age photoUrl bio");

    const editedAllUsersForAge = findAllUsers.map((eachUser) => {
      const age = calculateAge(eachUser.age);
      return {
        id:eachUser._id,
        firstName:eachUser.firstName,
        lastName:eachUser.lastName,
        gender:eachUser.gender,
        photoUrl:eachUser.photoUrl,
        bio:eachUser.bio,
        age,
      };
    });

    

    res.status(200).send(editedAllUsersForAge);
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
          let text = "";
          if (status === "interested") {
            text = "Success"
          } else {
            text = "Ignored"
          }
          return res.status(200).send(text);
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
      .populate("fromUserId", "firstName lastName age photoUrl bio").lean();

    // only need fromUserIds
    const filterData = activeRequests.map((eachRequest) => ({
      id: eachRequest._id,
      firstName: eachRequest.fromUserId.firstName,
      lastName: eachRequest.fromUserId.lastName,
      age: eachRequest.fromUserId.age,
      photoUrl: eachRequest.fromUserId.photoUrl,
      bio: eachRequest.fromUserId.bio
    }));

    const displayActualData = filterData.map((eachData) => {
      const age = calculateAge(eachData.age);
      return {
        ...eachData,
        age
      }
    })

    return res.status(200).send(displayActualData);
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

const getActiveConnections = async (req, res) => {
  const { id } = req.User;
  try {
    const activeConnections = await connectionsInfoModel.find({
      $or: [
        { fromUserId: id },
        { toUserId: id }
      ],
      status: "accepted"
    })
      .populate("fromUserId", "firstName lastName age photoUrl bio")
      .populate("toUserId", "firstName lastName age photoUrl bio")
      .lean();

    if (activeConnections && activeConnections.length > 0) {
      const filterData = activeConnections.map((eachData) => {
        const isSender = eachData.fromUserId._id.toString() === id;
        const data = isSender ? eachData.toUserId : eachData.fromUserId
        const userAge = calculateAge(data.age);

        return {
          id: eachData._id,
          firstName: data.firstName,
          lastName: data.lastName,
          userId:data._id,
          age: userAge,
          photoUrl: data.photoUrl,
          bio: data.bio
        }
      })
      return res.status(200).send(filterData);
    }
    else {
      return res.status(404).send("No active connections exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

ProfileRouter.get("/feed", UserFeed);
ProfileRouter.post("/send-connection-request/:status/:toUserId", sendConnectionRequest);
ProfileRouter.get(
  "/get-connection-request/active-requests",
  getActiveConnectionRequests
);
ProfileRouter.post(
  "/review-connection-request/:status/:reqId",
  updateConnectionRequest
);
ProfileRouter.get("/get-active-connections", getActiveConnections);

/* 

  Scenarios for reviewing connection requests.
    -> Check status should only be interested

*/
