import mongoose from "mongoose";

const connectionsInfoModel = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ["interested", "ignored", "accepted", "rejected"],
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

connectionsInfoModel.pre("save", async function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(
      new Error(
        "Current user should not be able to send a connection request to self."
      )
    );
  }
  next();
});

export default mongoose.model("connectionInfo", connectionsInfoModel);

/*
    Case 1: Current user should not be able to send a connection request to self.
    Case 2: Duplicate connection request should not be allowed.
    Case 3: toUserId should not be able to send a connection request to the fromUserId if fromUserId has already sent a connection request to the toUserId.
    Case 4: fromUserId should not be able to send requests of accepted or rejected status to the toUserId.
*/
