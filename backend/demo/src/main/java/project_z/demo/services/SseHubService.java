package project_z.demo.services;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import project_z.demo.config.AppConfig;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SseHubService<E extends Enum<E>> {
    private final AppConfig appConfig;
    private final Map<UUID, Map<String, SseEmitter>> userSessions = new ConcurrentHashMap<>();

    public SseEmitter register(UUID userId, String sessionId) {
        SseEmitter emitter = new SseEmitter(appConfig.getTimeoutTime());

        userSessions.computeIfAbsent(userId, k -> new ConcurrentHashMap<>()).put(sessionId, emitter);

        emitter.onCompletion(() -> removeSession(userId, sessionId));
        emitter.onTimeout(() -> removeSession(userId, sessionId));
        emitter.onError(ex -> removeSession(userId, sessionId));

        return emitter;
    }

    private void removeSession(UUID userId, String sessionId) {
        Map<String, SseEmitter> sessions = userSessions.get(userId);
        if (sessions != null) {
            sessions.remove(sessionId);
            if (sessions.isEmpty()) {
                userSessions.remove(userId);
            }
        }
    }

    public <T> void sendEvent(UUID userId, E eventType, T data) {
        Map<String, SseEmitter> sessions = userSessions.get(userId);
        if (sessions == null) return;

        sessions.forEach((sessionId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventType.name())
                        .data(data));
            } catch (IOException e) {
                removeSession(userId, sessionId);
                emitter.completeWithError(e);
            }
        });
    }
}