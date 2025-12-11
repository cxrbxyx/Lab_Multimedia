package com.carbayo.gramola.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKeyString;

    private Key SECRET_KEY;

    @PostConstruct
    public void init() {
        // Aseguramos que la clave tenga longitud suficiente para HS256 (mínimo 32 bytes)
        // Si tu clave en .env es corta, esto podría fallar o ser inseguro.
        // Lo mejor es usar Keys.hmacShaKeyFor con los bytes directos.
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // Extraer el email (subject) del token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Método genérico para extraer cualquier dato del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Generar un token nuevo para un usuario
    public String generateToken(String email) {
        return generateToken(new HashMap<>(), email);
    }

    public String generateToken(Map<String, Object> extraClaims, String email) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                // IMPORTANTE: Forzar HS256 aquí
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validar si el token pertenece al usuario y no ha expirado
    public boolean isTokenValid(String token, String email) {
        final String username = extractEmail(token);
        return (username.equals(email)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) // Usar la misma clave para validar
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
