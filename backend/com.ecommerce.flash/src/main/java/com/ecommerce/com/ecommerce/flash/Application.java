package com.ecommerce.com.ecommerce.flash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.ecommerce.com.ecommerce.flash.repository")
@EntityScan(basePackages = "com.ecommerce.com.ecommerce.flash")
@ComponentScan("com.ecommerce.com.ecommerce.flash")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);

	}

}
