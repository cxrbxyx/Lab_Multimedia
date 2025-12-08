package com.carbayo.gramola.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    private String email;
    
    @Column(nullable = false, name = "pwd")
    private String pwd;
    
    @Column(nullable = false, name = "bar_name")
    private String barName;
    
    @Column(nullable = false, name = "client_id")
    private String clientId;
    
    @Column(nullable = false, name = "client_secret")
    private String clientSecret;
    
    @Column(name = "creation_token")
    private String token;
    
    @Column(name = "active", nullable = false)
    private boolean active = false;
    
    // Constructor vacío requerido por JPA
    public User() {}

    public User(String email, String barName, String pwd, String clientId, String clientSecret, String token) {
        this.email = email;
        this.barName = barName;
        this.pwd = pwd;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.token = token;
    }

    // Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getBarName() {
        return barName;
    }

    public void setBarName(String barName) {
        this.barName = barName;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}