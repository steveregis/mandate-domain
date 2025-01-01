package com.example.mandate_backend.repository;

import com.example.mandate_backend.domain.Mandate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MandateRepository extends JpaRepository<Mandate, Long> {
    // Additional custom queries if needed
}
