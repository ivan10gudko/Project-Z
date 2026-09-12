package project_z.demo.Events.EventListeners.TitleEventListeners;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Events.EventDtos.TitleEvent.TitleCreatedEvent;
import project_z.demo.Events.EventDtos.TitleEvent.TitleDeletedEvent;
import project_z.demo.Events.EventDtos.TitleEvent.TitlePositionUpdatedEvent;
import project_z.demo.Events.EventDtos.TitleEvent.TitleUpdatedEvent;
import project_z.demo.enums.EventTypes.TitleEventType;
import project_z.demo.services.SseHubService;


@Component
@RequiredArgsConstructor
public class TitleSseEventListener {

    private final SseHubService<TitleEventType> sseHubService;

    @EventListener
    public void handleTitleCreated(TitleCreatedEvent event) {
        sseHubService.sendEvent(
            event.userId(), 
            TitleEventType.TITLE_CREATED, 
            event.title()
        );
    }

    @EventListener
    public void handleTitleUpdated(TitleUpdatedEvent event) {
        sseHubService.sendEvent(
            event.userId(), 
            TitleEventType.TITLE_UPDATED, 
            event.title()
        );
    }

    @EventListener
    public void handleTitlePositionUpdated(TitlePositionUpdatedEvent event) {
        sseHubService.sendEvent(
            event.userId(), 
            TitleEventType.TITLE_POSITION_UPDATED, 
            event.position()
        );
    }

    @EventListener
    public void handleTitleDeleted(TitleDeletedEvent event) {
        sseHubService.sendEvent(
            event.userId(), 
            TitleEventType.TITLE_DELETED, 
            event.deleted()
        );
    }
}