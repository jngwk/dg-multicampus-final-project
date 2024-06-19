package com.dg.deukgeun.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TrainerController {

    // @Autowired
    // private TrainerService trainerService;

    // // Trainer 회원가입
    // @PostMapping("/user/signUp/trainer")
    // public ResponseDTO<?> signUp(@RequestBody TrainerDTO trainerDTO) {
    //     CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
    //             .getPrincipal();
    //     Integer gymUserId = userDetails.getUserId();
    //     return trainerService.signUp(trainerDTO, gymUserId);
    // }
}
