// package com.dg.deukgeun.controller;

// import com.dg.deukgeun.dto.UserDTO;
// import com.dg.deukgeun.service.UserService;
// import jakarta.servlet.http.HttpServletResponse;
// import jakarta.servlet.http.HttpSession;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.*;

// import java.io.IOException;
// import java.net.URLEncoder;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Controller
// @RequiredArgsConstructor
// @Log4j2
// public class UsersController {

//     @Autowired
//     private final UserService userService;
    
//     // URL 파라미터 문자열을 생성하는 내부 메서드
//     private String getParamsString(Map<String, String> params) {
//         return params.entrySet().stream()
//                 .map(entry -> {
//                     try {
//                         return entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), "UTF-8");
//                     } catch (IOException e) {
//                         throw new RuntimeException(e);
//                     }
//                 })
//                 .collect(Collectors.joining("&"));
//     }

//     // 모델에 파라미터를 추가하는 메서드
//     private void setModelAttributes(Model model, Map<String, String> params) {
//         params.forEach(model::addAttribute);
//     }

//     // 사용자 정보 저장 폼을 보여주는 GET 메서드
//     @GetMapping("/save")
//     public String saveForm(@RequestParam Map<String, String> params, Model model) {
//         setModelAttributes(model, params);
//         return "save";
//     }

//     @PostMapping("/save")
//     public void saveUser(@ModelAttribute UserDTO userDTO, HttpServletResponse response) throws IOException {
//         if (userService.isEmailExist(userDTO.getEmail())) {
//             // 이메일이 이미 존재하는 경우
//             String error = "이메일이 이미 존재합니다.";
//             Map<String, String> params = Map.of(
//                     "error", error,
//                     "userName", userDTO.getUserName(),
//                     "email", "",
//                     "password", userDTO.getPassword(),
//                     "address", userDTO.getAddress(),
//                     "category", userDTO.getCategory()
//             );
//             String redirectUrl = "/save?" + getParamsString(params);
//             response.sendRedirect(redirectUrl);
//         } else {
//             // 새로운 사용자 저장 로직
//             userService.save(userDTO);
//             response.sendRedirect("/"); // 성공 페이지로 리디렉션
//         }
//     }

//     @GetMapping("/login")
//     public String loginForm() {
//         return "login";
//     }

//     @PostMapping("/login")
//     public String login(@ModelAttribute UserDTO userDTO, HttpSession session, Model model) {
//         UserDTO loginResult = userService.login(userDTO);
//         if (loginResult != null) {
//             // login 성공
//             session.setAttribute("loginEmail", loginResult.getEmail());
//             return "main";
//         } else {
//             // login 실패
//             model.addAttribute("error", "로그인 실패!");
//             return "login";
//         }
//     }
// }