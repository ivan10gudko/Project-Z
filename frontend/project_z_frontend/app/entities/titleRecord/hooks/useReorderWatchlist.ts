import { useState, useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";
import { useSearchParams } from "react-router";
import { notify } from "~/shared/lib";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";

export const useReorderWatchlist = (titles: TitleRecord[], queryKey: unknown[], userId: string | undefined) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [optimisticTitles, setOptimisticTitles] = useState<TitleRecord[]>(titles);
  const isMutating = useRef(false);

  const sortMode = searchParams.get('order') || 'asc';
  const isDesc = sortMode === 'desc';

  useEffect(() => {
    if (isMutating.current) return;

    const unique = titles.filter(
      (t, i, arr) => arr.findIndex(x => x.titleId === t.titleId) === i
    );
    setOptimisticTitles(unique);
  }, [titles]);

  const reorder = async (sourceIndex: number, destinationIndex: number) => {
    const reordered = Array.from(optimisticTitles);
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    const movedTitleId = optimisticTitles[sourceIndex].titleId;
    const newOrderValue = calculateNewOrder(reordered, destinationIndex, movedTitleId, isDesc);

    if (newOrderValue === null) {
      if (!userId) return;
      await titleRecordService.reindexCustomOrder(userId);
      await queryClient.invalidateQueries({ queryKey });
      return;
    }

    isMutating.current = true;
    setOptimisticTitles(reordered);

    queryClient.setQueryData<InfiniteData<PageResponse<TitleRecord>>>(
      queryKey,
      (oldData) => updateInfiniteQuery({
        oldData,
        getContent: (page) => page.content,
        setContent: (page, newContent) => ({ ...page, content: newContent }),
        updater: (allItems) => {
          const movedItemIndex = allItems.findIndex(item => item.titleId === movedTitleId);
          if (movedItemIndex === -1) return allItems;

          const [movedItem] = allItems.splice(movedItemIndex, 1);
          const nextReordered = [...allItems];
          nextReordered.splice(destinationIndex, 0, { ...movedItem, customOrder: newOrderValue });
          return nextReordered;
        }
      })
    );

    try {
      await titleRecordService.patchCustomOrder(movedTitleId, {
        customOrder: newOrderValue,
        newIndex: destinationIndex,
        sortMode,
      });
    } catch {
      setOptimisticTitles(titles);
      await queryClient.invalidateQueries({ queryKey });
      notify.error("Failed to save position");
    } finally {
      isMutating.current = false;
    }
  };

  return { reorder, optimisticTitles };
};