
import type { TitleRecord } from "~/entities/titleRecord";

export interface TitleDeletedEventDto {
    titleId: number;
}
export interface TitlePositionUpdateEventDto {
    titleId: number;
    customOrder: number;
    newIndex: number;
    sortMode: "asc" | "desk";
}

export type WatchlistEventDataMap = {
    TITLE_CREATED: TitleRecord;
    TITLE_UPDATED: TitleRecord;
    TITLE_POSITION_UPDATED: TitlePositionUpdateEventDto;
    TITLE_DELETED: TitleDeletedEventDto;
};