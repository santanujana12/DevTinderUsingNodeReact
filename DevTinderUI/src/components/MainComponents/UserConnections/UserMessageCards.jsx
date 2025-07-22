import { useState, useEffect, useRef } from "react";
import { useChat } from "../../../hooks/useChat";
import { useSelector } from "react-redux";
import { FiSend, FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";
import { MdCheck, MdDoneAll } from "react-icons/md";

export const UserMessageCard = ({ eachConnection, setActiveUserCard }) => {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const currentUser = useSelector((state) => state.user);
  const messagesContainerRef = useRef(null);


  const {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    markAsRead,
    isUserOnline,
    messagesEndRef,
    scrollToBottom,
  } = useChat(currentUser.id, eachConnection.userId);

  const handleSendMessage = () => {
    if (messageText.trim() && isConnected) {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getMessageStatusIcon = (status, isOwn) => {
    if (!isOwn) return null;

    switch (status) {
      case "sent":
        return <MdCheck className="text-gray-400 text-sm" />;
      case "delivered":
        return <MdDoneAll className="text-gray-400 text-sm" />;
      case "read":
        return <MdDoneAll className="text-blue-500 text-sm" />;
      default:
        return null;
    }
  };

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
        }`}
      >
        <p className="text-sm">{message.message}</p>
        <div
          className={`flex items-center mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs opacity-75 mr-1">
            {formatTime(message.timestamp)}
          </span>
          {getMessageStatusIcon(message.status, isOwn)}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const isOnline = isUserOnline(eachConnection.userId);

  return (
    <div className="h-[calc(100vh-16rem)] w-2/3 bg-gray-900 rounded-md flex flex-col">
      {/* Header */}
      <div className="card-body flex flex-row justify-between items-center border-b-2 border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={eachConnection.photoUrl || "https://via.placeholder.com/40"}
              alt={eachConnection.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {isOnline && <BsCircleFill className="w-2 h-2 text-green-500" />}
            </div>
          </div>
          <div>
            <h2 className="text-white font-semibold">
              {eachConnection.firstName} {eachConnection.lastName}
            </h2>
            <p className="text-sm text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isConnected && (
            <span className="text-red-500 text-sm">Disconnected</span>
          )}
          <button className="text-gray-400 hover:text-white p-2">
            <FiPhone size={20} />
          </button>
          <button className="text-gray-400 hover:text-white p-2">
            <FiVideo size={20} />
          </button>
          <button className="text-gray-400 hover:text-white p-2">
            <FiMoreVertical size={20} />
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setActiveUserCard(null)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: "calc(100% - 140px)" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loading loading-spinner loading-md text-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Handle message ownership
            const senderId = message.senderId?.id || message.senderId;
            const isOwn = senderId === currentUser.id;
            
            console.log("Rendering message:", {
              messageId: message.id || message._id,
              senderId,
              senderIdObject: message.senderId,
              currentUserId: currentUser.id,
              isOwn,
              message: message.message
            });
            return (
              <MessageBubble
                key={message.id || message._id || index}
                message={message}
                isOwn={isOwn}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t-2 border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isConnected ? "Type your message..." : "Connecting..."
              }
              disabled={!isConnected}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={16} />
          </button>
        </div>
        {isTyping && (
          <div className="text-xs text-gray-400 mt-1">
            {eachConnection.firstName} is typing...
          </div>
        )}
      </div>
    </div>
  );
};
