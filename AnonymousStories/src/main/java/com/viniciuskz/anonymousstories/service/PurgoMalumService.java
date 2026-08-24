package com.viniciuskz.anonymousstories.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PurgoMalumService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PURGOMALUN_URL = "https://www.purgomalum.com/service/containsprofanity?text={text}";

    public boolean containsProfanity(String text){
        try {
            String response = restTemplate.getForObject(PURGOMALUN_URL, String.class, text);
            return Boolean.parseBoolean(response);
        }catch (Exception e){
            System.err.print("Error ao consultar PurgoMalum " + e.getMessage());
            return false;
        }
    }
}
