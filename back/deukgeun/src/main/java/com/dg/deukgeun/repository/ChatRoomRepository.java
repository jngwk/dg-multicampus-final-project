package com.dg.deukgeun.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dg.deukgeun.entity.ChatRoom;
import com.dg.deukgeun.entity.User;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // @Query("SELECT cr FROM ChatRoom cr JOIN cr.users u1 JOIN cr.users u2 WHERE
    // u1.id = :userId1 AND u2.id = :userId2")
    Optional<ChatRoom> findByUsersContainsAndUsersContains(User user1, User user2);

}
