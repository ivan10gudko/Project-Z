package project_z.demo.Events.EventDtos;

import java.util.UUID;

import project_z.demo.dto.TitleDtos.TitleDeletedEventDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitlePositionUpdateEventDto;

public class TitleEvent {
    public record TitleCreatedEvent(UUID userId, TitleDto title) {}
    
    public record TitleUpdatedEvent(UUID userId, TitleDto title) {}
    
    public record TitlePositionUpdatedEvent(UUID userId, TitlePositionUpdateEventDto position) {}
    
    public record TitleDeletedEvent(UUID userId, TitleDeletedEventDto deleted) {}
}

