package com.example.mandate_backend.controller;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.web.bind.annotation.*;

import com.example.mandate_backend.repository.TransactionRepository;
import com.example.mandate_backend.enums.TransactionStatus;

import com.example.mandate_backend.domain.Mandate;
import com.example.mandate_backend.domain.Signatory;
import com.example.mandate_backend.domain.Transaction;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    private final RuntimeService runtimeService;

    private final TransactionRepository txnRepo;

    public WorkflowController(RuntimeService runtimeService, TransactionRepository txnRepo) {
        this.runtimeService = runtimeService;
        this.txnRepo = txnRepo;
    }

    // Start the process, maybe referencing a Mandate ID or threshold
    @PostMapping("/start")
    public String startApproval(@RequestParam Long mandateId) {
        Map<String, Object> vars = new HashMap<>();
        vars.put("mandateId", mandateId);
        // add other variables if needed, e.g. threshold, signatory roles, etc.

        // Start the BPMN process
        var instance = runtimeService.startProcessInstanceByKey("approvalProcess", vars);
        return "Process started with instance ID: " + instance.getId();
    }

    @PostMapping("/start-transaction-process")
    public String startTxnApproval(
            @RequestParam Long transactionId) {
        System.out.println(">>> Received transactionId=" + transactionId);
        Transaction txn = txnRepo.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Mandate mandate = txn.getMandate(); // or read from txn
        // Possibly check amount, rules, signatories, etc.

        Map<String, Object> vars = new HashMap<>();
        vars.put("transactionId", txn.getId());
        vars.put("amount", txn.getAmount());
        vars.put("mandateId", mandate.getId());
        vars.put("signatoryUsernames", mandate.getSignatories().stream()
                .map(Signatory::getUserName)
                .collect(Collectors.toList()));

        // Start Camunda process
        ProcessInstance instance = runtimeService.startProcessInstanceByKey("approvalProcess", vars);

        // Maybe set transaction status to PENDING_APPROVAL
        txn.setStatus(TransactionStatus.PENDING_APPROVAL);
        txnRepo.save(txn);

        return "Started process " + instance.getId() + " for transaction " + txn.getId();
    }

}
