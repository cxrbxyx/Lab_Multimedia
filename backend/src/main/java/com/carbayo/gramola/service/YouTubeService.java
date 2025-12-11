package com.carbayo.gramola.service;

import com.carbayo.gramola.entity.VideoCache;
import com.carbayo.gramola.repository.VideoCacheRepository;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    @Autowired
    private VideoCacheRepository videoCacheRepository;

    private static final String APPLICATION_NAME = "Gramola";

    public String getVideoId(String trackName, String artistName) {
        String query = trackName + " " + artistName + " audio";
        String cacheKey = query.toLowerCase().trim();

        // 1. Buscar en Caché
        Optional<VideoCache> cachedVideo = videoCacheRepository.findById(cacheKey);
        if (cachedVideo.isPresent()) {
            System.out.println("✅ Video encontrado en caché: " + cachedVideo.get().getVideoId());
            return cachedVideo.get().getVideoId();
        }

        // 2. Si no está, buscar en YouTube API
        try {
            YouTube youtube = new YouTube.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    null)
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            YouTube.Search.List search = youtube.search().list(List.of("id", "snippet"));
            search.setKey(apiKey);
            search.setQ(query);
            search.setType(List.of("video"));
            search.setMaxResults(1L);

            SearchListResponse searchResponse = search.execute();
            List<SearchResult> searchResultList = searchResponse.getItems();

            if (searchResultList != null && !searchResultList.isEmpty()) {
                String videoId = searchResultList.get(0).getId().getVideoId();
                
                // 3. Guardar en Caché
                VideoCache newCache = new VideoCache(cacheKey, videoId);
                videoCacheRepository.save(newCache);
                
                System.out.println("🌎 Video obtenido de YouTube API: " + videoId);
                return videoId;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null; // O manejar error
    }
}
