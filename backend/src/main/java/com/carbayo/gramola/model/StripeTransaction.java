package com.carbayo.gramola.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "stripe_transaction")
@Data
public class StripeTransaction {

    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 5000) // Longitud suficiente para guardar el JSON
    private String data; // Guardaremos el JSON de respuesta de Stripe

    private String userEmail; // Para vincularlo con el usuario

    private Long amount;

    private String currency;

    public StripeTransaction() {
        this.id = UUID.randomUUID().toString();
    }
}