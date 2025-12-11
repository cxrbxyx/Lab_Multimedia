package com.carbayo.gramola.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbayo.gramola.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    User findByEmail(String email);

    // Nuevo método para encontrar por código de verificación
    Optional<User> findByToken(String verificationCode);
}