package com.carbayo.gramola.service;

import com.stripe.*;
import com.carbayo.gramola.entity.*;
import com.carbayo.gramola.repository.StripeTransactionRepository;
import com.carbayo.gramola.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.*;;

@Service
public class PaymentService {

    // API Key de prueba de Stripe (según documentación de la práctica)
    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private StripeTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        // Asignamos la clave a la configuración global de la librería Stripe
        Stripe.apiKey = this.stripeApiKey;

        // Log para depuración (opcional, pero útil para ver si carga)
        if (this.stripeApiKey == null || this.stripeApiKey.isEmpty()) {
            System.err.println("❌ ERROR: La API Key de Stripe está vacía o nula.");
        } else {
            System.out.println("✅ Stripe API Key configurada correctamente.");
        }
    }

    public StripeTransaction prepay(String userEmail, String token, Long amount) throws StripeException {

        // Verificar que el token es válido
        User user = userRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado"));

        if (!user.getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("El email no coincide con el token");
        }

        // 1. Configurar parámetros del intento de pago (en céntimos)
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setCurrency("eur")
                .setAmount(amount) // Ejemplo: 1000 céntimos = 10.00€
                .build();

        // 2. Crear el PaymentIntent en Stripe
        PaymentIntent intent = PaymentIntent.create(params);

        // 3. Guardar la transacción en nuestra BD
        StripeTransaction transaction = new StripeTransaction();
        transaction.setAmount(amount);
        transaction.setCurrency("eur");
        transaction.setUserEmail(userEmail);
        transaction.setData(intent.toJson()); // Guardamos el JSON completo para referencia

        // Guardar la transacción asociada al usuario
        return transactionRepository.save(transaction);
    }

    public void confirmPayment(String transactionId) {
        transactionRepository.findById(transactionId).ifPresent(transaction -> {
            String userEmail = transaction.getUserEmail();
            User user = userRepository.findByEmail(userEmail);
            if (user != null) {
                user.setToken(null);
                user.setActive(true); // Activar usuario
                userRepository.save(user);
            }
        });
    }
}