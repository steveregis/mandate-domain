package com.example.mandate_backend.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Mandate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountId;     // e.g. "ACCT-12345"
    private String accountType;
    private String status;        // e.g. "ACTIVE", "SUSPENDED"

    private LocalDate validFrom;
    private LocalDate validTo;

    // Bi-directional or uni-directional relationships

    @OneToMany(mappedBy = "mandate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Signatory> signatories = new ArrayList<>();

    @OneToMany(mappedBy = "mandate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference

    private List<ApprovalRule> approvalRules = new ArrayList<>();

    public Mandate() {
    }

    public Mandate(String accountId, String accountType, String status, LocalDate validFrom, LocalDate validTo) {
        this.accountId = accountId;
        this.accountType = accountType;
        this.status = status;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    // accountId, status, validFrom, validTo
    public String getAccountId() {
        return accountId;
    }
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getAccountType() {
        return accountType;
    }
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }
    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }
    public void setValidTo(LocalDate validTo) {
        this.validTo = validTo;
    }

    public List<Signatory> getSignatories() {
        return signatories;
    }
    public void setSignatories(List<Signatory> signatories) {
        this.signatories = signatories;
    }

    public List<ApprovalRule> getApprovalRules() {
        return approvalRules;
    }
    public void setApprovalRules(List<ApprovalRule> approvalRules) {
        this.approvalRules = approvalRules;
    }
}
