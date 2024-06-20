// package com.dg.deukgeun.backup.service;

// import java.util.Optional;
// import org.modelmapper.ModelMapper;
// import org.springframework.stereotype.Service;

// import com.dg.deukgeun.dto.UsersDTO;
// import com.dg.deukgeun.entity.Users;
// import com.dg.deukgeun.repository.UsersRepository;

// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

// @Service
// @Transactional
// @Log4j2
// @RequiredArgsConstructor
// public class UsersService {
// private final ModelMapper modelMapper;
// private final UsersRepository usersRepository;

// public Integer register(UsersDTO usersDTO){ //
// Users users = modelMapper.map(usersDTO, Users.class);
// Users savedUsers = usersRepository.save(users);
// return savedUsers.getUserId();
// }

// public UsersDTO get(Integer userId){
// Optional<Users> result = usersRepository.findById(userId);
// Users users = result.orElseThrow();
// UsersDTO dto = modelMapper.map(users,UsersDTO.class);
// return dto;
// }

// public void modify(UsersDTO usersDTO){
// Optional<Users> result = usersRepository.findById(usersDTO.getUserId());
// Users users = result.orElseThrow();
// users.setAddress(usersDTO.getAddress());
// users.setApproval(usersDTO.getApproval());
// users.setDetail_address(usersDTO.getDetail_address());
// }

// public void remove(Integer userId){
// usersRepository.deleteById(userId);
// }
// }
