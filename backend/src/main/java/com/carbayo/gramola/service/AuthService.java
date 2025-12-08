package com.carbayo.gramola.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.carbayo.gramola.model.User;
import com.carbayo.gramola.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User login(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            throw new Exception("Usuario no encontrado");
        }
        
        // Verificar que el usuario está activado
        if (!user.isActive()) {
            throw new Exception("Cuenta no activada. Por favor, completa el proceso de registro");
        }
        
        // Verificar contraseña (en producción deberías usar BCrypt)
        if (!user.getPwd().equals(password)) {
            throw new Exception("Contraseña incorrecta");
        }
        
        return user;
    }
}
