package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.swagger.v3.oas.models.parameters.QueryParameter;
import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.JavaUtil.TitleSortingUtils;
import project_z.demo.Mappers.Mapper;
import project_z.demo.Mappers.impl.RoomTitleMappers.RoomTitleDetailsMapper;
import project_z.demo.Mappers.impl.RoomTitleMappers.RoomTitleSummaryMapper;
import project_z.demo.Mappers.impl.RoomTitleMappers.RoomTitleUpdateMapperImpl;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.QueryParameters;
import project_z.demo.common.QueryParameters.RoomTitlesQueryParameters.RoomTitlesQueryParameters;
import project_z.demo.common.QueryParameters.RoomTitlesQueryParameters.RoomTitlesWithSearchQueryParameters;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleSummaryDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUserIdAndTitleStatusDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleWithUserLinksDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitlesResponseDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkShortDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.views.RoomTitleStatsView;
import project_z.demo.enums.TitleStatus;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.RoomTitleEntityRepository;
import project_z.demo.repositories.RoomTitleLinkRepository;
import project_z.demo.repositories.Specifications.RoomTitleSpecifications;
import project_z.demo.repositories.Specifications.views.RoomTitleStatsSpecifications;
import project_z.demo.repositories.views.RoomTitleStatsRepository;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomTitleService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTitleServiceImpl implements RoomTitleService {
    private final RoomRepository roomRepository;
    private final RoomTitleEntityRepository repository;
    private final Mapper<RoomTitleEntity, RoomTitleDetailsDto> mapper;
    private final RoomTitleUpdateMapperImpl updateMapper;
    private final Mapper<RoomTitleEntity, RoomTitleCreateDto> createMapper;
    private final Mapper<RoomTitleEntity, RoomTitleShortDto> roomTitleShortMapper;
    private final RoomTitleStatsRepository roomTitleStatsRepository;
    private final Mapper<TitleEntity, TitleSameCriteriaDto> titleShortMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleMapper;
    private final Mapper<UserEntity, UserShortDto> userShortMapper;
    private final SecurityService securityService;
    private final RoomTitleLinkRepository linkRepository;
    private final RoomTitleSummaryMapper roomTitleSummaryMapper;
    private final Mapper<RoomTitleEntity, RoomTitleDetailsDto> roomTitleDetailsMapper;
    private final Mapper<RoomTitleEntity, RoomTitleWithUserLinksDto> roomTitleWithUserLinksMapper;
    private final Mapper<RoomTitleLinkEntity, RoomTitleLinkShortDto> roomTitleLinkShortMapper;

    @Override
    @Transactional
    public RoomTitleDetailsDto create(RoomTitleCreateDto dto, Long roomId) {
        UUID currentUserId = securityService.getCurrentUserId();
        RoomEntity roomEntity = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("room not found"));
        RoomTitleEntity entity = createMapper.mapFrom(dto);
        entity.setRoom(roomEntity);
        entity.setAddedByUserId(currentUserId);

        return mapper.mapTo(repository.save(entity));
    }

    @Override
    public RoomTitleDetailsDto findById(UUID id) {
        return repository.findById(id)
                .map(mapper::mapTo)
                .orElseThrow(() -> new ResourceNotFoundException("Room Title not found"));
    }

    @Override
    public List<RoomTitleDetailsDto> findAllByRoom(Long roomId) {
        return repository.findByRoom_RoomId(roomId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public RoomTitleDetailsDto update(UUID titleId, RoomTitleUpdateDto dto) {
        RoomTitleEntity entity = repository.findById(titleId).orElseThrow(
                () -> new ResourceNotFoundException("Room Title not found"));

        RoomTitleEntity roomTitleEntity = updateMapper.mapFrom(entity, dto);
        return mapper.mapTo(repository.save(roomTitleEntity));
    }

    @Override
    public RoomTitlesResponseDto getRoomTitles(Long roomId, UUID currentUserId, RoomTitlesQueryParameters params) {
        if (roomId == null) {
            throw new ResourceNotFoundException("room not found");
        }
        String statusName = params.getStatus() != null ? params.getStatus().name() : null;

        Specification<RoomTitleStatsView> statusSpec;
        if (Boolean.TRUE.equals(params.getIsMyStatus())) {
            statusSpec = RoomTitleStatsSpecifications.hasMyStatus(statusName, currentUserId);
        } else {
            statusSpec = RoomTitleStatsSpecifications.hasStatus(statusName);
        }

        Specification<RoomTitleStatsView> typeSpec;
        if (Boolean.TRUE.equals(params.getIsMyTypes())) {
            typeSpec = RoomTitleStatsSpecifications.hasUserTypes(params.getTypes(), currentUserId);
        } else {
            typeSpec = RoomTitleStatsSpecifications.hasRoomTypes(params.getTypes());
        }

        Specification<RoomTitleStatsView> searchSpec = RoomTitleStatsSpecifications
                .hasUserTitleNameLike(params.getSearch());

        Specification<RoomTitleStatsView> spec = Specification
                .where(RoomTitleStatsSpecifications.hasRoomId(roomId))
                .and(statusSpec)
                .and(typeSpec)
                .and(searchSpec);

        Pageable pageable = PagingHelper.toPageable(params);

        Page<RoomTitleStatsView> result = roomTitleStatsRepository.findAll(spec, pageable);
        List<UUID> titleIds = new ArrayList<>();
        for (RoomTitleStatsView item : result.getContent()) {
            if (item.getId() != null) {
                titleIds.add(item.getId());
            }
        }

        List<RoomTitleEntity> entities = repository.findAllById(titleIds);

        List<UUID> targetUserIds = new ArrayList<>();
        if (params.getMemberIds() != null) {
            targetUserIds.addAll(params.getMemberIds());
        }
        if (currentUserId != null && !targetUserIds.contains(currentUserId)) {
            targetUserIds.add(currentUserId);
        }
        List<RoomTitleLinkEntity> allLinks = linkRepository.findByRoomTitleIdInAndUserIdIn(titleIds,
                targetUserIds);

        Map<UUID, List<RoomTitleLinkEntity>> linksByTitleId = allLinks.stream()
                .collect(Collectors.groupingBy(l -> l.getRoomTitle().getId()));
        Map<UUID, RoomTitleEntity> entityMap = entities.stream()
                .collect(Collectors.toMap(RoomTitleEntity::getId, e -> e));

        Map<UUID, UserShortDto> usersCache = allLinks.stream()
                .map(link -> link.getUserTitleRecord().getUser())
                .distinct()
                .collect(Collectors.toMap(
                        UserEntity::getUserId,
                        user -> userShortMapper.mapTo(user),
                        (existing, replacement) -> existing));

        Page<RoomTitleSummaryDto> page = result.map(statsView -> {
            RoomTitleEntity entity = entityMap.get(statsView.getId());
            if (entity == null)
                return null;

            Double avg = statsView.getAvgRating() != null ? statsView.getAvgRating() : 0.0;
            return roomTitleSummaryMapper.mapTo(entity, avg, linksByTitleId, currentUserId, params.getStatus());
        });

        return new RoomTitlesResponseDto(page, usersCache);
    }

    @Override
    public Page<RoomTitleDetailsDto> getRoomTitlesWithoutLinks(Long roomId, QueryParameters params) {
        Pageable pageable = PagingHelper.toPageable(params);

        Page<RoomTitleEntity> titlePage = repository.findAllPagedByRoom_RoomId(roomId, pageable);

        return titlePage.map(roomTitleDetailsMapper::mapTo);
    }

    @Override
    public Page<RoomTitleWithUserLinksDto> getRoomTitlesWithUserLinks(long roomId, UUID userId,
            RoomTitlesWithSearchQueryParameters queryParameters) {
        Pageable pageable = PagingHelper.toPageable(queryParameters);
        Specification<RoomTitleEntity> spec = Specification
                .where(RoomTitleSpecifications.hasRoomId(roomId))
                .and(RoomTitleSpecifications.hasTitleNameLike(queryParameters.getSearch()));

        Page<RoomTitleEntity> titlePage = repository.findAll(spec, pageable);
        List<UUID> titleIds = titlePage.getContent().stream().map(RoomTitleEntity::getId).toList();

        List<RoomTitleLinkEntity> links = linkRepository.findByRoomTitle_IdInAndUserTitleRecord_User_UserId(titleIds,
                userId);

        Map<UUID, List<RoomTitleLinkEntity>> linksMap = links.stream()
                .collect(Collectors.groupingBy(l -> l.getRoomTitle().getId()));

        return titlePage.map(entity -> {
            RoomTitleWithUserLinksDto dto = roomTitleWithUserLinksMapper.mapTo(entity);
            dto.setLinks(linksMap.getOrDefault(entity.getId(), List.of()).stream()
                    .map(roomTitleLinkShortMapper::mapTo)
                    .collect(Collectors.toList()));
            return dto;
        });
    }
}