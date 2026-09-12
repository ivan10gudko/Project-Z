package project_z.demo.services;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import project_z.demo.config.AppConfig;

@Service
@RequiredArgsConstructor
public class SseHubService<E extends Enum<E>> {
    private final AppConfig appConfig;
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    private final Map<UUID, Set<String>> userSubscribers = new ConcurrentHashMap<>();

    public SseEmitter register(String sessionId) {
        SseEmitter emitter = new SseEmitter(appConfig.getTimeoutTime());
        emitters.put(sessionId, emitter);

        emitter.onCompletion(() -> removeSession(sessionId));
        emitter.onTimeout(() -> removeSession(sessionId));
        emitter.onError(e -> removeSession(sessionId));

        return emitter;
    }

    public void subscribe(String sessionId, UUID targetUserId) {
        userSubscribers.computeIfAbsent(targetUserId, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
    }

    public void unsubscribe(String sessionId, UUID targetUserId) {
        Set<String> subs = userSubscribers.get(targetUserId);
        if (subs != null) {
            subs.remove(sessionId);
        }
    }

    private void removeSession(String sessionId) {
        emitters.remove(sessionId);
        userSubscribers.values().forEach(subs -> subs.remove(sessionId));
    }

    public <T> void sendEvent(UUID targetUserId, E eventType, T data) {
        Set<String> subscriberSessionIds = userSubscribers.get(targetUserId);
        if (subscriberSessionIds == null || subscriberSessionIds.isEmpty()) {
            return;
        }

        for (String sessionId : subscriberSessionIds) {
            SseEmitter emitter = emitters.get(sessionId);
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event().name(eventType.toString()).data(data));
                } catch (IOException e) {
                    emitter.complete();
                    removeSession(sessionId);
                }
            }
        }
    }

}
