package com.carbayo.gramola.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carbayo.gramola.entity.User;
import com.carbayo.gramola.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService mailService;

    public User login(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            throw new Exception("Usuario no encontrado");
        }
        
        if (!user.isActive()) {
            // Reenviar correo de confirmación
            String token = user.getToken();
            String confirmationUrl = "http://localhost:4200/payments?email=" + email + "&token=" + token;
            
            String mensaje = "Hola " + user.getBarName() + ",\n\n" +
                "Parece que intentaste iniciar sesión pero tu cuenta aún no está activa.\n\n" +
                "Por favor, completa el pago y activa tu cuenta haciendo clic en el siguiente enlace:\n\n" +
                confirmationUrl + "\n\n" +
                "Si tienes problemas, contacta con soporte.\n\n" +
                "Saludos,\nEl equipo de MusicLab";

            try {
                mailService.sendEmail(email, "Recordatorio: Activa tu cuenta de MusicLab", mensaje);
            } catch (Exception e) {
                System.err.println("Error al reenviar correo de activación: " + e.getMessage());
            }

            throw new Exception("Cuenta no activada. Se ha enviado un nuevo correo de confirmación a tu email.");
        }
        
        if (!user.getPwd().equals(password)) {
            throw new Exception("Contraseña incorrecta");
        }
        
        return user;
    }
}
