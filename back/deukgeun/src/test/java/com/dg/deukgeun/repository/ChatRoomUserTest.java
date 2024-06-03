package com.dg.deukgeun.repository;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.entity.ChatRoom;
import com.dg.deukgeun.entity.ChatRoomUser;
import com.dg.deukgeun.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
@Rollback(false)
public class ChatRoomUserTest {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatRoomUserRepository chatRoomUserRepository;

    @Autowired
    private UserRepository userRepository;

    // Postman으로 두 번 signup 후 테스트
    @Test
    public void testCreateChatRoomUser() {
        // DB에 임의의 회원 1, 2를 삽입 후 실행
        Optional<User> user1Opt = userRepository.findById(1);
        Optional<User> user2Opt = userRepository.findById(2);

        User user1 = user1Opt.get();
        User user2 = user2Opt.get();

        // 대화방 생성
        ChatRoom chatRoom = ChatRoom.builder().build();
        chatRoom = chatRoomRepository.save(chatRoom);

        // 대화방에 회원 삽입
        ChatRoomUser chatRoomUser1 = ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(user1)
                .build();

        ChatRoomUser chatRoomUser2 = ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(user2)
                .build();

        chatRoomUserRepository.save(chatRoomUser1);
        chatRoomUserRepository.save(chatRoomUser2);
    }
}
