import express from "express";
import ChatMessage from "../../Models/chatMessageModel.js";
import UserStatus from "../../Models/userStatusModel.js";
import connectionsInfoModel from "../../Models/connectionsInfoModel.js";

const chatRouter = express.Router();

// Get chat history between two users
chatRouter.get("/history", async (req, res) => {
  try {
    const { userId1, userId2, page = 1, limit = 50 } = req.query;
    const currentUserId = req.User.id;

    // Verify that the current user is one of the participants
    if (currentUserId !== userId1 && currentUserId !== userId2) {
      return res.status(403).json({ 
        error: "You can only access your own conversations" 
      });
    }

    // Check if users have an accepted connection
    const connection = await connectionsInfoModel.findOne({
      $or: [
        { fromUserId: userId1, toUserId: userId2, status: "accepted" },
        { fromUserId: userId2, toUserId: userId1, status: "accepted" }
      ]
    });

    console.log(userId1+" "+userId2);
    if (!connection) {
      return res.status(403).json({ 
        error: "Chat is only available between connected users" 
      });
    }

    const messages = await ChatMessage.getConversation(userId1, userId2, page, limit);
    
    res.json({
      messages: messages.reverse(), // Show oldest first
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: messages.length === parseInt(limit)
    });

  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Get unread message count for current user
chatRouter.get("/unread-count", async (req, res) => {
  try {
    const userId = req.User.id;
    const unreadCount = await ChatMessage.getUnreadCount(userId);
    
    res.json({ unreadCount });

  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// Get unread count by conversation
chatRouter.get("/unread-count-by-user", async (req, res) => {
  try {
    const userId = req.User.id;
    
    const unreadMessages = await ChatMessage.aggregate([
      {
        $match: {
          receiverId: userId,
          status: { $ne: "read" },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
          lastMessage: { $last: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sender"
        }
      },
      {
        $unwind: "$sender"
      },
      {
        $project: {
          senderId: "$_id",
          count: 1,
          lastMessage: 1,
          sender: {
            _id: "$sender._id",
            firstName: "$sender.firstName",
            lastName: "$sender.lastName",
            photoUrl: "$sender.photoUrl"
          }
        }
      }
    ]);

    res.json({ unreadByUser: unreadMessages });

  } catch (error) {
    console.error("Error fetching unread count by user:", error);
    res.status(500).json({ error: "Failed to fetch unread count by user" });
  }
});

// Get user online status
chatRouter.get("/user-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userStatus = await UserStatus.getUserStatus(userId);
    
    if (!userStatus) {
      return res.json({ 
        isOnline: false, 
        lastSeen: null 
      });
    }

    res.json({
      isOnline: userStatus.isOnline,
      lastSeen: userStatus.lastSeen,
      user: userStatus.userId
    });

  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ error: "Failed to fetch user status" });
  }
});

// Get online users from a list
chatRouter.post("/online-users", async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "userIds must be an array" });
    }

    const onlineUsers = await UserStatus.getOnlineUsers(userIds);
    
    res.json({ onlineUsers });

  } catch (error) {
    console.error("Error fetching online users:", error);
    res.status(500).json({ error: "Failed to fetch online users" });
  }
});

// Mark conversation as read
chatRouter.post("/mark-as-read", async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.User.id;

    await ChatMessage.markAsRead(senderId, receiverId);
    
    res.json({ success: true, message: "Messages marked as read" });

  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

// Delete a message
chatRouter.delete("/message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.User.id;

    const message = await ChatMessage.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    await message.save();

    res.json({ success: true, message: "Message deleted successfully" });

  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Get conversation list for current user
chatRouter.get("/conversations", async (req, res) => {
  try {
    const userId = req.User.id;

    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$receiverId", userId] },
                    { $ne: ["$status", "read"] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "otherUser"
        }
      },
      {
        $unwind: "$otherUser"
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessage.senderId",
          foreignField: "_id",
          as: "lastMessageSender"
        }
      },
      {
        $unwind: "$lastMessageSender"
      },
      {
        $project: {
          otherUser: {
            _id: "$otherUser._id",
            firstName: "$otherUser.firstName",
            lastName: "$otherUser.lastName",
            photoUrl: "$otherUser.photoUrl"
          },
          lastMessage: {
            _id: "$lastMessage._id",
            message: "$lastMessage.message",
            timestamp: "$lastMessage.timestamp",
            senderId: "$lastMessage.senderId",
            status: "$lastMessage.status",
            sender: {
              firstName: "$lastMessageSender.firstName",
              lastName: "$lastMessageSender.lastName"
            }
          },
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.timestamp": -1 }
      }
    ]);

    res.json({ conversations });

  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

export default chatRouter;
