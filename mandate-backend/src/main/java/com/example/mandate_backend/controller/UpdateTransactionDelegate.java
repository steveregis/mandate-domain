package com.example.mandate_backend.controller;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import com.example.mandate_backend.repository.TransactionRepository;
import com.example.mandate_backend.enums.TransactionStatus;

@Component
public class UpdateTransactionDelegate implements JavaDelegate {

  private final TransactionRepository txnRepo;

  public UpdateTransactionDelegate(TransactionRepository txnRepo) {
    this.txnRepo = txnRepo;
  }

  @Override
  public void execute(DelegateExecution execution) throws Exception {
    Long txnId = (Long) execution.getVariable("transactionId");
    var txn = txnRepo.findById(txnId).orElseThrow();
    txn.setStatus(TransactionStatus.APPROVED);
    txnRepo.save(txn);
  }
}
