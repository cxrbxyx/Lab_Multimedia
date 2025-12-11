package com.carbayo.gramola.controller;

import com.carbayo.gramola.entity.User;
import com.carbayo.gramola.repository.UserRepository;
import com.carbayo.gramola.service.JwtService;
import com.carbayo.gramola.service.SpotifyService;
import com.carbayo.gramola.service.YouTubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/music")
@CrossOrigin(origins = "*")
public class MusicController {

    @Autowired
    private SpotifyService spotifyService;

    @Autowired
    private YouTubeService youTubeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/search")
    public ResponseEntity<?> searchTracks(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String q) {

        try {
            // 1. Obtener usuario del token
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userRepository.findByEmail(email);

            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            // 2. Obtener token de Spotify usando las credenciales del usuario
            String spotifyToken = spotifyService.getClientCredentialsToken(user.getClientId(), user.getClientSecret());

            // 3. Buscar canciones
            List<Map<String, String>> results = spotifyService.searchTracks(q, spotifyToken);

            return ResponseEntity.ok(results);

        } catch (io.jsonwebtoken.JwtException e) {
            // Capturamos errores específicos de token (firma, expiración, etc.)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sesión expirada o inválida");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al buscar música: " + e.getMessage());
        }
    }

    @GetMapping("/play")
    public ResponseEntity<?> getVideoId(@RequestParam String track, @RequestParam String artist) {
        String videoId = youTubeService.getVideoId(track, artist);
        if (videoId != null) {
            return ResponseEntity.ok(Map.of("videoId", videoId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
