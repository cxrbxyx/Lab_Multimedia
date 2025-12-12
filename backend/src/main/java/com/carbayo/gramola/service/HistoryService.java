package com.carbayo.gramola.service;

import com.carbayo.gramola.entity.PlayHistory;
import com.carbayo.gramola.repository.PlayHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
        // Limitamos a los últimos 20 para no sobrecargar
        List<PlayHistory> allHistory = repository.findByUserEmailOrderByPlayedAtDesc(userEmail);
        return allHistory.stream().limit(20).toList();
    }
}
