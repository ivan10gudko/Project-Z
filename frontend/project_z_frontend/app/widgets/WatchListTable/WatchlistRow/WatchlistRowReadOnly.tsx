import React from 'react';
import { useNavigate } from "react-router";
import { ReadOnlyStatusBadge, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import { useTitleFilterStore, type TitleSortType } from "~/features/titleFilter/store/titleFilter.store";
import { HIGHLIGHT_CHANGE_CLASSES } from '~/shared/constants';
import { useTitleChangesHighlight } from './hooks/useTitleChangesHighlight';


interface WatchlistRowReadOnlyProps {
  title: TitleRecord;
  index: number;
  showNumber: boolean;
  onOpenRatingModal: (title: TitleRecord) => void;
  onRowClick: (title: TitleRecord) => void;
}

export const WatchlistRowReadOnly = ({ title, index, showNumber, onOpenRatingModal, onRowClick }: WatchlistRowReadOnlyProps) => {
  const navigate = useNavigate();

   const changedFields = useTitleChangesHighlight(title, 1000);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };

  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === "avgRating" as TitleSortType;

  return (
    <div
      onClick={() => onRowClick(title)}
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full min-w-0 cursor-pointer hover:border-border/80 ${themeClasses} ${title.pinned ? "border-primary/30" : ""
        }`}
    >
      <div className="flex items-center flex-1 gap-3 min-w-0 max-w-full">
        {showNumber && !title.pinned && (
          <div className="flex items-center justify-center h-10 w-6 pl-1 select-none flex-shrink-0">
            <span translate="no" className="text-gray-400 font-bold text-sm sm:text-base">
              {index + 1}
            </span>
          </div>
        )}

        {showNumber && title.pinned && <div className="w-6 pl-1 flex-shrink-0" />}

        <div className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || "/defaultTitleRecordImage.jpg"}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <div className={`grid flex-1 min-w-0  transition-all duration-700 ease-out rounded-md px-1 ${changedFields.titleName ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
          <span className="block truncate font-bold text-foreground text-xs sm:text-lg leading-tight w-full">
            {title.titleName}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className={`transition-all duration-700 ease-out rounded-lg ${changedFields.status ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
          <ReadOnlyStatusBadge status={title.status} />
        </div>

        <div className={`pointer-events-none opacity-90 flex-shrink-0 transition-all duration-700 ease-out rounded-lg p-0.5 ${changedFields.rating ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
          <CompactRate
            currentRating={title.rating?.overall}
            avgRating={title.avgRating}
            isAvgView={isAvgView}
          />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu title={title} isOwn={false} onOpenRatingModal={() => onOpenRatingModal(title)} />
        </div>
      </div>
    </div>
  );
};