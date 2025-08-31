package com.komori.inboxlens.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugController {
    @GetMapping("/debug")
    public Map<String, String> debug(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        map.put("scheme", request.getScheme());
        map.put("secure", String.valueOf(request.isSecure()));
        map.put("proto", request.getHeader("x-forwarded-proto"));
        map.put("host", request.getHeader("host"));
        return map;
    }
}

