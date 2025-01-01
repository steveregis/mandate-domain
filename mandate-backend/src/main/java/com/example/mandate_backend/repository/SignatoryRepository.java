package com.example.mandate_backend.repository;

import com.example.mandate_backend.domain.Signatory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignatoryRepository extends JpaRepository<Signatory, Long> {
}
