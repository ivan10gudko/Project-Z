
import { useInfiniteRoomTitles } from "~/features/manageRoomTitles";
import { useRoomDetailsFilterStore } from "~/widgets/RoomDetailsManager";


export const useRoomTitlesQuery = (
    roomId: number | undefined,
    allMemberIds: string[],
    enabled: boolean = true
) => {
    const { sortBy, order, types, memberIds, isAllMembers, status, isMyTypes, isMyStatus, search } =
        useRoomDetailsFilterStore();

    const effectiveMemberIds = isAllMembers ? allMemberIds : memberIds;

    return useInfiniteRoomTitles(
        roomId!,
        {
            sortBy,
            order,
            types,
            memberIds: effectiveMemberIds,
            ...(status && { status }),
            ...(isMyTypes && { isMyTypes }),
            ...(isMyStatus && { isMyStatus }),
            ...(search && { search }),
        },
        enabled && !!roomId
    );
};