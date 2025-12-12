package com.carbayo.gramola.service;

import com.carbayo.gramola.entity.PlayHistory;
import com.carbayo.gramola.repository.PlayHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class HistoryService {
    @Autowired
    private PlayHistoryRepository repository;

    public PlayHistory save(String userEmail, String trackName, String artist, String image, String videoId) {
        PlayHistory history = new PlayHistory();
        history.setUserEmail(userEmail);
        history.setTrackName(trackName);
        history.setArtistName(artist);
        history.setImage(image);
        history.setVideoId(videoId);
        return repository.save(history);
    }

    public List<PlayHistory> getUserHistory(String userEmail) {
        List<PlayHistory> allHistory = repository.findByUserEmailOrderByPlayedAtDesc(userEmail);
        
        Set<String> seenTracks = new HashSet<>();
        List<PlayHistory> uniqueHistory = new ArrayList<>();
        
        for (PlayHistory history : allHistory) {
            // Usamos una clave única combinando nombre y artista
            String key = history.getTrackName() + "|" + history.getArtistName();
            
            if (!seenTracks.contains(key)) {
                seenTracks.add(key);
                uniqueHistory.add(history);
            }
            
            // Paramos cuando tengamos 20 únicos
            if (uniqueHistory.size() >= 20) {
                break;
            }
        }
        
        return uniqueHistory;
    }
}
