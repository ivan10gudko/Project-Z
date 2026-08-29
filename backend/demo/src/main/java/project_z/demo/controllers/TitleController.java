package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.Mappers.Mapper;
import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.SameCriteriaRatingResponse;
import project_z.demo.dto.TitleDtos.TitleBatchCreateDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.dto.TitleDtos.TitlePositionUpdateDto;
import project_z.demo.dto.TitleDtos.TitleStatsDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.security.JwtService;
import project_z.demo.services.TitleService;
import project_z.demo.services.UserService;

@RestController
@RequestMapping("/api/v1/titles")
public class TitleController {
    @Autowired
    private Mapper<TitleEntity, TitleDto> titleMapper;
    @Autowired
    private Mapper<TitleEntity, TitlePatchUpdateDto> titlePatchMapper;
    @Autowired
    private TitleService titleService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<TitleDto> createTitle(
            @RequestHeader("Authorization") String token,
            @RequestBody TitleDto titleDto) {
        TitleEntity titleEntity = titleMapper.mapFrom(titleDto);
        TitleEntity response = titleService.addTitle(titleEntity, token);
        return new ResponseEntity<>(titleMapper.mapTo(response), HttpStatus.CREATED);
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> batchCreateTitle(@RequestBody TitleBatchCreateDto titles,
            @RequestHeader("Authorization") String token) {
        titleService.batchCreateTitle(titles, token);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/{userId}/reindex")
    public ResponseEntity<Void> reindex(@PathVariable("userId") UUID userId,
            @RequestHeader("Authorization") String token) {
        titleService.reindexCustomOrder(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PostMapping(path = "/{titleId}/pinTitle")
    public ResponseEntity<TitleDto> pinTitle(
            @PathVariable("titleId") Long titleId,
            @RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        TitleDto updatedTitle = titleService.pinTitle(titleId, userId);
        return new ResponseEntity<>(updatedTitle, HttpStatus.OK);
    }

    @PostMapping(path = "/unpin")
    public ResponseEntity<Void> unpin(@RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        titleService.unpin(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public Page<TitleDto> getTitleListByUserId(@PathVariable("userId") UUID userId, TitleQueryParameters params) {
        return titleService.findAllByUserId(params, userId);
    }

    @GetMapping("/getTitleWithNoLinks/{userId}")
    public Page<TitleDto> getTitleListWithLinksByUserIdAndRoomId(@PathVariable("userId") UUID userId,
            @RequestParam("roomId") long roomId, TitleQueryParameters params) {
        return titleService.findAllWithLinksByUserIdAndRoomId(params, userId, roomId);
    }

    @GetMapping("/getTitleById/{titleId}")
    public ResponseEntity<TitleDto> getMethodName(@PathVariable("titleId") Long titleId) {
        return new ResponseEntity<>(titleService.findOne(titleId), HttpStatus.OK);
    }

    @GetMapping(path = "/mal/{titleMalId}")
    public ResponseEntity<TitleDto> getUserTitleByMalId(@PathVariable("titleMalId") Integer titleMalId,
            @RequestHeader("Authorization") String token) {
        TitleEntity title = titleService.findUserTitleByMalId(titleMalId, token);
        return new ResponseEntity<>(titleMapper.mapTo(title), HttpStatus.OK);
    }

    @GetMapping("/titleStats/{userId}")
    public TitleStatsDto getTitleStatsByUserId(@PathVariable("userId") UUID userId) {
        return titleService.getUserTitlesStats(userId);
    }

    @GetMapping(path = "/mal/{titleMalId}/room")
    public List<TitleDto> getUsersTitlesByMalId(@PathVariable("titleMalId") Integer titleMalId,
            @RequestHeader("Authorization") String token) {
        return titleService.findAllByMalIdInUserRooms(titleMalId, token)
                .stream().map(titleMapper::mapTo).collect(Collectors.toList());
    }

    @GetMapping(path = "/{userId}/WATCHED")
    public ResponseEntity<List<TitleDto>> getWatchedListByUserId(@PathVariable("userId") UUID userId) {
        List<TitleEntity> titleEntitys = titleService.getWatchedList(userId);
        List<TitleDto> response = titleEntitys.stream()
                .map(titleMapper::mapTo)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(path = "/{userId}/PLANNED")
    public ResponseEntity<List<TitleDto>> getWatchListByUserId(@PathVariable("userId") UUID userId) {
        List<TitleEntity> titleEntitys = titleService.getWatchList(userId);
        List<TitleDto> response = titleEntitys.stream()
                .map(titleMapper::mapTo)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(path = "/{titleId}/getSameCriteriaRating")
    public SameCriteriaRatingResponse getNeighborsRating(@PathVariable("titleId") Long titleId,
            @RequestParam String category, @RequestParam Float currentRating) {
        return titleService.getNeighborsRating(titleId, category, currentRating);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PutMapping(path = "/{titleId}")
    public ResponseEntity<TitleDto> fullUpdateTitle(
            @PathVariable("titleId") Long titleId,
            @RequestBody TitleDto titleDto) {
        boolean bookExists = titleService.isExists(titleId);
        TitleEntity titleEntity = titleMapper.mapFrom(titleDto);
        TitleEntity savedTitle = titleService.createTitle(titleEntity);
        TitleDto savedTitleDto = titleMapper.mapTo(savedTitle);
        if (bookExists) {
            return new ResponseEntity<>(savedTitleDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PatchMapping(path = "/{titleId}")
    public ResponseEntity<TitleDto> partialUpdate(
            @PathVariable("titleId") Long titleId,
            @RequestBody TitlePatchUpdateDto titleDto) {
        if (!titleService.isExists(titleId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        TitleDto res = titleService.partialUpdate(titleId, titleDto);
        return new ResponseEntity<>(res,  HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PatchMapping(path = "{titleId}/position")
    public ResponseEntity<Void> titlePositionUpdate(
            @PathVariable("titleId") Long titleId,
            @RequestBody TitlePositionUpdateDto titleDto) {
        titleService.titlePositionUpdate(titleDto.getCustomOrder(), titleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @DeleteMapping(path = "/{titleId}")
    public ResponseEntity<Void> deleteTitleById(
            @PathVariable("titleId") Long titleId) {
        if (!titleService.isExists(titleId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        titleService.deleteById(titleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}