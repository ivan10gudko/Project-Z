import { useMemo } from "react";
import { useAuthStore } from "~/features/auth";
import { TitleFilters } from "~/features/titleFilter";
import { useTitlesQuery } from "~/features/titleFilter/hooks/useTitlesQuery";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useTitleStats } from "~/features/titleFilter/hooks/useTitleStats";


import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { WatchlistTable } from "~/widgets/WatchListTable";
import { useWatchlistRealtime } from "~/features/WatchlistSSe";

export const WatchListPage = ({ userId }: { userId: string | null }) => {
  const currentSessionUserId = useAuthStore(state => state.userId);
  const isOwn = Boolean(currentSessionUserId && currentSessionUserId === userId);

  useWatchlistRealtime({ isOwn, userId });

  const {
    search, sortBy, order, status, types,
    setSearch,
    setSortFromUrl,
    setStatusFromUrl,
    setOrderFromUrl,
    setTypesFromUrl

  } = useTitleFilterStore();

  const filters = { search, sortBy, order, status, types };

  useSyncUrl(filters, {
    search: setSearch,
    sortBy: setSortFromUrl,
    status: setStatusFromUrl,
    order: setOrderFromUrl,
    types: setTypesFromUrl,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, queryKey } = useTitlesQuery(userId);

  const { data: stats } = useTitleStats(userId);

  const allTitles = useMemo(() => {
    return data?.pages.flatMap(page => page.content) || [];
  }, [data]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">

      <FilterResponsiveWrapper pageTitle="Watchlist filters">
        <TitleFilters
          statusCount={stats?.statusCount}
          typeCount={stats?.typeCount}
        />
      </FilterResponsiveWrapper>

      <main className="flex-1 flex flex-col gap-4">
        <WatchlistTable
          titles={allTitles}
          isLoading={isLoading}
          isOwn={isOwn}
          queryKey={queryKey}
        />

        <div className="py-10 flex justify-center">
          <InfiniteScrollLoader
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </main>
    </div>
  );
};