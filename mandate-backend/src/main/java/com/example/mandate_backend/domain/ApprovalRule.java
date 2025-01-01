package com.example.mandate_backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties("mandate") 
public class ApprovalRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ruleName;      // e.g. "Dual Sign-off", "Single Sign-off below $10K"
    private Double threshold;     // e.g. 10000.0 (limit for the rule)
    private Integer requiredSignatories;  // e.g. 2

    @ManyToOne
    @JoinColumn(name = "mandate_id")
    @JsonBackReference

    private Mandate mandate;

    public ApprovalRule() {
    }

    public ApprovalRule(String ruleName, Double threshold, Integer requiredSignatories) {
        this.ruleName = ruleName;
        this.threshold = threshold;
        this.requiredSignatories = requiredSignatories;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getRuleName() {
        return ruleName;
    }
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public Double getThreshold() {
        return threshold;
    }
    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }

    public Integer getRequiredSignatories() {
        return requiredSignatories;
    }
    public void setRequiredSignatories(Integer requiredSignatories) {
        this.requiredSignatories = requiredSignatories;
    }

    public Mandate getMandate() {
        return mandate;
    }
    public void setMandate(Mandate mandate) {
        this.mandate = mandate;
    }
}
