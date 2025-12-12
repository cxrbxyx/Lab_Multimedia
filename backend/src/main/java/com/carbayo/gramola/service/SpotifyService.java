package com.carbayo.gramola.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SpotifyService {

    private final WebClient webClient;

    public SpotifyService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.spotify.com/v1").build();
    }

    // 1. Obtener Token de Spotify (Client Credentials Flow)
    public String getClientCredentialsToken(String clientId, String clientSecret) {
        WebClient authClient = WebClient.builder()
                .baseUrl("https://accounts.spotify.com")
                .build();

        JsonNode response = authClient.post()
                .uri("/api/token")
                .headers(headers -> headers.setBasicAuth(clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials"))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block(); // Bloqueamos porque necesitamos el token sí o sí

        return response.get("access_token").asText();
    }

    // 2. Buscar canciones
    public List<Map<String, String>> searchTracks(String query, String token) {
        JsonNode response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search")
                        .queryParam("q", query)
                        .queryParam("type", "track")
                        .queryParam("limit", "10")
                        .build())
                .headers(h -> h.setBearerAuth(token))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<Map<String, String>> tracks = new ArrayList<>();
        if (response != null && response.has("tracks")) {
            JsonNode items = response.get("tracks").get("items");
            for (JsonNode item : items) {
                Map<String, String> track = new HashMap<>();
                track.put("id", item.get("id").asText());
                track.put("name", item.get("name").asText());
                track.put("artist", item.get("artists").get(0).get("name").asText());
                
                // Obtener imagen (la mediana, index 1 suele ser 300x300)
                JsonNode images = item.get("album").get("images");
                if (images.size() > 0) {
                    track.put("image", images.get(0).get("url").asText());
                }
                
                tracks.add(track);
            }
        }
        return tracks;
    }
}
