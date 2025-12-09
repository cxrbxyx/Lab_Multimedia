package com.carbayo.gramola.service;

import com.carbayo.gramola.model.*;
import com.carbayo.gramola.repository.StripeTransactionRepository;
import com.carbayo.gramola.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    // API Key de prueba de Stripe (según documentación de la práctica)
    static {
        Stripe.apiKey = "sk_test_51SIV1j0Op3tHBSoLhVqt2k3Z0g6duLrSS4lMgMH5eiTzJg1Y0vEmqWUjCNV96wNTtt88ms4zK0WnYth2g7WGLI8R00wRRSs1iJ"; //PaymentsService
        // NOTA: Usa tu propia Secret Key de Stripe si tienes una cuenta creada, sino
        // esta es un placeholder.
        // En un entorno real, esto iría en application.properties.
    }

    @Autowired
    private StripeTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

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