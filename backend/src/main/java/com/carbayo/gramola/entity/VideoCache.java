package com.carbayo.gramola.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "video_cache")
@Data
public class VideoCache {

    @Id
    @Column(length = 500) // Clave compuesta: "Nombre Cancion - Artista"
    private String searchKey;

    private String videoId;

    public VideoCache() {}

    public VideoCache(String searchKey, String videoId) {
        this.searchKey = searchKey;
        this.videoId = videoId;
    }
}
