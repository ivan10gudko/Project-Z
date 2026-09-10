import { Button } from "~/shared/ui/Button";
import {
  titleTypeOptions,
  TitleTypeOptionsColors,
  type TitleRecord,
} from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";
import { formatDate } from "~/shared/helpers";
import { useTitleById } from "~/entities/titleRecord";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { useChangesHighlight } from "~/shared/hooks";
import { HIGHLIGHT_CHANGE_CLASSES } from "~/shared/constants";
import { useMemo } from "react";

interface ViewTitleScreenProps {
  titleId: number | null;
  onClose: () => void;
  onEditClick?: () => void;
  isOwn?: boolean;
}

const useViewTitleChangesHighlight = (title?: TitleRecord | null, duration = 2000) => {
  const watchedData = useMemo(() => ({
    titleName: title?.titleName,
    status: title?.status,
    rating: title?.rating?.overall,
    type: title?.titleType,
    description: title?.description,
  }), [
    title?.titleName,
    title?.status,
    title?.rating?.overall,
    title?.titleType,
    title?.description,
  ]);

  return useChangesHighlight(
    watchedData,
    ["titleName", "status", "rating", "type", "description"],
    duration
  );
};

export const ViewTitleScreen = ({
  titleId,
  onClose,
  onEditClick,
  isOwn,
}: ViewTitleScreenProps) => {
  const { data: title } = useTitleById(titleId ?? undefined);

  const changedFields = useViewTitleChangesHighlight(title, 2000);

  const currentTypeLabel = title
    ? titleTypeOptions.find((o) => o.value === title.titleType)?.label || title.titleType
    : "";
  const typeColorClass = title
    ? TitleTypeOptionsColors[title.titleType] || "text-foreground"
    : "";

  return (
    <div className="flex flex-col max-h-[70vh] h-full justify-between p-2">
      {!title ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground animate-pulse text-sm">
          <ErrorScreen
            title="Title not found"
            message="Could not load the details for this title."
            className="min-h-0 h-full py-8"
          />
        </div>
      ) : (
        <>
          <div className="overflow-y-auto flex-1 pr-2 pb-6 space-y-6 custom-scrollbar min-h-0">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <img
                src={title.imageUrl || "/defaultTitleRecordImage.jpg"}
                alt={title.titleName}
                className="w-42 h-58 object-cover rounded-xl shadow-md border border-border/40 shrink-0"
              />

              <div className="flex-1 space-y-4 w-full">
                <div>
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Title Name
                  </span>
                  <div className={`transition-all duration-700 ease-out rounded-md px-1 inline-block w-full ${changedFields.titleName ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
                    <h2 className="text-2xl font-black text-foreground uppercase leading-tight">
                      {title.titleName}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className={`transition-all duration-700 ease-out rounded-md p-1 ${changedFields.type ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                      Type
                    </span>
                    <span
                      className={`font-black text-sm uppercase tracking-wider ${typeColorClass}`}
                    >
                      {currentTypeLabel}
                    </span>
                  </div>

                  <div className={`transition-all duration-700 ease-out rounded-lg p-1 ${changedFields.status ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                      Status
                    </span>
                    <div className="inline-block">
                      <ReadOnlyStatusBadge status={title.status} />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Rating
                  </span>
                  <div className={`pointer-events-none opacity-90 inline-block transition-all duration-700 ease-out rounded-lg p-0.5 ${changedFields.rating ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
                    <CompactRate
                      currentRating={title.rating?.overall}
                      avgRating={title.avgRating}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-border/40 pt-4">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block ml-1">
                Description & Notes
              </span>
              <div className={`transition-all duration-700 ease-out rounded-xl ${changedFields.description ? HIGHLIGHT_CHANGE_CLASSES : ""}`}>
                <div className="w-full p-4 border-2 border-border/60 bg-card/30 rounded-xl font-medium text-foreground text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                  {title.description?.trim() ? (
                    title.description
                  ) : (
                    <span className="text-muted-foreground italic opacity-60">
                      No description provided yet.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground/60 font-medium px-1 flex justify-between items-center pt-2">
              {title.createdAt && (
                <span className="flex items-center gap-1">
                  <CalendarMonthIcon sx={{ fontSize: 14 }} />
                  Added: {formatDate(title.createdAt)}
                </span>
              )}
              {title.pinned && (
                <span className="text-primary font-bold flex items-center gap-0.5">
                  <PushPinIcon
                    sx={{ fontSize: 14, transform: "rotate(45deg)" }}
                  />
                  Pinned Title
                </span>
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto shrink-0">
        <Button
          onClick={onClose}
          variant="cancel"
          className="w-full sm:flex-1"
        >
          Close
        </Button>

        {isOwn && onEditClick && title && (
          <Button
            onClick={onEditClick}
            variant="save"
            className="w-full sm:flex-2"
          >
            <EditIcon sx={{ fontSize: 18 }} />
            Edit Details
          </Button>
        )}
      </div>
    </div>
  );
};