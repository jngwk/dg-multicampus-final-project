package com.dg.deukgeun.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_room")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long id;

    @ManyToMany
    @JoinTable(name = "chat_room_user", joinColumns = @JoinColumn(name = "chat_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ChatMessage> messages;

    public void addMessage(ChatMessage message) {
        messages.add(message);
        message.setChatRoom(this);
    }

    public void removeMessage(ChatMessage message) {
        messages.remove(message);
        message.setChatRoom(null);
    }

    @Column(name = "latest_message")
    private String latestMessage;

    // Constructor to accept id as a String
    public ChatRoom(String id) {
        this.id = Long.parseLong(id);
    }

    // Constructor to accept id as an Integer
    public ChatRoom(Long id) {
        this.id = id;
    }
}
