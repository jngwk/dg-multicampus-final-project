package com.dg.deukgeun.controller;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import lombok.extern.log4j.Log4j2;

@Log4j2
@AutoConfigureMockMvc
@SpringBootTest
public class GymControllerTest {
    @Autowired
    private MockMvc mockMvc;

    // @DisplayName("get test")
    // @Test
    // public void getTest() throws Exception{
    //     mockMvc.perform(MockMvcRequestBuilders.get("/api/gym/1"))
    //     .andExpectAll(
    //         MockMvcResultMatchers.status().isOk(),
    //         MockMvcResultMatchers.content().string("ok")
    //     );
    // }
}
