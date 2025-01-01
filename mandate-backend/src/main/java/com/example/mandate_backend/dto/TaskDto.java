package com.example.mandate_backend.dto;

import java.util.Date;

public class TaskDto {

    private String id;
    private String name;
    private String assignee;
    private Date createTime;
    private Long transactionId; // or Long transactionId
    private String processInstanceId;

    public TaskDto() {
    }

    public TaskDto(String id, String name, String assignee, Date createTime) {
        this.id = id;
        this.name = name;
        this.assignee = assignee;
        this.createTime = createTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }
}
