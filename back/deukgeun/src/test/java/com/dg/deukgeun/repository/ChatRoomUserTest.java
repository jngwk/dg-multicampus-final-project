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

    @Test
    public void testCreateChatRoomUser() {
        // Fetch existing users from the database
        Optional<User> user1Opt = userRepository.findById(1);
        Optional<User> user2Opt = userRepository.findById(2);

        // assertThat(user1Opt.isPresent()).isTrue();
        // assertThat(user2Opt.isPresent()).isTrue();

        User user1 = user1Opt.get();
        User user2 = user2Opt.get();

        // Create a new ChatRoom
        ChatRoom chatRoom = ChatRoom.builder().build();
        chatRoom = chatRoomRepository.save(chatRoom);

        // Add users to the ChatRoom
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
