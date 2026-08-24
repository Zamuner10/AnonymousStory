package com.viniciuskz.anonymousstories;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"api.security.token.secret=my-secret-key-for-testing-purposes-only-1234567890",
		"GMAIL_PASSWORD=dummy-mail-password"
})
class AnonymousstoriesApplicationTests {

	@Test
	void contextLoads() {
	}

}