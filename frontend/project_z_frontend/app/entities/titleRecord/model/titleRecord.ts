import type { QueryParams } from "~/shared/types";
import type { Rating } from "~/shared/types/Rating";
import { Status } from "~/shared/types/Status";

export interface TitleRecord {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: Rating,
    status: Status,
    titleType: TitleType,
    description: string;
    imageUrl?: string | null,
    customOrder: number,
    pinned: boolean
    createdAt: string,
    avgRating?: number;
}

export enum TitleType {
    ANIME = "ANIME",
    HENTAI = "HENTAI",
    MANGA = "MANGA",
    MOVIE = "MOVIE",
    SERIES = "SERIES"
}
export interface TitleVisual {
    titleId: number;
    apiTitleId: number;
    titleName: string;
    imageUrl: string;
    titleType: TitleType;
}
export interface TitlePositionUpdate {
    customOrder: number;
    newIndex: number;
    sortMode: string;
}
export const titleTypeOptions = [
    { value: TitleType.ANIME, label: "Anime" },
    { value: TitleType.MANGA, label: "Manga" },
    { value: TitleType.SERIES, label: "Series" },
    { value: TitleType.MOVIE, label: "Movie" },
    { value: TitleType.HENTAI, label: "Hentai" },
];

export const TitleTypeThemes: Record<TitleType, string> = {
    [TitleType.ANIME]: "border-border hover:border-foreground/30",
    [TitleType.MANGA]: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    [TitleType.SERIES]: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40",
    [TitleType.MOVIE]: "bg-orange-500/4 border-amber-500/20 hover:border-amber-500/40",
    [TitleType.HENTAI]: "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
};


export const TitlePinnedThemes: Record<TitleType, string> = {
    [TitleType.ANIME]: "border-primary/70 shadow-[0_0_15px_rgba(255,163,26,0.12)] hover:border-primary",
    [TitleType.MANGA]: "border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500",
    [TitleType.SERIES]: "border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:border-purple-500",
    [TitleType.MOVIE]: "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-500",
    [TitleType.HENTAI]: "border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:border-rose-500",
};

export interface TitleParams extends QueryParams {
    status?: Status;
    search?: string;
    types?: TitleType[];
}



export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt' | 'customOrder'> { }

export interface ManageTitleRecordProps {
    initialData: CreateTitleRecord;
    titleRecord: TitleRecord | null;
}

export interface TitleShort {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: Rating,
    status: Status,
    type: TitleType,
    imageUrl?: string | null,
    createdAt: string,
}
export const TitleTypeOptionsColors: Record<TitleType, string> = {
    [TitleType.ANIME]: "text-foreground/90",
    [TitleType.MANGA]: "text-green-500/90",
    [TitleType.SERIES]: "text-purple-500/90",
    [TitleType.MOVIE]: "text-amber-500/90",
    [TitleType.HENTAI]: "text-red-500/90",
};

export interface TitleStats {
    statusCount: Record<string, number>;
    typeCount: Record<string, number>;
}
export interface SameCriteriaRating {
    titles: Array<TitleRatingComparasionDto>;
    avgRating: number;
}

export interface TitleRatingComparasionDto {
    titleId: number;
    titleName: string;
    ratingValue: number;
}

export const TitleTypeGradientColors: Record<TitleType, string> = {
    [TitleType.ANIME]: "rgba(255, 255, 255, 0.10)",
    [TitleType.MANGA]: "rgba(34, 197, 94, 0.25)",
    [TitleType.SERIES]: "rgba(168, 85, 247, 0.25)",
    [TitleType.MOVIE]: "rgba(245, 158, 11, 0.25)",
    [TitleType.HENTAI]: "rgba(239, 68, 68, 0.25)",
};


export const TitleTypeBorderColors: Record<TitleType, string> = {
    [TitleType.ANIME]: "rgba(255, 255, 255, 0.35)",
    [TitleType.MANGA]: "rgba(34, 197, 94, 0.45)",
    [TitleType.SERIES]: "rgba(168, 85, 247, 0.45)",
    [TitleType.MOVIE]: "rgba(245, 158, 11, 0.45)",
    [TitleType.HENTAI]: "rgba(239, 68, 68, 0.45)",
};