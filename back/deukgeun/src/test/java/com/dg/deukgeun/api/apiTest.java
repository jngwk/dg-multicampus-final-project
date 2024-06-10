package com.dg.deukgeun.api;

import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class apiTest {

    @Test
    public void crNumberCheckApiTest(){
        log.info(CRNumberCheckApi.check("1048801274"));
    }
}
