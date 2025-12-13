package com.carbayo.gramola.repository;

import com.carbayo.gramola.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserEmailOrderByAddedAtDesc(String userEmail);
    Optional<Favorite> findByUserEmailAndTrackNameAndArtistName(String userEmail, String trackName, String artistName);
    boolean existsByUserEmailAndTrackNameAndArtistName(String userEmail, String trackName, String artistName);
}
