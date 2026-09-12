import { useEffect, useRef } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { titleRecordKeys } from '~/entities/titleRecord/model/titleRecord.queryKeys';
import type { TitleRecord } from '~/entities/titleRecord';
import { subscribeToWatchlistSse } from '../util/WatchlistSse';

import { useSearchParams } from 'react-router';
import { updateInfiniteQuery } from '~/shared/helpers/updateInfinityQuery';

interface UseWatchlistRealtimeProps {
  isOwn: boolean;
  userId: string | null;
}

export const useWatchlistRealtime = ({ isOwn, userId }: UseWatchlistRealtimeProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (isOwn || !userId) return;

    const queryKeyPattern = [...titleRecordKeys.all, userId];

    const unsubscribe = subscribeToWatchlistSse(userId, {
      onCreated: ({ title }) => {
        queryClient.setQueriesData<InfiniteData<{ content: TitleRecord[]; last: boolean; number: number }>>(
          { queryKey: queryKeyPattern, exact: false },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page, index) => {
                if (index === 0) {
                  return {
                    ...page,
                    content: [title, ...page.content],
                  };
                }
                return page;
              }),
            };
          }
        );
      },

      onUpdated: ({ title }) => {
        queryClient.setQueriesData<InfiniteData<{ content: TitleRecord[]; last: boolean; number: number }>>(
          { queryKey: queryKeyPattern, exact: false },
          (oldData) =>
            updateInfiniteQuery({
              oldData,
              getContent: (page) => page.content,
              setContent: (page, content) => ({ ...page, content }),
              updater: (allItems) =>
                allItems.map((item) =>
                  item.titleId === title.titleId ? { ...item, ...title } : item
                ),
            })
        );

        queryClient.setQueryData(titleRecordKeys.detail(title.titleId), title);
      },

      onPositionUpdated: ({ titleId, customOrder, newIndex, sortMode }) => {
        const currentOrder = searchParamsRef.current.get('order') || 'asc';
        if (sortMode !== currentOrder) {
          queryClient.invalidateQueries({
            queryKey: [...titleRecordKeys.all, userId],
            exact: false,
          });
          return;
        }

        queryClient.setQueriesData<InfiniteData<{ content: TitleRecord[]; last: boolean; number: number }>>(
          { queryKey: queryKeyPattern, exact: false },
          (oldData) =>
            updateInfiniteQuery({
              oldData,
              getContent: (page) => page.content,
              setContent: (page, content) => ({ ...page, content }),
              updater: (allItems) => {
                const currentIndex = allItems.findIndex((item) => item.titleId === titleId);
                if (currentIndex === -1) return allItems;

                const [movedItem] = allItems.splice(currentIndex, 1);
                const updatedItem = { ...movedItem, customOrder };
                allItems.splice(newIndex, 0, updatedItem);

                return [...allItems];
              },
            })
        );
      },

      onDeleted: ({ deleted }) => {
        queryClient.setQueriesData<InfiniteData<{ content: TitleRecord[]; last: boolean; number: number }>>(
          { queryKey: queryKeyPattern, exact: false },
          (oldData) =>
            updateInfiniteQuery({
              oldData,
              getContent: (page) => page.content,
              setContent: (page, content) => ({ ...page, content }),
              updater: (allItems) => allItems.filter((item) => item.titleId !== deleted.titleId),
            })
        );
      },
    });

    return () => {
      unsubscribe();
    };
  }, [isOwn, userId, queryClient]);
};