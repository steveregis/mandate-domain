package com.example.mandate_backend.controller;

import com.example.mandate_backend.domain.Mandate;
import com.example.mandate_backend.domain.Transaction;
import com.example.mandate_backend.repository.MandateRepository;
import com.example.mandate_backend.repository.TransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository txnRepo;
    private final MandateRepository mandateRepo;

    public TransactionController(TransactionRepository txnRepo, MandateRepository mandateRepo) {
        this.txnRepo = txnRepo;
        this.mandateRepo = mandateRepo;
    }

    // GET all
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return txnRepo.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable Long id) {
        return txnRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found, id=" + id));
    }

    // POST: create new transaction referencing a Mandate
    @PostMapping("/mandate/{mandateId}")
    public Transaction createTransaction(
            @PathVariable Long mandateId,
            @RequestBody Transaction newTxn) {

        Mandate mandate = mandateRepo.findById(mandateId)
                .orElseThrow(() -> new RuntimeException("Mandate not found, id=" + mandateId));

        newTxn.setMandate(mandate);
        // Possibly set status=INITIATED, createdOn=now, etc.
        return txnRepo.save(newTxn);
    }

    // PUT: update status or amount if needed
    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable Long id, @RequestBody Transaction updated) {
        Transaction existing = txnRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found, id=" + id));

        existing.setAmount(updated.getAmount());
        existing.setCurrency(updated.getCurrency());
        existing.setStatus(updated.getStatus());
        // ... other fields
        return txnRepo.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        txnRepo.deleteById(id);
    }
}
