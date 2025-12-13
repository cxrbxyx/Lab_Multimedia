package com.carbayo.gramola.controller;

import com.carbayo.gramola.entity.Favorite;
import com.carbayo.gramola.service.FavoriteService;
import com.carbayo.gramola.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JwtService jwtService;

    private String getEmailFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractEmail(token);
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getFavorites(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromToken(authHeader);
            return ResponseEntity.ok(favoriteService.getUserFavorites(email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body) {
        try {
            String email = getEmailFromToken(authHeader);
            String trackName = body.get("trackName");
            String artistName = body.get("artistName");
            String image = body.get("image");
            String videoId = body.get("videoId");

            Favorite fav = favoriteService.addFavorite(email, trackName, artistName, image, videoId);
            if (fav != null) {
                return ResponseEntity.ok(fav);
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("La canción ya está en favoritos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFavorite(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        try {
            favoriteService.removeFavorite(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/track")
    public ResponseEntity<?> removeFavoriteByTrack(@RequestHeader("Authorization") String authHeader, 
                                                   @RequestParam String trackName, 
                                                   @RequestParam String artistName) {
        try {
            String email = getEmailFromToken(authHeader);
            favoriteService.removeFavoriteByTrack(email, trackName, artistName);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFavorite(@RequestHeader("Authorization") String authHeader,
                                                 @RequestParam String trackName,
                                                 @RequestParam String artistName) {
        try {
            String email = getEmailFromToken(authHeader);
            boolean exists = favoriteService.isFavorite(email, trackName, artistName);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
