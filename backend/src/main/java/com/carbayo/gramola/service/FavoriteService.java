package com.carbayo.gramola.service;

import com.carbayo.gramola.entity.Favorite;
import com.carbayo.gramola.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public List<Favorite> getUserFavorites(String email) {
        return favoriteRepository.findByUserEmailOrderByAddedAtDesc(email);
    }

    public Favorite addFavorite(String email, String trackName, String artistName, String image, String videoId) {
        if (favoriteRepository.existsByUserEmailAndTrackNameAndArtistName(email, trackName, artistName)) {
            return null; // Ya existe
        }
        Favorite favorite = new Favorite();
        favorite.setUserEmail(email);
        favorite.setTrackName(trackName);
        favorite.setArtistName(artistName);
        favorite.setImage(image);
        favorite.setVideoId(videoId);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long id) {
        favoriteRepository.deleteById(id);
    }
    
    public void removeFavoriteByTrack(String email, String trackName, String artistName) {
        favoriteRepository.findByUserEmailAndTrackNameAndArtistName(email, trackName, artistName)
            .ifPresent(fav -> favoriteRepository.delete(fav));
    }

    public boolean isFavorite(String email, String trackName, String artistName) {
        return favoriteRepository.existsByUserEmailAndTrackNameAndArtistName(email, trackName, artistName);
    }
}
