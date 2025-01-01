package com.example.mandate_backend.repository;

import com.example.mandate_backend.domain.ApprovalRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalRuleRepository extends JpaRepository<ApprovalRule, Long> {
}
