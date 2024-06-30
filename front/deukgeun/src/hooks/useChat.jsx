import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  getChatHistory,
  getChatRooms,
  getAvailableUsers,
  getChatRoom,
  sendMessageViaHttp,
} from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const useChat = () => {
  // const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState({ id: 0 });
  const [chatRooms, setChatRooms] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isAvailableUsersModalVisible, setIsAvailableUsersModalVisible] =
    useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [availableUsersLoading, setAvailableUsersLoading] = useState(false);
  const { userData, loading } = useAuth();
  const [token, setToken] = useState(null);
  const stompClientRef = useRef(null);

  // 토큰 가져오고 연결
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8282/api/user/token"
        );
        const fetchedToken = response.data;
        setToken(fetchedToken);
        connect(fetchedToken);
        console.log("fetchedToken: ", fetchedToken);
      } catch (error) {
        console.error("Error fetching token");
        throw error;
      }
    };

    if (!token) {
      fetchToken();
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("client deactivated");
      }
    };
  }, [token]);

  // 대화내역, 목록 불러오기 & 연결
  useEffect(() => {
    if (loading || !userData || !token) return;
    loadChatHistory();
    loadChatRooms();
    connect();
  }, [loading, userData, chatRoom.id, token]);

  // 소켓 연결
  const connect = (token) => {
    const socket = new SockJS("http://localhost:8282/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected");
        client.subscribe(`/topic/${chatRoom.id}`, onMessageReceived);
        console.log("chatRoom ID: ", chatRoom.id);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  // 메시지 수신
  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("msg received", message.message);

    // Update the specific chat room with the latest message
    setChatRooms((prevChatRooms) => {
      return prevChatRooms.map((room) => {
        if (room.id === message.chatRoom.id) {
          return { ...room, latestMessage: message.message };
        }
        return room;
      });
    });

    if (!chatRooms.find((room) => room.id === message.chatRoom.id)) {
      setChatRooms([message.chatRoom, ...chatRooms]);
    }
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log("set latest message @@@");
    // Update the current chat room if it's the same room
    if (chatRoom.id === message.chatRoom.id) {
      setChatRoom({ ...chatRoom, latestMessage: message.message });
    }
  };

  // 메시지 발신
  const sendMessage = () => {
    console.log("Send message called");
    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("Client connected");
      const receiver =
        chatRoom.users[0].userId === userData.userId
          ? chatRoom.users[1]
          : chatRoom.users[0];
      const messageToSend = {
        chatRoom: chatRoom,
        sender: userData,
        receiver: receiver,
        timestamp: new Date().toISOString(),
        message: chatMessage,
      };
      stompClientRef.current.publish({
        destination: "/pub/chat.sendMessage",
        body: JSON.stringify(messageToSend),
      });
      setChatMessage("");
    }
  };

  // 내역 불러오기
  const loadChatHistory = async () => {
    if (chatRoom.id === 0) return;
    try {
      setMessagesLoading(true);
      const chatHistory = await getChatHistory(chatRoom.id);
      setMessages(chatHistory);
    } catch (error) {
      console.error("Error loading chat history", error);
      throw error;
    } finally {
      setMessagesLoading(false);
    }
  };

  // 목록 불러오기
  const loadChatRooms = async () => {
    try {
      const chatRoomsList = await getChatRooms();
      console.log("chatRoomsList from use Chat", chatRoomsList);
      setChatRooms(chatRoomsList);
    } catch (error) {
      console.error("Error loading chat rooms", error);
      throw error;
    }
  };

  // 채팅방 생성
  const findOrCreateChatRoom = async (selectedUserId) => {
    if (toggleAvailableUsersModal !== null) toggleAvailableUsersModal();
    try {
      const newChatRoom = await getChatRoom(selectedUserId);
      setChatRoom(newChatRoom);
      return newChatRoom;
    } catch (error) {
      console.error("Error creating chat room", error);
      throw error;
    }
  };

  // 대화 가능 상대 불러오기
  const loadAvailableUsers = async () => {
    try {
      setAvailableUsersLoading(true);
      const users = await getAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error loading available users", error);
      throw error;
    } finally {
      setAvailableUsersLoading(false);
      console.log("Loading", availableUsersLoading);
    }
  };

  const toggleAvailableUsersModal = () => {
    if (!isAvailableUsersModalVisible) loadAvailableUsers();
    setIsAvailableUsersModalVisible(!isAvailableUsersModalVisible);
    console.log("From useChat", isAvailableUsersModalVisible);
  };

  // http로 메시지 보내기
  const sendMessageHttp = async (chatRoom) => {
    try {
      const receiver =
        chatRoom.users[0].userId === userData.userId
          ? chatRoom.users[1]
          : chatRoom.users[0];
      const messageToSend = {
        chatRoom: chatRoom,
        sender: userData,
        receiver: receiver,
        timestamp: new Date().toISOString(),
        message: chatMessage,
      };
      sendMessageViaHttp(messageToSend);
    } catch (error) {
      console.error("sendMessageHttp error", error);
    }
  };

  return {
    // state
    stompClientRef,
    messages,
    chatRooms,
    setChatRooms,
    chatRoom,
    setChatRoom,
    chatMessage,
    setChatMessage,
    availableUsers,
    isAvailableUsersModalVisible,
    messagesLoading,
    availableUsersLoading,
    token,
    loading,
    userData,
    // function
    findOrCreateChatRoom,
    loadAvailableUsers,
    sendMessage,
    sendMessageHttp,
    toggleAvailableUsersModal,
  };
};

export default useChat;
