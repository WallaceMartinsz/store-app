package com.wallace.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class StoreApplication {
	private static final String DEFAULT_TIMEZONE = "America/Sao_Paulo";

	public static void main(String[] args) {
		// Containers rodam em UTC: sem isso, LocalDateTime.now() grava datas 3h adiantadas
		String timezone = System.getenv().getOrDefault("APP_TIMEZONE", DEFAULT_TIMEZONE);
		TimeZone.setDefault(TimeZone.getTimeZone(timezone));

		SpringApplication.run(StoreApplication.class, args);
	}

}
