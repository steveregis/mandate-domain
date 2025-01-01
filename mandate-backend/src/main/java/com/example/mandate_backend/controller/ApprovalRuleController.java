package com.example.mandate_backend.controller;

import com.example.mandate_backend.domain.ApprovalRule;
import com.example.mandate_backend.domain.Mandate;
import com.example.mandate_backend.repository.ApprovalRuleRepository;
import com.example.mandate_backend.repository.MandateRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
public class ApprovalRuleController {

    private final ApprovalRuleRepository ruleRepo;
    private final MandateRepository mandateRepo;

    public ApprovalRuleController(ApprovalRuleRepository ruleRepo, MandateRepository mandateRepo) {
        this.ruleRepo = ruleRepo;
        this.mandateRepo = mandateRepo;
    }

    @GetMapping
    public List<ApprovalRule> getAllRules() {
        return ruleRepo.findAll();
    }

    @GetMapping("/{id}")
    public ApprovalRule getRule(@PathVariable Long id) {
        return ruleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found, id: " + id));
    }

    @PostMapping("/mandate/{mandateId}")
    public ApprovalRule createRule(@PathVariable Long mandateId, @RequestBody ApprovalRule rule) {
        Mandate mandate = mandateRepo.findById(mandateId)
                .orElseThrow(() -> new RuntimeException("Mandate not found, id: " + mandateId));

        rule.setMandate(mandate);
        return ruleRepo.save(rule);
    }

    @PutMapping("/{id}")
    public ApprovalRule updateRule(@PathVariable Long id, @RequestBody ApprovalRule updated) {
        ApprovalRule existing = ruleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found, id: " + id));

        existing.setRuleName(updated.getRuleName());
        existing.setThreshold(updated.getThreshold());
        existing.setRequiredSignatories(updated.getRequiredSignatories());
        // Reassigning a mandate is optional, typically not changed

        return ruleRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteRule(@PathVariable Long id) {
        ruleRepo.deleteById(id);
    }
}
