import { createSseConnection } from "~/shared/api/SseClient";
import type { TitleRecord } from "~/entities/titleRecord";
import type {
    TitleDeletedEventDto,
    TitlePositionUpdateEventDto,
    WatchlistEventDataMap
} from "../model/watchlistSSe.types";

export const subscribeToWatchlistSse = (
    targetUserId: string,
    handlers: {
        onCreated?: (data: { title: TitleRecord }) => void;
        onUpdated?: (data: { title: TitleRecord }) => void;
        onPositionUpdated?: (data: TitlePositionUpdateEventDto ) => void;
        onDeleted?: (data: { deleted: TitleDeletedEventDto }) => void;
    }
) => {
    const sessionId = crypto.randomUUID();
    const url = `/sse/watchlist/connect?sessionId=${sessionId}&targetUserId=${targetUserId}`;

    return createSseConnection<WatchlistEventDataMap>(
        url,
        {
            TITLE_CREATED: (data) => handlers.onCreated?.({ title: data }),
            TITLE_UPDATED: (data) => handlers.onUpdated?.({ title: data }),
            TITLE_POSITION_UPDATED: (data) => handlers.onPositionUpdated?.( data ),
            TITLE_DELETED: (data) => handlers.onDeleted?.({ deleted: data }),
        },
        (err) => {
            console.warn("Watchlist SSE connection error, reconnecting...", err);
        }
    );
};