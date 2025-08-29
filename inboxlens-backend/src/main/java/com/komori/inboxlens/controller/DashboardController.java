package com.komori.inboxlens.controller;

import com.komori.inboxlens.dto.DashboardDetails;
import com.komori.inboxlens.dto.ToDoDTO;
import com.komori.inboxlens.entity.ToDoListEntity;
import com.komori.inboxlens.entity.TrackablesEntity;
import com.komori.inboxlens.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/me")
    public ResponseEntity<DashboardDetails> getDetails(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        DashboardDetails details = dashboardService.getDashboardDetails(sub);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/trackables")
    public ResponseEntity<List<TrackablesEntity>> getTrackables(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        List<TrackablesEntity> trackablesEntities = dashboardService.getTrackables(sub);
        return ResponseEntity.ok(trackablesEntities);
    }

    @GetMapping("/to-do")
    public ResponseEntity<List<ToDoListEntity>> getToDoList(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        List<ToDoListEntity> toDoListEntities = dashboardService.getToDoList(sub);
        return ResponseEntity.ok(toDoListEntities);
    }

    @PostMapping("/to-do")
    public ResponseEntity<?> addTask(@CurrentSecurityContext(expression = "authentication?.name") String sub,
                                     @RequestBody String title) {
        dashboardService.addTask(sub, title);
        return ResponseEntity.ok("Task added successfully");
    }

    @PatchMapping("/to-do")
    public ResponseEntity<?> updateTask(@CurrentSecurityContext(expression = "authentication?.name") String sub,
                                        @RequestBody ToDoDTO dto) {
        dashboardService.updateTask(sub, dto);
        return ResponseEntity.ok("Task updated successfully");
    }

    @DeleteMapping("/to-do")
    public ResponseEntity<?> deleteTask(@CurrentSecurityContext(expression = "authentication?.name") String sub,
                                     @RequestBody String title) {
        dashboardService.deleteTask(sub, title);
        return ResponseEntity.ok("Task deleted successfully");
    }
}
