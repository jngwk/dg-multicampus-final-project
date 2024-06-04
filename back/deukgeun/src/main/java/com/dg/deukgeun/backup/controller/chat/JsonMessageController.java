// package com.dg.deukgeun.backup.controller.chat;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

<<<<<<< HEAD
//import com.dg.deukgeun.backup.service.chat.RabbitMQJsonProducer;
//import com.dg.deukgeun.entity.User;
=======
// import com.dg.deukgeun.Entity.User;
// import com.dg.deukgeun.backup.service.chat.RabbitMQJsonProducer;
>>>>>>> 494cf290711e7552e1ecaf1903c288f132f6aaa8

// @RestController
// @RequestMapping("/chat/json")
// public class JsonMessageController {
//     private RabbitMQJsonProducer jsonProducer;

//     public JsonMessageController(RabbitMQJsonProducer jsonProducer) {
//         this.jsonProducer = jsonProducer;
//     }

//     @PostMapping("/publish")
//     public ResponseEntity<String> sendJsonMessage(@RequestBody User user) {
//         jsonProducer.sendJsonMessage(user);
//         return ResponseEntity.ok("Json message sent to RabbitMQ ...");
//     }
// }
