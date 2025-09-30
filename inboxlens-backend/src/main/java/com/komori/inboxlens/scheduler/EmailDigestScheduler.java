package com.komori.inboxlens.scheduler;

import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.repository.UserRepository;
import com.komori.inboxlens.service.EmailDigestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailDigestScheduler {
    private final UserRepository userRepository;
    private final EmailDigestService emailDigestService;

    @Scheduled(cron = "0 0 0-11 * * *")
    public void processUsersDaily() {
        String time = String.format("%02d", LocalTime.now().getHour())
                + ":"
                + String.format("%02d", LocalTime.now().getMinute());
        List<UserEntity> users = userRepository.findAllByPreferredTime(time);

        if (users.isEmpty()) {
            return;
        }

        List<CompletableFuture<Void>> futures = users.stream()
                .map(user -> emailDigestService.processUserEmails(user.getSub()))
                .toList();

        CompletableFuture<Void> allFutures = CompletableFuture.allOf(
                futures.toArray(new CompletableFuture[0])
        );

        try {
            allFutures.get(15, TimeUnit.MINUTES); // Timeout after 15 mins
            log.info("Completed all email processing");
        } catch (CancellationException e) {
            log.error("This future was cancelled: {}", e.getMessage());
        } catch (InterruptedException e) {
            log.error("Current thread was interrupted while waiting: {}", e.getMessage());
        } catch (ExecutionException e) {
            log.error("This future was completed exceptionally: {}", e.getMessage());
        } catch (TimeoutException e) {
            log.error("15 minute timout reached: {}", e.getMessage());
        }
    }
}
