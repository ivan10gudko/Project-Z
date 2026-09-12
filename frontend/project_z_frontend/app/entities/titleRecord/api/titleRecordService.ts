import { type CreateTitleRecord, type SameCriteriaRating, type TitleParams, type TitlePositionUpdate, type TitleRecord, type TitleStats } from "../model/titleRecord"
import type { PageResponse } from "~/shared/types";
import { apiClient } from "~/shared/api";
import { Status } from "~/shared/types/Status";
import type { Rating } from "~/shared/types/Rating";


export interface ActionOptions {
    apiTitleId?: number | null;
    initialData: CreateTitleRecord;
    existingTitle?: TitleRecord | null;
}

export interface RateOptions extends ActionOptions {
    score: number | Rating; // {} - for delete
}


interface TitleRecordService {

    get(userId: string, params?: TitleParams): Promise<PageResponse<TitleRecord>>;
    getTitlesWithNoLinksToRoom(userId: string, roomId: number, params?: TitleParams): Promise<PageResponse<TitleRecord>>;
    getById(titleId: number): Promise<TitleRecord>;
    post(titleData: CreateTitleRecord): Promise<TitleRecord>;
    put(titleId: number, titleData: TitleRecord): Promise<TitleRecord>;
    patch(titleId: number, titleData: Partial<TitleRecord>): Promise<TitleRecord>;
    delete(titleId: number): Promise<void>;
    patchCustomOrder(titleId: number, dto: TitlePositionUpdate): Promise<void>;
    reindexCustomOrder(userId: string): Promise<void>;
    getWatched(userId: string): Promise<Array<TitleRecord>>;
    getPlanned(userId: string): Promise<Array<TitleRecord>>;
    getByApiTitleId(externalProviderId: number): Promise<TitleRecord>;
    pinTitle(titleId: number): Promise<TitleRecord>;
    unpin(): Promise<void>;
    getSameCriteriaRating(titleId: number, category: string, currentRating: number): Promise<SameCriteriaRating>;
    rate(options: RateOptions): Promise<TitleRecord>;
    clearRating(options: ActionOptions): Promise<TitleRecord>;
    moveToPlanned(options: ActionOptions): Promise<TitleRecord>;
    markAsWatched(options: ActionOptions): Promise<TitleRecord>;
    markAsDropped(options: ActionOptions): Promise<TitleRecord>;
    getTitleStats(userId: string): Promise<TitleStats>;
    saveAction(options: ActionOptions & { data: Partial<TitleRecord> }): Promise<TitleRecord>;
}

export const titleRecordService: TitleRecordService = {
    async get(userId, params) {
        const response = await apiClient.get(`/titles/${userId}`, {
            params
        });

        return response.data;
    },
    async getTitlesWithNoLinksToRoom(userId, roomId, params) {
        const { data } = await apiClient.get(`/titles/getTitleWithNoLinks/${userId}`, {
            params: {
                roomId,
                ...params
            }
        })
        return data;
    },

    async getById(titleId) {
        const response = await apiClient.get(`/titles/getTitleById/${titleId}`);
        return response.data;
    },
    
    async getSameCriteriaRating(titleId, category, currentRating) {
        const response = await apiClient.get(`/titles/${titleId}/getSameCriteriaRating`, {
            params: {
                category: category,
                currentRating: currentRating

            }
        });

        return response.data;
    },
    async pinTitle(titleId) {
        const response = await apiClient.post(`/titles/${titleId}/pinTitle`);
        return response.data;
    },
    async unpin() {
        await apiClient.post("/titles/unpin");
    },
    async post(titleData) {
        const response = await apiClient.post(`/titles`, titleData);
        return response.data;
    },

    async put(titleId, titleData) {
        const response = await apiClient.put(`/titles/${titleId}`, titleData);

        return response.data;
    },

    async patch(titleId, titleData) {
        const response = await apiClient.patch(`/titles/${titleId}`, titleData);

        return response.data;
    },
    async patchCustomOrder(titleId, dto) {
        await apiClient.patch(`titles/${titleId}/position`, dto );

    },
    async reindexCustomOrder(userId) {
        await apiClient.post(`titles/${userId}/reindex`);
    },
    async delete(titleId) {
        await apiClient.delete(`/titles/${titleId}`);
    },

    async getWatched(userId) {
        const response = await apiClient.get(`/titles/${userId}/WATCHED`);

        return response.data;
    },

    async getPlanned(userId) {
        const response = await apiClient.get(`/titles/${userId}/PLANNED`);

        return response.data;
    },

    async getByApiTitleId(apiTitleId) {
        const response = await apiClient.get(`/titles/mal/${apiTitleId}`);

        return response.data;
    },

    async saveAction({ apiTitleId, data, initialData, existingTitle }) {
        //try to use title fetched before
        // if not search in database
        const targetId = existingTitle?.titleId;


        if (targetId) {
            return this.patch(targetId, data);
        }

        if (apiTitleId && typeof apiTitleId === 'number') {
            const existing = await this.getByApiTitleId(apiTitleId).catch(() => null);
            if (existing) return this.patch(existing.titleId, data);
        }

        return this.post({ ...initialData, ...data });
    },

    async rate({ apiTitleId, score, initialData, existingTitle }) {
        const rating = typeof score === 'number' ? { overall: score } : score;
        console.log(rating);
        return this.saveAction({ apiTitleId, data: { rating }, initialData, existingTitle });
    },

    async clearRating({ apiTitleId, initialData, existingTitle }) {
        return this.rate({ apiTitleId, score: {}, initialData, existingTitle })
    },

    async moveToPlanned(options) {
        return this.saveAction({ ...options, data: { status: Status.PLANNED } });
    },

    async markAsWatched(options) {
        return this.saveAction({ ...options, data: { status: Status.WATCHED } });
    },

    async markAsDropped(options) {
        return this.saveAction({ ...options, data: { status: Status.DROPPED } });
    },
    async getTitleStats(userId) {
        const response = await apiClient.get(`/titles/titleStats/${userId}`);
        return response.data;
    }
};