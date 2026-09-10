import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { type TitleRecord } from "~/entities/titleRecord";
import { WatchlistRow } from "./WatchlistRow/watchlistRow";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useReorderWatchlist } from "~/entities/titleRecord/hooks/useReorderWatchlist";
import { useMemo } from "react";
import { WatchlistSkeleton } from "./WatchlistTableSkeleton";
import { PinnedWatchlistRow } from "./WatchlistRow/pinnedWatchlistRow";
import { PinnedWatchlistRowReadOnly } from "./WatchlistRow/pinnedWatchlistRowReadOnly";
import { WatchlistRowReadOnly } from "./WatchlistRow/WatchlistRowReadOnly";
import { AddNewButton } from "~/shared/ui/AddNewButton";
import { AnimatedList } from "~/shared/ui/AnimatedComps";

interface WatchlistTableProps {
  titles: TitleRecord[];
  isLoading?: boolean;
  isOwn: boolean;
  queryKey: unknown[];
}

export const WatchlistTable = ({
  titles,
  isLoading,
  isOwn,
  queryKey,
}: WatchlistTableProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId } = useParams<{ userId: string }>();

  const isCustomOrder = searchParams.get("sortBy") === "customOrder";
  const isFiltered = !!searchParams.get("search") || !!searchParams.get("status");
  const isDragable = isCustomOrder && !isFiltered;
  const showNumber = !isDragable;

  const { reorder, optimisticTitles } = useReorderWatchlist(titles, queryKey, userId);

  const { pinnedTitle, regularTitles } = useMemo(() => {
    const pinned = optimisticTitles.find((t) => t.pinned);
    const regular = optimisticTitles.filter((t) => !t.pinned);
    return { pinnedTitle: pinned, regularTitles: regular };
  }, [optimisticTitles]);

  const openRating = (title: TitleRecord) => navigate(`rating/${title.titleId}`);
  const openView = (title: TitleRecord) => navigate(`view/${title.titleId}`);
  const handleOpenAddModal = () => navigate("add");

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorder(source.index, destination.index);
  };

  if (isLoading) return <WatchlistSkeleton />;

  if (titles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        {isOwn && <AddNewButton onClick={handleOpenAddModal} placeholder="title" />}
      </div>
    );
  }

  const renderOwnList = () => (
    <>
      {pinnedTitle && (
        <PinnedWatchlistRow
          title={pinnedTitle}
          onOpenRatingModal={() => openRating(pinnedTitle)}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="watchlist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2 w-full"
            >
              {regularTitles.map((title, index) => (
                <Draggable
                  key={String(title.titleId)}
                  draggableId={String(title.titleId)}
                  index={index}
                  isDragDisabled={!isDragable}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(isDragable ? provided.dragHandleProps : {})}
                      style={provided.draggableProps.style as React.CSSProperties}
                    >
                      <WatchlistRow
                        title={title}
                        index={index}
                        showNumber={showNumber}
                        onOpenRatingModal={() => openRating(title)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );

  const renderReadOnlyList = () => (
    <div className="flex flex-col gap-2 w-full">
      {pinnedTitle && (
        <PinnedWatchlistRowReadOnly
          title={pinnedTitle}
          onOpenRatingModal={() => openRating(pinnedTitle)}
          onRowClick={openView}
        />
      )}
      <AnimatedList
        items={regularTitles}
        getKey={(title) => String(title.titleId)}
        renderItem={(title, index) => (
          <WatchlistRowReadOnly
            title={title}
            index={index}
            showNumber={showNumber}
            onOpenRatingModal={() => openRating(title)}
            onRowClick={openView}
          />
        )}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {isOwn && <AddNewButton onClick={handleOpenAddModal} placeholder="title" />}
      {isOwn ? renderOwnList() : renderReadOnlyList()}
    </div>
  );
};