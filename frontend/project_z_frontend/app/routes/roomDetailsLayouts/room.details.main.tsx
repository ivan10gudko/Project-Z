import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import {
  RoomDetailsSidebar,
  useRoomTitlesQuery,
} from "~/widgets/RoomDetailsManager";
import { Outlet } from "react-router";
import { useRoomDetailsFilterStore } from "~/widgets/RoomDetailsManager/store/roomDetailsFilter.store";

export default function RoomDetailsMainPage() {
  const { id } = useParams<{ id: string }>();
  const roomId = id ? Number(id) : undefined;

  const { resetMembers } = useRoomDetailsFilterStore();
  const prevRoomId = useRef<string | undefined>(undefined);
  const { room, isLoading } = useRoomDetails(roomId);

  useEffect(() => {
    if (roomId && prevRoomId.current !== id) {
      resetMembers();
    }
    prevRoomId.current = id;
  }, [roomId, resetMembers]);

  const allMemberIds = room?.members.map((m) => m.user.userId) ?? [];
  const { data } = useRoomTitlesQuery(roomId, allMemberIds, !!room);

  if (!roomId) {
    return <ErrorScreen title="Not found" message="Room with that id not found" />;
  }

  if (isLoading || !room) {
    return (
      <div className="p-10 text-foreground bg-background min-h-screen">
        Loading room...
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="w-full lg:w-auto flex flex-col">
        <RoomDetailsSidebar room={room} />
      </div>
      <Outlet />
    </div>
  );
}