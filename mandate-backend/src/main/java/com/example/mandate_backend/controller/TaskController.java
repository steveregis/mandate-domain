package com.example.mandate_backend.controller;

import com.example.mandate_backend.dto.TaskDto;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workflow")
public class TaskController {
    private final TaskService taskService;
    private final RuntimeService runtimeService;

    public TaskController(TaskService taskService, RuntimeService runtimeService) {
        this.taskService = taskService;
        this.runtimeService = runtimeService;
    }

    // List tasks for a given user or group, but return DTOs
    @GetMapping("/tasks")
    public List<TaskDto> getTasks(@RequestParam(required = false) String assignee) {
        List<Task> tasks;
        if (assignee != null) {
            tasks = taskService.createTaskQuery()
                    .initializeFormKeys()
                    .taskAssignee(assignee)
                    .list();
        } else {
            tasks = taskService.createTaskQuery()
                    .initializeFormKeys()
                    .list();
        }

        // map Camunda Task -> TaskDto
        return tasks.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Claim a task
    @PostMapping("/tasks/{taskId}/claim")
    public String claimTask(@PathVariable String taskId, @RequestParam String userId) {
        taskService.claim(taskId, userId);
        return "Task " + taskId + " claimed by " + userId;
    }

    // Complete a task
    @PostMapping("/tasks/{taskId}/complete")
    public String completeTask(@PathVariable String taskId) {
        taskService.complete(taskId);
        return "Task " + taskId + " completed.";
    }

    // Helper method to map a Camunda Task entity to our TaskDto
    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setAssignee(task.getAssignee());
        dto.setCreateTime(task.getCreateTime());

        // If you store transactionId in process variables:
        Long txnVar = (Long) runtimeService.getVariable(task.getExecutionId(), "transactionId");
        if (txnVar != null) {
            dto.setTransactionId(txnVar);
            // or if dto has a Long field:
            // dto.setTransactionIdLong(txnVar);
        }

        // processInstanceId from the task
        dto.setProcessInstanceId(task.getProcessInstanceId());

        return dto;
    }
}
