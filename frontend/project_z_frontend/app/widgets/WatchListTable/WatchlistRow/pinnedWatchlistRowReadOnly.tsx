import React from 'react';
import { useNavigate } from "react-router";
import { ReadOnlyStatusBadge, TitleTypeThemes, TitlePinnedThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import { useTitleFilterStore, type TitleSortType } from "~/features/titleFilter/store/titleFilter.store";
import { useTitleChangesHighlight } from './hooks/useTitleChangesHighlight';
import { ChangeHighlight } from '~/shared/ui/ChangeHighlight';

interface PinnedWatchlistRowReadOnlyProps {
  title: TitleRecord;
  onOpenRatingModal: (title: TitleRecord) => void;
  onRowClick: (title: TitleRecord) => void;
}

export const PinnedWatchlistRowReadOnly = ({ title, onOpenRatingModal, onRowClick }: PinnedWatchlistRowReadOnlyProps) => {
  const navigate = useNavigate();

  const changedFields = useTitleChangesHighlight(title, 1000);

  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
  const pinnedClasses = title.titleType ? TitlePinnedThemes[title.titleType] : "";

  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === ("avgRating" as TitleSortType);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };
  return (
    <div
      onClick={() => onRowClick(title)}
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-3 rounded-xl border-2 transition-all duration-300 w-full min-w-0 relative cursor-pointer ${themeClasses} ${pinnedClasses}`}
    >
      <div className="absolute -top-2.5 left-4 bg-primary text-background text-[9px] tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
        Pinned Title
      </div>

      <div className="flex items-center flex-1 gap-3 min-w-0 max-w-full">
        <div className="w-6 pl-1 flex-shrink-0" />

        <div className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || "/defaultTitleRecordImage.jpg"}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <ChangeHighlight isChanged={changedFields.titleName} className="grid flex-1 min-w-0 px-1">
          <span className="block truncate font-bold text-foreground text-xs sm:text-sm leading-tight w-full">
            {title.titleName}
          </span>
        </ChangeHighlight>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <ChangeHighlight isChanged={changedFields.status}>
          <ReadOnlyStatusBadge status={title.status} />
        </ChangeHighlight>

        <ChangeHighlight isChanged={changedFields.rating} className="pointer-events-none opacity-90 flex-shrink-0 p-0.5">
          <CompactRate currentRating={title.rating?.overall} avgRating={title.avgRating} isAvgView={isAvgView} />
        </ChangeHighlight>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu title={title} isOwn={false} onOpenRatingModal={() => onOpenRatingModal(title)} />
        </div>
      </div>
    </div>
  );
};