
import type { TitleShort, TitleType, TitleVisual } from "~/entities/titleRecord";
import type { UserShort } from "~/entities/user/model/user.types";
import type { PageResponse, QueryParams, Status } from "~/shared/types";

export interface RoomTitleQueryParameters extends QueryParams {
    types: TitleType[];
    isMyTypes?: boolean;
    status?: Status;
    isMyStatus?: boolean;
    memberIds: string[];
    search?: string;
}

export interface RoomTitleShort {
    id: string;
    titleName: string;
    imageUrl: string;
    titleType: TitleType;
    apiTitleId: number;
}

export interface RoomTitleDetails {
    id: string;
    titleName: string;
    imageUrl?: string | null;
    titleType: TitleType;
    apiTitleId?: number | null;
    addedByUserId: string;
    createdAt: string;
}

export interface RoomTitleLinkShort {
    id: string;
    title: TitleVisual;
    roomTitleId: string;
    createdAt: string;
}

export interface RoomTitleLinkCreate {
    titleId: number;
    roomTitleId: string;
}

export interface RoomTitleLinkDetails {
    id: string;
    title: TitleShort;
    roomTitle: RoomTitleShort;
    createdAt: string;
}

export interface RoomTitleWithSearchQueryParams extends QueryParams {
    search?: string;
}

export interface RoomTitleWithUserLinks {
    id: string;
    titleName: string;
    imageUrl: string;
    titleType: TitleType;
    apiTitleId: number;
    addedByUserId: string;
    links: RoomTitleLinkShort[];
    createdAt: string;
}

export interface RoomTitleSummary {
    roomTitleId: string;
    titleInfo: RoomTitleShort;
    computedAvgRating: number;
    myStatus: Status;
    myTitleInfo: TitleShort;
    userParticipation: TitleUserParticipation[];
}

export interface TitleUserParticipation {
    userId: string;
    status: Status;
    overallRating: number;
    type: TitleType;
}

export interface RoomTitlesResponse extends PageResponse<RoomTitleSummary> {
    usersCache: Record<string, UserShort>;
}

export interface RoomTitleCreateRequest {
    titleName: string;
    imageUrl?: string | null;
    titleType: TitleType;
    apiTitleId?: number;
}

export interface RoomTitleLinkDetailsDto {
    id: string;
    title: TitleShort;
    roomTitle: RoomTitleShort;
    createdAt: string;
}

export interface SuggestedTitleLinkDto {
    title: TitleShort;
    roomTitle: RoomTitleShort
    confidence?: "high" | "medium" | "low" | string;
}

export interface RoomTitleLinkCreateDto {
    titleId: number;
    roomTitleId: string;
}

export interface RoomTitleLinkBatchCreateDto {
    links: RoomTitleLinkCreateDto[];
}