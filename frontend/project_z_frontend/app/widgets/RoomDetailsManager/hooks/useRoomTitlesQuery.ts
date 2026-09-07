
import { useInfiniteRoomTitles } from "~/features/manageRoomTitles";
import { useRoomDetailsFilterStore } from "~/widgets/RoomDetailsManager";

export const useRoomTitlesQuery = (roomId: number) => {
    const { sortBy, order, types, memberIds, status, isMyTypes, isMyStatus, search } = useRoomDetailsFilterStore();
    return useInfiniteRoomTitles(roomId, {
        sortBy,
        order,
        types,
        memberIds,
        ...(status && { status }),
        ...(isMyTypes && { isMyTypes }),
        ...(isMyStatus && { isMyStatus }),
        ...(search && {search})
    });
};