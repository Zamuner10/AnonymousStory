package com.viniciuskz.anonymousstories;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; // <-- Importação adicionada

@SpringBootApplication
@EnableAsync // <-- Anotação adicionada
public class AnonymousstoriesApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnonymousstoriesApplication.class, args);
	}

}