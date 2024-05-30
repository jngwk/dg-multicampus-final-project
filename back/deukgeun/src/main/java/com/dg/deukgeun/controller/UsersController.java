package com.dg.deukgeun.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.dto.UsersDTO;
import com.dg.deukgeun.service.UsersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/users")
public class UsersController {
    private final UsersService service;

    @GetMapping("/{usersId}")
    public UsersDTO get(@PathVariable(name="usersId") Integer usersId){
        return service.get(usersId);
    }
}
