package com.komori.inboxlens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InboxlensApplication {

	public static void main(String[] args) {
		SpringApplication.run(InboxlensApplication.class, args);
	}

}
