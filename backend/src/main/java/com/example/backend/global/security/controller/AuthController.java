package com.example.backend.global.security.controller;

import com.example.backend.global.apiPayload.ApiResponse;
import com.example.backend.global.apiPayload.code.BaseSuccessCode;
import com.example.backend.global.security.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

}
