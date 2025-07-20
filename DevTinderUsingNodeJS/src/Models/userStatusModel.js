import mongoose from "mongoose";

const UserStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  socketId: {
    type: String,
    default: null,
  },
});

// Index for efficient querying
UserStatusSchema.index({ userId: 1 });
UserStatusSchema.index({ isOnline: 1 });

// Method to set user online
UserStatusSchema.statics.setUserOnline = async function(userId, socketId) {
  return this.findOneAndUpdate(
    { userId },
    {
      isOnline: true,
      lastSeen: new Date(),
      socketId: socketId,
    },
    { upsert: true, new: true }
  );
};

// Method to set user offline
UserStatusSchema.statics.setUserOffline = async function(userId) {
  return this.findOneAndUpdate(
    { userId },
    {
      isOnline: false,
      lastSeen: new Date(),
      socketId: null,
    },
    { new: true }
  );
};

// Method to get user status
UserStatusSchema.statics.getUserStatus = async function(userId) {
  return this.findOne({ userId }).populate('userId', 'firstName lastName photoUrl');
};

// Method to get online users from a list of user IDs
UserStatusSchema.statics.getOnlineUsers = async function(userIds) {
  return this.find({
    userId: { $in: userIds },
    isOnline: true,
  }).populate('userId', 'firstName lastName photoUrl');
};

export default mongoose.model("UserStatus", UserStatusSchema);
