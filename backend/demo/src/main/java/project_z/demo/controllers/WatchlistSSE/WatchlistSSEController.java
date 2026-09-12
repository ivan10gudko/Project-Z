package project_z.demo.controllers.WatchlistSSE;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import project_z.demo.enums.EventTypes.TitleEventType;
import project_z.demo.services.SseHubService;

@RestController
@RequestMapping("/api/v1/sse/watchlist")
@RequiredArgsConstructor
public class WatchlistSSEController {

    private final SseHubService<TitleEventType> sseHubService;

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(
            @RequestParam String sessionId,
            @RequestParam UUID targetUserId) {

        SseEmitter emitter = sseHubService.register(sessionId);
        sseHubService.subscribe(sessionId, targetUserId);

        return emitter;
    }
}