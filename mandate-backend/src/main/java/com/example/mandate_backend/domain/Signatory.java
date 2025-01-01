package com.example.mandate_backend.domain;

import jakarta.persistence.*;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Signatory entity represents a person or role authorized under a given Mandate.
 * Instead of hardcoding "CFO"/"Treasurer," we store flexible fields like 'roleName'.
 */
@Entity
@Table(name = "signatories")
public class Signatory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The unique username for login or identifying this signatory in BPMN tasks:
    @Column(nullable = false, unique = true)
    private String userName;

    // A display name or real name, e.g. "John Doe"
    private String displayName;

    // A flexible role name, e.g. "HeadOfFinance", "FinanceApprover", etc.
    private String roleName;

    // Link back to the Mandate this signatory belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mandate_id")
    @JsonBackReference
    private Mandate mandate;

    public Signatory() {
    }

    public Signatory(String userName, String displayName, String roleName, Mandate mandate) {
        this.userName = userName;
        this.displayName = displayName;
        this.roleName = roleName;
        this.mandate = mandate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Mandate getMandate() {
        return mandate;
    }

    public void setMandate(Mandate mandate) {
        this.mandate = mandate;
    }
}
