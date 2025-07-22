import { useState, useEffect, useCallback, useRef } from "react";
import chatService, { getChatHistory } from "../service/ChatService";
import { toast } from "react-toastify";

export const useChat = (currentUserId, selectedUserId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!currentUserId || !selectedUserId) return;
    let timeOut;
    setIsLoading(true);
    try {
      const response = await getChatHistory(currentUserId, selectedUserId);
      if (response.data) {
        setMessages(response.data.messages); // Reverse to show oldest first
        timeOut = setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }

    return () => clearTimeout(timeOut);
  }, [currentUserId, selectedUserId]);

  // Send message
  const sendMessage = useCallback(
    (message, messageType = "text") => {
      console.log("sendMessage called:", { selectedUserId, message, isConnected: chatService.isConnected });
      
      if (!selectedUserId || !message.trim() || !chatService.isConnected) {
        console.log("Send message blocked:", {
          hasSelectedUser: !!selectedUserId,
          hasMessage: !!message.trim(),
          isConnected: chatService.isConnected
        });
        return;
      }

      try {
        console.log("Attempting to send message via socket...");
        const messageData = chatService.sendMessage(
          selectedUserId,
          message.trim(),
          messageType
        );

        console.log("Message sent to socket, waiting for server confirmation");
        setTimeout(scrollToBottom, 100);

        return messageData;
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    },
    [currentUserId, selectedUserId]
  );

  // Mark messages as read
  const markAsRead = useCallback(() => {
    if (!selectedUserId) return;

    chatService.markAsRead(selectedUserId);

    // Update local message status
    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId.id === selectedUserId && msg.status !== "read"
          ? { ...msg, status: "read" }
          : msg
      )
    );

    // Update unread counts
    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUserId]: 0,
    }));
  }, [selectedUserId]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return chatService.isUserOnline(userId);
  }, []);

  // Initialize chat when component mounts
  useEffect(() => {
    if (!currentUserId) return;

    console.log("Initializing chat for user:", currentUserId);
    console.log("All cookies:", document.cookie);
    
    // Try different token cookie names
    const tokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    
    // Also try "authToken" or other common names
    const authTokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
      
    const token = tokenFromCookie || authTokenFromCookie;
    
    console.log("Token found:", !!token, token ? "(token exists)" : "(no token)");

    if (token) {
      chatService.connect(token, currentUserId);
      
      // Update connection status periodically
      const checkConnection = setInterval(() => {
        setIsConnected(chatService.isConnected);
      }, 1000);
      
      return () => {
        clearInterval(checkConnection);
        chatService.disconnect();
        setIsConnected(false);
      };
    } else {
      console.error("No authentication token found in cookies");
    }
  }, [currentUserId]);

  // Set up message listeners
  useEffect(() => {
    console.log("Setting up message listeners for:", { currentUserId, selectedUserId });
    
    const unsubscribeMessage = chatService.onMessage((message) => {
      console.log("🔥 RECEIVED NEW MESSAGE VIA SOCKET:", message);
      
      setMessages((prev) => {
        // Normalize message structure for consistency
        const normalizedMessage = {
          ...message,
          senderId: message.senderId?.id ? message.senderId : { id: message.senderId },
          receiverId: message.receiverId?.id ? message.receiverId : { id: message.receiverId },
          id: message._id || message.id || Date.now().toString()
        };
        
        console.log("Normalized message:", normalizedMessage);
        
        // Avoid duplicates
        const exists = prev.some(
          (msg) => {
            const msgSenderId = msg.senderId?.id || msg.senderId;
            const newMsgSenderId = normalizedMessage.senderId?.id || normalizedMessage.senderId;
            
            return msg.id === normalizedMessage.id ||
                   msg._id === normalizedMessage._id ||
                   (msgSenderId === newMsgSenderId &&
                    Math.abs(new Date(msg.timestamp) - new Date(normalizedMessage.timestamp)) < 1000 &&
                    msg.message === normalizedMessage.message);
          }
        );

        if (!exists) {
          console.log("Adding new message to chat");
          setTimeout(scrollToBottom, 100);
          return [...prev, normalizedMessage];
        }
        console.log("Message already exists, skipping");
        return prev;
      });

      // Update unread count if message is not from selected user
      if (message.senderId.id !== selectedUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId.id]: (prev[message.senderId.id] || 0) + 1,
        }));
      }

      // Show notification for new messages
      if (
        message.senderId.id !== currentUserId &&
        message.senderId.id !== selectedUserId
      ) {
        toast.info(`New message from ${message.senderId.firstName}`);
      }
    });

    const unsubscribeStatus = chatService.onMessageStatusUpdate((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, status: data.status } : msg
        )
      );
    });

    const unsubscribeUserStatus = chatService.onUserStatusUpdate((data) => {
      if (data.type === "online_users") {
        setOnlineUsers(new Set(data.users.map((user) => user.userId)));
      } else {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isOnline) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      unsubscribeUserStatus();
    };
  }, [currentUserId, selectedUserId]);

  // Load chat history when selected user changes
  useEffect(() => {
    console.log("🔄 Selected user changed:", { selectedUserId, currentUserId });
    if (selectedUserId) {
      console.log("📚 Loading chat history and joining room...");
      loadChatHistory();
      chatService.joinRoom(currentUserId, selectedUserId);

      // Mark messages as read when opening chat
      setTimeout(markAsRead, 1000);

      return () => {
        console.log("🚪 Leaving room for:", { currentUserId, selectedUserId });
        chatService.leaveRoom(currentUserId, selectedUserId);
      };
    }
  }, [selectedUserId, loadChatHistory, currentUserId, markAsRead]);

  return {
    messages,
    isLoading,
    isConnected,
    onlineUsers,
    typingUsers,
    unreadCounts,
    sendMessage,
    markAsRead,
    isUserOnline,
    loadChatHistory,
    messagesEndRef,
    scrollToBottom,
  };
};
