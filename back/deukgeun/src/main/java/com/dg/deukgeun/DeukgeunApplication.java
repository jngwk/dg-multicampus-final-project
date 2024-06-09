package com.dg.deukgeun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DeukgeunApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeukgeunApplication.class, args);
	}

}
