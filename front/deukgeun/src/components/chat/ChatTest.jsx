import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  getChatHistory,
  getChatRooms,
  getAvailableUsers,
  getChatRoom,
} from "../../api/chatApi";
import Button from "../shared/Button";
import ModalLayout from "../modals/ModalLayout";
import Loader from "../shared/Loader";
import { useAuth } from "../../context/AuthContext";
import Fallback from "../shared/Fallback";
import axiosInstance from "../../api/axiosInstance";

const ChatTest = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState({ id: 0 });
  const [chatRooms, setChatRooms] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [availableUsersLoading, setAvailableUsersLoading] = useState(false);
  const { userData, loading } = useAuth();
  const [token, setToken] = useState(null);

  // 토큰 가져오고 연결
  useEffect(() => {
    if (token) return;
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8282/api/user/token"
        );
        const fetchedToken = response.data;
        connect(fetchedToken);
        setToken(fetchedToken);
        console.log("fetchedToken: ", fetchedToken);
      } catch (error) {
        console.error("Error fetching token");
        throw error;
      }
    };

    fetchToken();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log("client deactivated");
      }
    };
  }, [token]);

  // 대화내역, 목록 불러오기 & 연결
  useEffect(() => {
    if (loading || !userData) return;
    connect(token);
    loadChatHistory();
    loadChatRooms();
  }, [loading, userData, chatRoom]);

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
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  };

  // 메시지 수신
  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("msg received", message);
    if (!chatRooms.find((room) => room.id === message.chatRoom.id)) {
      setChatRooms([...chatRooms, message.chatRoom]);
    }
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log(messages);
  };

  // 메시지 발신
  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
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
      stompClient.publish({
        destination: "/pub/chat.sendMessage",
        body: JSON.stringify(messageToSend),
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
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
      setChatRooms(chatRoomsList);
      console.log("ChatRoomsList", chatRoomsList);
    } catch (error) {
      console.error("Error loading chat rooms", error);
      throw error;
    }
  };

  // 채팅방 생성
  const findOrCreateChatRoom = async (selectedUserId) => {
    toggleAvailableUsersModal();
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
  // TODO 연관 있는 사람만 불러오기
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
    }
  };

  const toggleAvailableUsersModal = () => {
    if (!isModalVisible) loadAvailableUsers();
    setIsModalVisible(!isModalVisible);
  };

  if (loading) {
    return <Fallback />;
  }

  return (
    <div className="grid grid-cols-2 items-center mt-10">
      <div className="flex flex-col justify-center items-center">
        <h2 className="w-[400px]">Chat Rooms</h2>
        <div className="relative h-[600px] w-[400px] overflow-y-auto flex flex-col gap-1">
          {chatRooms.length > 0 ? (
            chatRooms.map((room, index) => (
              <div
                className="cursor-pointer"
                key={index}
                onClick={() => setChatRoom(room)}
              >
                <b>
                  {room.users.length === 2 &&
                    (room.users[0].userId === userData.userId
                      ? room.users[1].userName
                      : room.users[0].userName)}
                </b>
              </div>
            ))
          ) : (
            <Loader />
          )}
          <div className="absolute bottom-0">
            <Button label="채팅추가" onClick={toggleAvailableUsersModal} />
            {isModalVisible && (
              <ModalLayout toggleModal={toggleAvailableUsersModal}>
                <div>
                  {availableUsersLoading ? (
                    <Loader />
                  ) : availableUsers.length > 0 ? (
                    availableUsers.map(
                      (user, index) =>
                        user.userId !== userData.userId && (
                          <div
                            className="cursor-pointer"
                            key={index}
                            onClick={() => findOrCreateChatRoom(user.userId)}
                          >
                            <b>{user.userName}</b>
                          </div>
                        )
                    )
                  ) : (
                    "대화 가능한 상대가 없습니다. \n 헬스장 조회를 통해 대화를 시작하거나 PT 등록을 해주세요."
                  )}
                </div>
              </ModalLayout>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2>Chat: {chatRoom.id === 0 ? "" : chatRoom.id}</h2>
        <div className="h-[600px] w-[400px] overflow-y-auto flex flex-col gap-1">
          {chatRoom.id !== 0 &&
            (messagesLoading ? (
              <div className="flex flex-col justify-center items-center h-2/3">
                <Loader />
              </div>
            ) : messages.length === 0 ? (
              "대화를 시작해주세요!"
            ) : (
              messages.map((msg, index) =>
                msg.sender.userId === userData.userId ? (
                  <div key={index} className="text-right">
                    {msg.message}:<b>{msg.sender.userName}</b>
                  </div>
                ) : (
                  <div key={index} className="text-left">
                    <b>{msg.sender.userName}</b>:{msg.message}
                  </div>
                )
              )
            ))}
        </div>
        <div>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            readOnly={chatRoom.id === 0}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} disabled={chatRoom.id === 0}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTest;
