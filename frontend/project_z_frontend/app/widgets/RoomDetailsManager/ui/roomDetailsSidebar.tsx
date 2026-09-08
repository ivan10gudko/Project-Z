import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from '~/shared/ui/Button';
import { Sidebar } from '~/shared/ui/Sidebar';
import { type Room } from "~/entities/room/model/room.types";
import { Link } from 'react-router';
import { RoomDetailsSortControl } from './RoomDetailsFiltersModules/RoomDetailsSortControl';
import { RoomDetailsTypeFilter } from './RoomDetailsFiltersModules/RoomDetailsTypeFilter';
import { RoomDetailsStatusFilter } from './RoomDetailsFiltersModules/RoomDetailsStatusFilter';
import { RoomDetailsMemberFilter } from './RoomDetailsFiltersModules/RoomDetailsMembersFilter';
import { RoomDetailsSearchFilter } from './RoomDetailsFiltersModules/RoomDetailsSearchFilter';
import { useRoomDetailsFilterStore } from '../store/roomDetailsFilter.store';
import { RoomMembersList } from '~/features/manageRoomMembers';

interface RoomDetailsSidebarProps {
  room: Room;
}

export const RoomDetailsSidebar = ({ room }: RoomDetailsSidebarProps) => {
  const { reset, memberIds, setMembers } = useRoomDetailsFilterStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const allMemberIds = room.members.map((m) => m.user.userId);
  return (
    <Sidebar className="w-80 bg-background p-5 rounded-3xl border border-border h-fit shadow-sm">
      <div className="flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar pb-6">


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-primary text-xl leading-tight font-bold">{room.roomName}</h2>
            </div>
          </div>
          <Link
            to={`/rooms/${room.roomId}/settings`}
            className="
              flex
              items-center
              justify-center
              h-10
              w-10
              rounded-xl
              border
              border-border
              bg-card
              hover:bg-background-muted
              hover:border-primary/40
              transition-all
              duration-200
              hover:text-primary
              active:scale-95
            "
          >
            <SettingsIcon fontSize="small" />
          </Link>
        </div>

        <RoomMembersList members={room.members} />

        <div className="pt-5 border-t border-border/60 flex flex-col gap-5">

          <Button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="
              group
              w-full
              flex items-center justify-between
              rounded-xl
              border border-border
              bg-card
              px-4 py-3
              transition-all duration-200
              hover:bg-background-muted
              hover:border-primary/40
              hover:shadow-md
              active:scale-[0.98]
              cursor-pointer
            "
          >
            <span className="
              flex items-center gap-2
              font-semibold
              text-foreground
              transition-colors
              group-hover:text-primary
            ">
              <FilterListIcon fontSize="small" />
              Group Filters
            </span>

            {isFiltersOpen ? (
              <KeyboardArrowUpIcon
                fontSize="small"
                className="transition-transform duration-200 group-hover:text-primary text-foreground"
              />
            ) : (
              <KeyboardArrowDownIcon
                fontSize="small"
                className="transition-transform duration-200 group-hover:text-primary text-foreground"
              />
            )}
          </Button>

          {isFiltersOpen && (
            <div className="flex flex-col gap-4 animate-fadeIn">

              <RoomDetailsStatusFilter />
              <RoomDetailsTypeFilter />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <RoomDetailsSearchFilter />
            <RoomDetailsMemberFilter members={room.members} />
            <RoomDetailsSortControl />

            <Button
              variant="resetFilters"
              className="py-3 mt-1 flex items-center justify-center gap-2"
              onClick={() => reset()}
            >
              <RefreshIcon className="text-sm" /> Reset all filters
            </Button>
          </div>

        </div>
      </div>
    </Sidebar>
  );
};