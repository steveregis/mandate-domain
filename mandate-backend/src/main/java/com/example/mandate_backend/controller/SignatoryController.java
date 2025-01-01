package com.example.mandate_backend.controller;

import com.example.mandate_backend.domain.Mandate;
import com.example.mandate_backend.domain.Signatory;
import com.example.mandate_backend.repository.MandateRepository;
import com.example.mandate_backend.repository.SignatoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signatories")
public class SignatoryController {

    private final SignatoryRepository signatoryRepo;
    private final MandateRepository mandateRepo;

    public SignatoryController(SignatoryRepository signatoryRepo, MandateRepository mandateRepo) {
        this.signatoryRepo = signatoryRepo;
        this.mandateRepo = mandateRepo;
    }

    @GetMapping
    public List<Signatory> getAllSignatories() {
        return signatoryRepo.findAll();
    }

    @GetMapping("/{id}")
    public Signatory getSignatory(@PathVariable Long id) {
        return signatoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signatory not found, id: " + id));
    }

    // Link Signatory to a specific Mandate
    @PostMapping("/mandate/{mandateId}")
    public Signatory createSignatory(@PathVariable Long mandateId, @RequestBody Signatory signatory) {
        Mandate mandate = mandateRepo.findById(mandateId)
                .orElseThrow(() -> new RuntimeException("Mandate not found, id: " + mandateId));
        // If userName is null, set a default:
        if (signatory.getUserName() == null || signatory.getUserName().isBlank()) {
            signatory.setUserName("defaultUserName");
        }

        signatory.setMandate(mandate);
        return signatoryRepo.save(signatory);
    }

    @PutMapping("/{id}")
    public Signatory updateSignatory(@PathVariable Long id, @RequestBody Signatory updated) {
        Signatory existing = signatoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signatory not found, id: " + id));

        existing.setDisplayName(updated.getDisplayName());
        existing.setRoleName(updated.getRoleName());
        // If you want to reassign mandate, do so carefully here
        // existing.setMandate(...)

        return signatoryRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteSignatory(@PathVariable Long id) {
        signatoryRepo.deleteById(id);
    }
}
