import { useState, useEffect, useCallback, useRef } from 'react';
import chatService, { getChatHistory } from '../service/ChatService';
import { toast } from 'react-toastify';

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!currentUserId || !selectedUserId) return;

    setIsLoading(true);
    try {
      const response = await getChatHistory(currentUserId, selectedUserId);
      if (response.data) {
        setMessages(response.data.reverse()); // Reverse to show oldest first
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, selectedUserId]);

  // Send message
  const sendMessage = useCallback((message, messageType = 'text') => {
    if (!selectedUserId || !message.trim() || !chatService.isConnected) {
      return;
    }

    try {
      const messageData = chatService.sendMessage(selectedUserId, message.trim(), messageType);
      
      // Add message to local state immediately for better UX
      const newMessage = {
        _id: Date.now().toString(), // Temporary ID
        senderId: { _id: currentUserId },
        receiverId: { _id: selectedUserId },
        message: message.trim(),
        messageType,
        status: 'sent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setTimeout(scrollToBottom, 100);
      
      return messageData;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [currentUserId, selectedUserId]);

  // Mark messages as read
  const markAsRead = useCallback(() => {
    if (!selectedUserId) return;
    
    chatService.markAsRead(selectedUserId);
    
    // Update local message status
    setMessages(prev => 
      prev.map(msg => 
        msg.senderId._id === selectedUserId && msg.status !== 'read' 
          ? { ...msg, status: 'read' }
          : msg
      )
    );
    
    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [selectedUserId]: 0
    }));
  }, [selectedUserId]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return chatService.isUserOnline(userId);
  }, []);

  // Initialize chat when component mounts
  useEffect(() => {
    if (!currentUserId) return;

    const token = localStorage.getItem('token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      chatService.connect(token, currentUserId);
      setIsConnected(chatService.isConnected);
    }

    return () => {
      chatService.disconnect();
      setIsConnected(false);
    };
  }, [currentUserId]);

  // Set up message listeners
  useEffect(() => {
    const unsubscribeMessage = chatService.onMessage((message) => {
      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(msg => 
          msg._id === message._id || 
          (msg.senderId._id === message.senderId && 
           msg.timestamp === message.timestamp &&
           msg.message === message.message)
        );
        
        if (!exists) {
          setTimeout(scrollToBottom, 100);
          return [...prev, message];
        }
        return prev;
      });

      // Update unread count if message is not from selected user
      if (message.senderId._id !== selectedUserId) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.senderId._id]: (prev[message.senderId._id] || 0) + 1
        }));
      }

      // Show notification for new messages
      if (message.senderId._id !== currentUserId && message.senderId._id !== selectedUserId) {
        toast.info(`New message from ${message.senderId.firstName}`);
      }
    });

    const unsubscribeStatus = chatService.onMessageStatusUpdate((data) => {
      setMessages(prev => 
        prev.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        )
      );
    });

    const unsubscribeUserStatus = chatService.onUserStatusUpdate((data) => {
      if (data.type === 'online_users') {
        setOnlineUsers(new Set(data.users.map(user => user.userId)));
      } else {
        setOnlineUsers(prev => {
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
    if (selectedUserId) {
      loadChatHistory();
      chatService.joinRoom(currentUserId, selectedUserId);
      
      // Mark messages as read when opening chat
      setTimeout(markAsRead, 1000);

      return () => {
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
