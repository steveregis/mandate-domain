package com.example.mandate_backend.controller;

import com.example.mandate_backend.domain.Mandate;
import com.example.mandate_backend.repository.MandateRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mandates")
public class MandateController {

    private final MandateRepository mandateRepo;

    public MandateController(MandateRepository mandateRepo) {
        this.mandateRepo = mandateRepo;
    }

    @GetMapping
    public List<Mandate> getAllMandates() {
        return mandateRepo.findAll();
    }

    @GetMapping("/{id}")
    public Mandate getMandate(@PathVariable Long id) {
        return mandateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mandate not found, id: " + id));
    }

    @PostMapping
    public Mandate createMandate(@RequestBody Mandate mandate) {
        return mandateRepo.save(mandate);
    }

    @PutMapping("/{id}")
    public Mandate updateMandate(@PathVariable Long id, @RequestBody Mandate updated) {
        Mandate existing = mandateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mandate not found, id: " + id));

        existing.setAccountId(updated.getAccountId());
        existing.setStatus(updated.getStatus());
        existing.setValidFrom(updated.getValidFrom());
        existing.setValidTo(updated.getValidTo());
        // For signatories or approvalRules, you might handle them in separate endpoints

        return mandateRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteMandate(@PathVariable Long id) {
        mandateRepo.deleteById(id);
    }
}
