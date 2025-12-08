package com.carbayo.gramola.repository;

import com.carbayo.gramola.model.StripeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StripeTransactionRepository extends JpaRepository<StripeTransaction, String> {
}