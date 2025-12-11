package com.carbayo.gramola.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carbayo.gramola.entity.User;
import com.carbayo.gramola.service.AuthService;
import com.carbayo.gramola.service.JwtService; // Añadir import

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtService jwtService; // Inyectar el servicio

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        try {
            User user = authService.login(email, password);
            
            // Generar el token JWT real
            String token = jwtService.generateToken(user.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "token", token, // ¡Importante! Enviar el token generado
                "email", user.getEmail(),
                "barName", user.getBarName(),
                "clientId", user.getClientId(),
                "message", "Login exitoso"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
