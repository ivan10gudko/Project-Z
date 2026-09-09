package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomTitleLinkExceptions.RoomTitleLinkAlreadyExistsException;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkBatchCreateDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkCreateDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.dto.RoomTitleLinkDtos.SuggestedTitleLinkDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.repositories.RoomTitleEntityRepository;
import project_z.demo.repositories.RoomTitleLinkRepository;
import project_z.demo.repositories.Specifications.RoomTitleSpecifications;
import project_z.demo.repositories.Specifications.TitleSpecifications;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.services.RoomTitleLinkService;
import project_z.demo.services.TitleMatchingEngine;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTitleLinkServiceImpl implements RoomTitleLinkService {

    private final RoomTitleLinkRepository repository;
    private final Mapper<RoomTitleLinkEntity, RoomTitleLinkDetailsDto> mapper;
    private final TitleRepository titleRepository;
    private final RoomTitleEntityRepository roomTitleRepository;
    private final TitleMatchingEngine titleMatchingEngine;

    @Override
    @Transactional
    public RoomTitleLinkDetailsDto createLink(RoomTitleLinkCreateDto dto) {

        var userTitle = titleRepository.findById(dto.getTitleId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Title record not found with id: " + dto.getTitleId()));
        if (repository.existsByRoomTitleIdAndUserId(dto.getRoomTitleId(), userTitle.getUser().getUserId())) {
            String roomTitleName = roomTitleRepository.findTitleNameByRoomTitleId(dto.getRoomTitleId());
            throw new RoomTitleLinkAlreadyExistsException("Already linked to slot: " + roomTitleName);
        }

        var roomTitle = roomTitleRepository.findById(dto.getRoomTitleId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Room title not found with id: " + dto.getRoomTitleId()));

        RoomTitleLinkEntity entity = new RoomTitleLinkEntity();
        entity.setUserTitleRecord(userTitle);
        entity.setRoomTitle(roomTitle);

        return mapper.mapTo(repository.save(entity));
    }

    @Override
    @Transactional
    public List<RoomTitleLinkDetailsDto> batchCreateLinks(RoomTitleLinkBatchCreateDto dto) {
        List<RoomTitleLinkEntity> entities = dto.getLinks().stream()
                .map(linkDto -> {
                    var userTitle = titleRepository.findById(linkDto.getTitleId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Title record not found with id: " + linkDto.getTitleId()));

                    if (repository.existsByRoomTitleIdAndUserId(linkDto.getRoomTitleId(),
                            userTitle.getUser().getUserId())) {
                        String roomTitleName = roomTitleRepository.findTitleNameByRoomTitleId(linkDto.getRoomTitleId());
                        throw new RoomTitleLinkAlreadyExistsException("Already linked to slot: " + roomTitleName);
                    }

                    var roomTitle = roomTitleRepository.findById(linkDto.getRoomTitleId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Room title not found with id: " + linkDto.getRoomTitleId()));

                    RoomTitleLinkEntity entity = new RoomTitleLinkEntity();
                    entity.setUserTitleRecord(userTitle);
                    entity.setRoomTitle(roomTitle);
                    return entity;
                })
                .collect(Collectors.toList());

        return repository.saveAll(entities).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomTitleLinkDetailsDto> findByRoomTitleId(UUID roomTitleId) {
        return repository.findByRoomTitle_Id(roomTitleId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomTitleLinkDetailsDto> findUserLinksInRoom(UUID userId, Long roomId) {
        return repository.findByUserTitleRecord_User_UserIdAndRoomTitle_Room_RoomId(userId, roomId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLink(UUID roomTitleLinkId) {
        RoomTitleLinkEntity entity = repository.findById(roomTitleLinkId).orElseThrow(
                () -> new ResourceNotFoundException("Room title link not found"));
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteLinksByRoomTitle(UUID roomTitleId) {
        repository.deleteByRoomTitle_Id(roomTitleId);
    }

    @Override
    public List<SuggestedTitleLinkDto> suggestLinks(UUID userId, Long roomId) {
        Specification<RoomTitleEntity> roomTitleSpec = Specification
                .where(RoomTitleSpecifications.hasRoomId(roomId))
                .and(RoomTitleSpecifications.notLinkedByUser(roomId, userId));

        Specification<TitleEntity> watchlistSpec = Specification
                .where(TitleSpecifications.belongsToUser(userId))
                .and(TitleSpecifications.notLinkedToRoom(roomId, userId));

        List<RoomTitleEntity> roomTitles = roomTitleRepository.findAll(roomTitleSpec);
        List<TitleEntity> watchlistTitles = titleRepository.findAll(watchlistSpec);

        if (roomTitles.isEmpty() || watchlistTitles.isEmpty()) {
            return List.of();
        }

        return titleMatchingEngine.suggestLinks(roomTitles, watchlistTitles);
    }
}
