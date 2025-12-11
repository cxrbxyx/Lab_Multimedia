package com.carbayo.gramola.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carbayo.gramola.entity.StripeTransaction;

@Repository
public interface StripeTransactionRepository extends JpaRepository<StripeTransaction, String> {
}