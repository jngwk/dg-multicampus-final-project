package com.dg.deukgeun.Entity;

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
    @Column(name = "chat_id")
    private Integer chatRoomId;
    private Integer senderId;
    private Integer receiverId;
    @Column(name = "chat_timestamp", updatable = false)
    private LocalDateTime timestamp;
    private String message;

}
