package com.carbayo.gramola.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carbayo.gramola.entity.User;
import com.carbayo.gramola.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService mailService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Lógica de Registro con Envío de Email
    public void register(String bar, String email, String pwd, String clientId, String clientSecret) throws Exception {
        String token = java.util.UUID.randomUUID().toString();
        // IMPORTANTE: El orden debe ser: email, barName, pwd, clientId, clientSecret,
        // token
        User user = new User(email, bar, pwd, clientId, clientSecret, token);
        this.userRepository.save(user);
        String confirmationUrl = "http://localhost:4200/payments?email=" + email + "&token=" + token;

        // Mensaje del correo
        String mensaje = "Hola " + bar + ",\n\n" +
            "Gracias por registrarte en Gramola.\n\n" +
            "Por favor, confirma tu cuenta y completa el pago haciendo clic en el siguiente enlace:\n\n" +
            confirmationUrl + "\n\n" +
            "Si no has solicitado este registro, ignora este correo.\n\n" +
            "Saludos,\nEl equipo de Gramola";


        // Enviar el correo
        try {
            this.mailService.sendEmail(email, "Confirma tu cuenta de Gramola", mensaje);
            System.out.println("✅ Correo enviado a: " + email);
        } catch (Exception e) {
            System.err.println("❌ Error al enviar correo: " + e.getMessage());
            // También puedes mostrar en consola para debug
            System.out.println("--- CORREO QUE SE INTENTÓ ENVIAR ---");
            System.out.println("Para: " + email);
            System.out.println("Asunto: Confirma tu cuenta de Gramola");
            System.out.println("Contenido:\n" + mensaje);
            System.out.println("-----------------------------------");
        }
    }

    public boolean confirmUser(String email, String token) {
        return userRepository.findByToken(token)
                .map(user -> {
                    if (user.getEmail().equals(email)) {
                        user.setToken(null); // Borramos el token para que no se pueda reusar
                        userRepository.save(user);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
}