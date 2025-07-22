import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { mongoDbConnectionService } from "./config/database.js";
import { authRouter } from "./Routes/Auth/auth.js";
import { authMiddleware } from "./MiddleWares/authMiddleWare.js";
import { UserRouter } from "./Routes/User/userRoutes.js";
import { ProfileRouter } from "./Routes/Profile/profileRoutes.js";
import chatRouter from "./Routes/Chat/chatRoutes.js";
import { Server } from "socket.io";
import http from "http";
import ChatMessage from "./Models/chatMessageModel.js";
import UserStatus from "./Models/userStatusModel.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Set this to the URL of your frontend app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  // Allow cookies to be sent along with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", authMiddleware, UserRouter);
apiRouter.use("/profile", authMiddleware, ProfileRouter);
apiRouter.use("/chat", authMiddleware, chatRouter);


app.use("/api", apiRouter);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store user socket connections
const userSockets = new Map();

// Middleware for socket.io user authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, "secret");
    socket.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

// WebSocket event handlers
io.on("connection", async (socket) => {
  console.log("User connected", socket.userId);
  
  // Store user socket mapping
  userSockets.set(socket.userId, socket.id);
  
  // Set user online
  await UserStatus.setUserOnline(socket.userId, socket.id);
  
  // Broadcast user online status to connections
  socket.broadcast.emit("user_status_update", {
    userId: socket.userId,
    isOnline: true
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected", socket.userId);
    
    // Remove user socket mapping
    userSockets.delete(socket.userId);
    
    // Set user offline
    await UserStatus.setUserOffline(socket.userId);
    
    // Broadcast user offline status
    socket.broadcast.emit("user_status_update", {
      userId: socket.userId,
      isOnline: false
    });
  });

  // Handle joining chat rooms
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  // Handle leaving chat rooms
  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", async ({ receiverId, message, messageType = "text" }) => {
    try {
      // Create and save the message
      const chatMessage = new ChatMessage({
        senderId: socket.userId,
        receiverId,
        message,
        messageType,
        status: "sent"
      });
      
      const savedMessage = await chatMessage.save();
      const populatedMessage = await ChatMessage.findById(savedMessage._id)
        .populate('senderId', 'firstName lastName photoUrl')
        .populate('receiverId', 'firstName lastName photoUrl');
      
      // Transform _id to id for frontend consistency
      const messageToSend = {
        ...populatedMessage.toObject(),
        id: populatedMessage._id,
        senderId: {
          id: populatedMessage.senderId._id,
          firstName: populatedMessage.senderId.firstName,
          lastName: populatedMessage.senderId.lastName,
          photoUrl: populatedMessage.senderId.photoUrl
        },
        receiverId: {
          id: populatedMessage.receiverId._id,
          firstName: populatedMessage.receiverId.firstName,
          lastName: populatedMessage.receiverId.lastName,
          photoUrl: populatedMessage.receiverId.photoUrl
        }
      };

      // Create room ID for this conversation
      const roomId = [socket.userId, receiverId].sort().join('-');
      
      // Send message to the room (both sender and receiver)
      io.to(roomId).emit("receive_message", messageToSend);
      
      // If receiver is online, mark as delivered
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        await ChatMessage.findByIdAndUpdate(savedMessage._id, { status: "delivered" });
        
        // Send delivery confirmation
        io.to(roomId).emit("message_status_update", {
          messageId: savedMessage._id,
          status: "delivered"
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle marking messages as read
  socket.on("mark_as_read", async ({ senderId }) => {
    try {
      await ChatMessage.markAsRead(senderId, socket.userId);
      
      // Create room ID
      const roomId = [socket.userId, senderId].sort().join('-');
      
      // Notify sender that messages were read
      io.to(roomId).emit("message_status_update", {
        senderId: senderId,
        receiverId: socket.userId,
        status: "read"
      });
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Handle getting online users
  socket.on("get_online_users", async () => {
    try {
      const onlineUsers = await UserStatus.find({ isOnline: true })
        .populate('userId', 'firstName lastName photoUrl');
      
      socket.emit("online_users", onlineUsers);
      
    } catch (error) {
      console.error('Error getting online users:', error);
    }
  });

  // Handle typing indicators
  socket.on("typing_start", ({ receiverId }) => {
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_typing", {
        userId: socket.userId,
        isTyping: true
      });
    }
  });

  socket.on("typing_stop", ({ receiverId }) => {
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_typing", {
        userId: socket.userId,
        isTyping: false
      });
    }
  });
});

// Always call db connection first before starting the server
const startExpressWithMongoDb = async () => {
  try {
    await mongoDbConnectionService;
    server.listen(5000, () => {
      console.log("Server with Socket.IO is running on http://localhost:5000");
    });
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

startExpressWithMongoDb();
