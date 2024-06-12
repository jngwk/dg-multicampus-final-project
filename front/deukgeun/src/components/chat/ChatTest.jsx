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

const ChatTest = () => {
  const [stompClient, setStompClient] = useState(null);

  const [messages, setMessages] = useState([]); // 메세지 내역

  const [chatRoom, setChatRoom] = useState({ id: 0 }); // token에서 chatRoom 가져오기
  const [chatRooms, setChatRooms] = useState([]); // 채팅 목록
  const [chatMessage, setChatMessage] = useState(""); // 보낼 메세지

  const [availableUsers, setAvailableUsers] = useState([]); // 대화 가능 상대

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [messagesLoading, setMessagesLoading] = useState(false);
  const [availableUsersLoading, setAvailableUsersLoading] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    loadChatHistory();
    loadChatRooms();
    // loadAvailableUsers(); // 모달 클릭했을 때 리로드 되게
    const socket = new SockJS("http://localhost:8282/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected");
        if (stompClient) {
          stompClient.deactivate();
          console.log("client deactivated");
        }
        client.subscribe(`/topic/${chatRoom.id}`, onMessageReceived);
        console.log("chatRoom ID: ", chatRoom.id);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    if (stompClient) {
      // 중복 연결 방지
      stompClient.deactivate();
      console.log("client deactivated");
    }

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
        console.log("client deactivated");
      }
    };
  }, [chatRoom]);

  // 구독한 메세지 수신
  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("msg", message);
    // 대화 목록에 없는 대화방이면 추가
    if (!chatRooms.find((room) => room.id === message.chatRoom.id)) {
      setChatRooms([...chatRooms, message.chatRoom]);
    }
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 메세지 발행
  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      console.log(chatRoom.users);
      const receiver =
        chatRoom.users[0].userId === userData.userId
          ? chatRoom.users[1]
          : chatRoom.users[0];
      const messageToSend = {
        chatRoom: chatRoom, // 토큰에서 가져온거 넣기
        sender: userData, // 토큰에서 가져온거 넣기
        receiver: receiver, // TODO 수정하기
        timestamp: new Date().toISOString(),
        message: chatMessage,
      };
      stompClient.publish({
        destination: "/pub/chat.sendMessage",
        body: JSON.stringify(messageToSend),
      });
      console.log(messageToSend);
      setChatMessage("");
    }
  };

  // 채팅 내역 불러오기
  const loadChatHistory = async () => {
    try {
      setMessagesLoading(true);
      const chatHistory = await getChatHistory(chatRoom.id);
      //   console.log(chatHistory);
      setMessages(chatHistory);
    } catch (error) {
      console.error("Error loading chat history", error);
      throw error;
    } finally {
      setMessagesLoading(false);
    }
  };

  // 채팅방 목록 불러오기
  const loadChatRooms = async () => {
    try {
      const chatRoomsList = await getChatRooms(userData.userId);
      setChatRooms(chatRoomsList);
    } catch (error) {
      console.error("Error loading chat rooms", error);
      throw error;
    }
  };

  // TODO 채팅방 선택시 채팅방 불러오기
  const loadSelectedChatRoom = async () => {
    try {
      console.log("선택된 채팅방 열기");
    } catch (error) {
      console.error("Error loading chat room", error);
      throw error;
    }
  };

  // 채팅방 추가하기
  const findOrCreateChatRoom = async (selectedUserId) => {
    toggleModal();
    try {
      console.log("채팅방 생성하기");
      const newChatRoom = await getChatRoom(userData.userId, selectedUserId);
      setChatRoom(newChatRoom);
      console.log("findOrCreateChatRoom", newChatRoom);
    } catch (error) {
      console.error("Error creating chat room", error);
      throw error;
    }
  };

  // 채팅 대상 불러오기
  // 현재: 모든 유저 불러오기
  // 추후 수정: 등록된 헬스장 / 트레이너 불러오기
  const loadAvailableUsers = async () => {
    try {
      setAvailableUsersLoading(true);
      const users = await getAvailableUsers();
      console.log("대화 가능 상대 불러오기");
      setAvailableUsers(users);
      // return users;
    } catch (error) {
      console.error("Error loading available users", error);
      throw error;
    } finally {
      setAvailableUsersLoading(false);
    }
  };

  const toggleModal = () => {
    {
      !isModalVisible ? loadAvailableUsers() : setAvailableUsers([]);
    }
    setIsModalVisible(!isModalVisible);
    console.log(
      "Modal Visible: AvailableUsers",
      availableUsers,
      availableUsers.length
    );
  };

  return (
    <div className="grid grid-cols-2 items-center mt-10">
      <div className="flex flex-col justify-center items-center">
        {/* 채팅방 목록 */}
        <h2 className="w-[400px]">Chat Rooms</h2>
        <div className="relative h-[600px] w-[400px] overflow-y-auto flex flex-col gap-1">
          {chatRooms.map((room, index) => (
            <div
              className="cursor-pointer"
              key={index}
              onClick={() => setChatRoom(room)}
            >
              <b>
                {room.users[0].userId === userData.userId
                  ? room.users[1].userName
                  : room.users[0].userName}
              </b>
            </div>
          ))}
          {/* 채팅방 추가 버튼 및 모달 */}
          <div className="absolute bottom-0">
            <Button label="채팅추가" onClick={toggleModal} />
            {isModalVisible && (
              <ModalLayout toggleModal={toggleModal}>
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
        {/* 채팅 내역 */}
        <h2>Chat: {chatRoom.id === 0 ? "" : chatRoom.id}</h2>
        <div className="h-[600px] w-[400px] overflow-y-auto flex flex-col gap-1">
          {chatRoom !== 0 &&
            (messagesLoading ? (
              <div className="flex flex-col justify-center items-center h-2/3">
                <Loader />
                {/* <span className="block text-peach-fuzz font-semibold translate-x-7 -translate-y-12 -rotate-45">
                Loading...
              </span> */}
              </div>
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
            readOnly={chatRoom.id === 0 && true}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} disabled={chatRoom.id === 0 && true}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTest;
