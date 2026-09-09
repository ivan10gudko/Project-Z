package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.UserEntity;

public interface RoomTitleLinkRepository extends JpaRepository<RoomTitleLinkEntity, UUID> {
        @Query("SELECT COUNT(l) > 0 FROM RoomTitleLinkEntity l " +
                        "JOIN l.userTitleRecord t " +
                        "WHERE l.roomTitle.id = :roomTitleId " +
                        "AND t.user.userId = :userId")
        boolean existsByRoomTitleIdAndUserId(@Param("roomTitleId") UUID roomTitleId,
                        @Param("userId") UUID userId);

        List<RoomTitleLinkEntity> findByRoomTitle_Id(UUID roomTitleId);

        List<RoomTitleLinkEntity> findByRoomTitle_IdInAndUserTitleRecord_User_UserId(List<UUID> roomTitleIds,
                        UUID userId);

        @Query("SELECT l FROM RoomTitleLinkEntity l " +
                        "WHERE l.roomTitle.room.id = :roomId " +
                        "AND l.userTitleRecord.user.userId = :userId")
        List<RoomTitleLinkEntity> findLinksByRoomIdAndUserId(@Param("roomId") long roomId,
                        @Param("userId") UUID userId);

        List<RoomTitleLinkEntity> findByUserTitleRecord_User_UserIdAndRoomTitle_Room_RoomId(UUID userId, Long roomId);

        void deleteByUserTitleRecord_TitleIdAndRoomTitle_Id(Long titleId, UUID roomTitleId);

        void deleteByRoomTitle_Id(UUID roomTitleId);

        @Query("SELECT l FROM RoomTitleLinkEntity l " +
                        "JOIN FETCH l.userTitleRecord t " +
                        "JOIN FETCH t.user " +
                        "WHERE l.roomTitle.id IN :roomTitleIds " +
                        "AND t.user.id IN :userIds")
        List<RoomTitleLinkEntity> findByRoomTitleIdInAndUserIdIn(
                        @Param("roomTitleIds") List<UUID> roomTitleIds,
                        @Param("userIds") List<UUID> userIds);

        @Query("SELECT DISTINCT t.user FROM RoomTitleLinkEntity l " +
                        "JOIN l.userTitleRecord t " +
                        "WHERE l.roomTitle.id IN :roomTitleIds " +
                        "AND t.user.id IN :userIds")
        List<UserEntity> findUniqueUsersByLinks(@Param("roomTitleIds") List<UUID> roomTitleIds,
                        @Param("userIds") List<UUID> userIds);
}
