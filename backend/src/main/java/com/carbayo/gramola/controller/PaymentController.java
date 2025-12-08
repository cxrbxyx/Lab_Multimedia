package com.carbayo.gramola.controller;

import com.carbayo.gramola.model.StripeTransaction;
import com.carbayo.gramola.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*") // Permitir peticiones desde Angular
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/prepay")
    public StripeTransaction prepay(
            @RequestParam String email,
            @RequestParam String token,
            @RequestParam Long amount) {
        try {
            return this.paymentService.prepay(email, token, amount);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error en el prepago: " + e.getMessage());
        }
    }

    @PostMapping("/confirm")
    public void confirm(@RequestBody String transactionId) {
        this.paymentService.confirmPayment(transactionId);
    }
}