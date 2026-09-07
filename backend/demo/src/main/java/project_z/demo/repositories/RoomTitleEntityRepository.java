package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project_z.demo.entity.RoomTitleEntity;

public interface RoomTitleEntityRepository
        extends JpaRepository<RoomTitleEntity, UUID>, JpaSpecificationExecutor<RoomTitleEntity> {
    List<RoomTitleEntity> findByRoom_RoomId(Long roomId);

    boolean existsByRoom_RoomIdAndApiTitleId(Long roomId, Long apiTitleId);

    @Query("SELECT r.titleName FROM RoomTitleEntity r WHERE r.id = :roomTitleId")
    String findTitleNameByRoomTitleId(@Param("roomTitleId") UUID roomTitleId);

    void deleteByIdAndRoom_RoomId(UUID id, Long roomId);

    Page<RoomTitleEntity> findAllPagedByRoom_RoomId(Long roomId, Pageable pageable);
}
