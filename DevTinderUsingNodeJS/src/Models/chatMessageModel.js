import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Index for efficient querying
ChatMessageSchema.index({ senderId: 1, receiverId: 1 });
ChatMessageSchema.index({ timestamp: -1 });

// Method to get conversation between two users
ChatMessageSchema.statics.getConversation = async function(userId1, userId2, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $and: [
      {
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      { isDeleted: false }
    ]
  })
  .populate('senderId', 'firstName lastName photoUrl')
  .populate('receiverId', 'firstName lastName photoUrl')
  .sort({ timestamp: -1 })
  .skip(skip)
  .limit(limit);
};

// Method to mark messages as read
ChatMessageSchema.statics.markAsRead = async function(senderId, receiverId) {
  return this.updateMany(
    {
      senderId: senderId,
      receiverId: receiverId,
      status: { $ne: "read" }
    },
    {
      status: "read"
    }
  );
};

// Method to get unread count
ChatMessageSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    receiverId: userId,
    status: { $ne: "read" },
    isDeleted: false
  });
};

export default mongoose.model("ChatMessage", ChatMessageSchema);
