package project_z.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;

import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.SameCriteriaRatingResponse;
import project_z.demo.dto.TitleDtos.TitleBatchCreateDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.TitleDtos.TitleShortWithLinksToRoomTitleDto;
import project_z.demo.dto.TitleDtos.TitleStatsDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;

public interface TitleService {
    TitleEntity createTitle(TitleEntity title);

    void batchCreateTitle(TitleBatchCreateDto titles, String token);

    List<TitleEntity> findAll();

    TitleDto findOne(Long titleId);

    TitleEntity findOneEntity(Long titleId);

    boolean isExists(Long titleId);

    TitleDto partialUpdate(Long titleId, TitlePatchUpdateDto titleEntity);

    void deleteById(Long id);

    TitleEntity addTitle(TitleEntity titleEntity, String token);

    List<TitleEntity> getWatchedList(UUID userid);

    List<TitleEntity> getWatchList(UUID userid);

    TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity);

    TitleEntity findUserTitleByMalId(Integer titleMalId, String token);

    List<TitleEntity> findAllByMalIdInUserRooms(Integer titleMalId, String token);

    Page<TitleDto> findAllWithLinksByUserIdAndRoomId(TitleQueryParameters params,UUID userId, long roomId);

    Page<TitleDto> findAllByUserId(TitleQueryParameters parameters, UUID userId);

    void titlePositionUpdate(Double newPosition, Long titleId);

    void reindexCustomOrder(UUID userId);

    TitleDto pinTitle(Long titleId, UUID userId);

    void unpin(UUID userId);

    SameCriteriaRatingResponse getNeighborsRating(Long titleId, String category, Float currentRating);

    TitleStatsDto getUserTitlesStats(UUID userId);
}
