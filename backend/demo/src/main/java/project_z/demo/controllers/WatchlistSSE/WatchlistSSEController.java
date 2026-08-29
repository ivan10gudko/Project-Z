package project_z.demo.controllers.WatchlistSSE;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import project_z.demo.enums.EventTypes.TitleEventType;
import project_z.demo.services.SseHubService;
import project_z.demo.security.JwtService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sse/watchlist")
@RequiredArgsConstructor
public class WatchlistSSEController {

    private final SseHubService<TitleEventType> sseHubService;
    private final JwtService jwtService;

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        String sessionId = UUID.randomUUID().toString();

        return sseHubService.register(userId, sessionId);
    }
}