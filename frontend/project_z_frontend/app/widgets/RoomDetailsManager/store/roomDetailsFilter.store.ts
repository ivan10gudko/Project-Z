import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RoomDetailsSortVariants } from '~/entities/room';
import type { TitleType } from '~/entities/titleRecord';
import type { Status } from '~/shared/types';
import type { SortOrder } from '~/shared/types/api';

interface RoomFilterState {
    sortBy: RoomDetailsSortVariants;
    order: SortOrder;
    memberIds: string[];
    types: TitleType[];
    status?: Status;
    isMyTypes: boolean;
    isMyStatus: boolean;
    search: string;
    setSort: (sortBy: RoomDetailsSortVariants) => void;
    toggleOrder: () => void;
    toggleType: (type: TitleType) => void;
    toggleMember: (memberId: string) => void;
    setMembers: (memberIds: string[]) => void;
    setStatus: (status: Status | undefined) => void;
    setIsMyTypes: (isMyTypes: boolean) => void;
    setIsMyStatus: (isMyStatus: boolean) => void;
    setSearch: (search: string) => void;
    reset: () => void;
}

export const useRoomDetailsFilterStore = create<RoomFilterState>()(
    persist(
        (set) => ({
            status: undefined,
            types: [],
            sortBy: RoomDetailsSortVariants.avgRating,
            order: 'desc',
            memberIds: [],
            isMyTypes: false,
            isMyStatus: false,
            search: '',
            setSort: (sortBy) => set({ sortBy }),
            toggleOrder: () => set((state) => ({
                order: state.order === 'asc' ? 'desc' : 'asc'
            })),
            toggleMember: (memberId) => set((state) => ({
                memberIds: state.memberIds.includes(memberId)
                    ? state.memberIds.filter((id) => id !== memberId)
                    : [...state.memberIds, memberId]
            })),
            setMembers: (memberIds) => set({ memberIds }),
            setStatus: (status) => set({ status }),
            setIsMyTypes: (isMyTypes) => set({ isMyTypes }),
            setIsMyStatus: (isMyStatus) => set({ isMyStatus }),
            setSearch: (search) => set({ search }),
            toggleType: (type) => set((state) => ({
                types: state.types.includes(type)
                    ? state.types.filter((t) => t !== type)
                    : [...state.types, type]
            })),
            reset: () => set({
                types: [],
                status: undefined,
                sortBy: RoomDetailsSortVariants.avgRating,
                order: 'desc',
                memberIds: [],
                isMyTypes: false,
                isMyStatus: false,
                search: '',
            }),
        }),
        {
            name: 'room-details-filters-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sortBy: state.sortBy,
                order: state.order,
                memberIds: state.memberIds,
                types: state.types,
                status: state.status,
                isMyTypes: state.isMyTypes,
                isMyStatus: state.isMyStatus,
                search: state.search,
            }),
        }
    )
);