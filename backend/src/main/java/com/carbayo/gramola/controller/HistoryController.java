package com.carbayo.gramola.controller;

import com.carbayo.gramola.entity.PlayHistory;
import com.carbayo.gramola.service.HistoryService;
import com.carbayo.gramola.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getHistory(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            List<PlayHistory> history = historyService.getUserHistory(email);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error obteniendo historial");
        }
    }

    @PostMapping
    public ResponseEntity<?> addToHistory(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            
            historyService.save(
                email, 
                body.get("name"), 
                body.get("artist"), 
                body.get("image"), 
                body.get("videoId")
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error guardando historial");
        }
    }
}
