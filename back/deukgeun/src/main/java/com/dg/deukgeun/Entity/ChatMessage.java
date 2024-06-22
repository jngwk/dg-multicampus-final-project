package com.dg.deukgeun.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_message")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long id;
<<<<<<< HEAD

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private ChatRoom chatRoom;

    // fetch = FetchType.EAGER
    // 쓰고 싶지만 그냥 화면에서 유저 이름 받아서 쓰기
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

=======
    @Column(name = "chat_id")
    private Integer chatRoomId;
    private Integer senderId;
    private Integer receiverId;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
    @Column(name = "chat_timestamp", updatable = false)
    private LocalDateTime timestamp;
    private String message;

}
