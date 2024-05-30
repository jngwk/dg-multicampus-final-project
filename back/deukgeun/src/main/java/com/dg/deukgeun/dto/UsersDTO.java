package com.dg.deukgeun.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsersDTO {
    private Integer userId;
    private String userName;
    private String password;
    private String email;
    private String address;
    private String detail_address;
    private String category;
    private Integer approval;
}
