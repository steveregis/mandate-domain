package com.example.mandate_backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.mandate_backend.enums.TransactionStatus;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String currency;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status; 
    // e.g., INITIATED, PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED
    private String description;


    private LocalDateTime createdOn;

    // Link to Mandate
    @ManyToOne
    @JoinColumn(name = "mandate_id")
    private Mandate mandate;

    // Possibly link to the user who initiated
    private String createdBy;

    public Transaction() {
    }

    public Transaction(Double amount, String currency, Mandate mandate, String createdBy) {
        this.amount = amount;
        this.currency = currency;
        this.mandate = mandate;
        this.createdBy = createdBy;
        this.status = TransactionStatus.INITIATED;
        this.createdOn = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Mandate getMandate() {
        return mandate;
    }

    public void setMandate(Mandate mandate) {
        this.mandate = mandate;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}