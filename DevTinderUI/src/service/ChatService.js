import { io } from "socket.io-client";
import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userId = null;
    this.onlineUsers = new Set();
    this.messageListeners = [];
    this.statusListeners = [];
    this.userStatusListeners = [];
  }

  // Initialize socket connection
  connect(token, userId) {
    if (this.isConnected) {
      return;
    }

    this.userId = userId;
    this.socket = io("http://localhost:5000", {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to chat server");
      this.isConnected = true;
      this.requestOnlineUsers();
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      this.isConnected = false;
    });

    // Listen for incoming messages
    this.socket.on("receive_message", (message) => {
      this.messageListeners.forEach(callback => callback(message));
    });

    // Listen for message status updates
    this.socket.on("message_status_update", (data) => {
      this.statusListeners.forEach(callback => callback(data));
    });

    // Listen for user online/offline status
    this.socket.on("user_status_update", (data) => {
      if (data.isOnline) {
        this.onlineUsers.add(data.userId);
      } else {
        this.onlineUsers.delete(data.userId);
      }
      this.userStatusListeners.forEach(callback => callback(data));
    });

    // Listen for online users list
    this.socket.on("online_users", (users) => {
      this.onlineUsers = new Set(users.map(user => user.userId));
      this.userStatusListeners.forEach(callback => callback({ type: "online_users", users }));
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  // Disconnect from socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.onlineUsers.clear();
    }
  }

  // Send a message
  sendMessage(receiverId, message, messageType = "text") {
    if (!this.isConnected || !this.socket) {
      throw new Error("Socket not connected");
    }

    const messageData = {
      receiverId,
      message,
      messageType,
      timestamp: new Date(),
    };

    this.socket.emit("send_message", messageData);
    return messageData;
  }

  // Mark messages as read
  markAsRead(senderId) {
    if (!this.isConnected || !this.socket) {
      return;
    }

    this.socket.emit("mark_as_read", { senderId });
  }

  // Join a chat room
  joinRoom(userId1, userId2) {
    if (!this.isConnected || !this.socket) {
      return;
    }

    const roomId = [userId1, userId2].sort().join("-");
    this.socket.emit("join_room", { roomId });
  }

  // Leave a chat room
  leaveRoom(userId1, userId2) {
    if (!this.isConnected || !this.socket) {
      return;
    }

    const roomId = [userId1, userId2].sort().join("-");
    this.socket.emit("leave_room", { roomId });
  }

  // Request online users list
  requestOnlineUsers() {
    if (!this.isConnected || !this.socket) {
      return;
    }

    this.socket.emit("get_online_users");
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  // Message listeners
  onMessage(callback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
    };
  }

  onMessageStatusUpdate(callback) {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  onUserStatusUpdate(callback) {
    this.userStatusListeners.push(callback);
    return () => {
      this.userStatusListeners = this.userStatusListeners.filter(cb => cb !== callback);
    };
  }
}

// API calls for chat-related operations
export const getChatHistory = async (userId1, userId2, page = 1, limit = 50) => {
  try {
    const response = await axios.get(`${IP_ADDRESS}/chat/history`, {
      params: { userId1, userId2, page, limit },
      withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await axios.get(`${IP_ADDRESS}/chat/unread-count`, {
      withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
};

export const getUserStatus = async (userId) => {
  try {
    const response = await axios.get(`${IP_ADDRESS}/chat/user-status/${userId}`, {
      withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
};

export const getOnlineUsers = async (userIds) => {
  try {
    const response = await axios.post(`${IP_ADDRESS}/chat/online-users`, 
      { userIds }, 
      { withCredentials: true }
    );
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
};

// Create a singleton instance
const chatService = new ChatService();
export default chatService;
