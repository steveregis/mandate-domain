package com.example.mandate_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Mandate Backend!";
    }

    @GetMapping("/api/secure/hello")
    public String secureHello() {
        return "This is a secured endpoint. You must be authenticated!";
    }

}
