import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { CompactRate } from "../../../shared/ui/CompactRate";
import type { Rating } from "~/shared/types";
import { useState, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RatingNeighborsContent } from "./RatingNeighbours";
import { AnimatedList } from "~/shared/ui/AnimatedComps";
import { useChangesHighlight } from "~/shared/hooks";
import { ChangeHighlight } from "~/shared/ui/ChangeHighlight";

interface ReadonlyRatingContentProps {
  ratings: Rating;
  onCancel: () => void;
  titleId: number;
  onTitleChange?: (newTitleId: number) => void;
}

const useRatingChangesHighlight = (ratings: Rating, duration = 2000) => {
  const watchedData = useMemo(() => ratings, [ratings]);

  const keys = Object.keys(ratings) as (keyof Rating)[];

  return useChangesHighlight(watchedData, keys, duration);
};

export const ReadonlyRatingContent = ({
  ratings,
  onCancel,
  onTitleChange,
  titleId,
}: ReadonlyRatingContentProps) => {
  const safeRatings: Rating = Object.keys(ratings).length === 0 ? {} : ratings;
  const [openPopoverKey, setOpenPopoverKey] = useState<string | null>(null);

  const changedFields = useRatingChangesHighlight(safeRatings, 2000);

  const customCategories = Object.keys(safeRatings).filter(
    (key) => key !== "overall"
  );
  const currentOverall = safeRatings.overall;

  const calculateAverage = (): string => {
    const activeValues = customCategories
      .map((key) => safeRatings[key])
      .filter((val): val is number => typeof val === "number" && val > 0);

    if (activeValues.length === 0) return "0.0";

    const sum = activeValues.reduce((acc, current) => acc + current, 0);
    return (sum / activeValues.length).toFixed(1);
  };

  const avgRating = calculateAverage();

  return (
    <div className="flex flex-col max-h-[75vh] sm:max-h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 p-1 sm:p-2 custom-scrollbar">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-2xl sticky top-0 z-10 backdrop-blur-md gap-3 sm:gap-0 transition-all bg-background-muted/40 border-2 border-border/60">
              <div className="flex items-center gap-3 text-muted-foreground">
                <StarRoundedIcon className="text-xl sm:text-2xl opacity-70" />
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest leading-none text-foreground/80">
                    Overall Score
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="shrink-0 scale-[0.8] sm:scale-100 origin-right flex justify-end w-full sm:w-auto pointer-events-none">
                  {/* За бажанням можна обгорнути і overall, якщо треба */}
                  <CompactRate
                    currentRating={currentOverall}
                    isOwn={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 px-2">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-[10px] sm:text-[12px] font-black pl-2 uppercase text-muted-foreground/60 tracking-[0.15em] sm:tracking-[0.2em] italic">
                  Additional Criteria
                </h3>
              </div>

              {currentOverall !== undefined && (
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border w-fit transition-all bg-muted/10 border-border">
                  <CalculateIcon className="text-sm sm:text-base text-muted-foreground/70" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Criteria Avg:
                  </span>
                  <span className="text-xs sm:text-sm font-black px-2 py-0.5 rounded-md transition-all text-muted-foreground bg-muted/20 border border-border/40">
                    {avgRating}
                  </span>
                </div>
              )}
            </div>

            <div className="opacity-90">
              {customCategories.length === 0 ? (
                <div className="text-center p-6 sm:p-8 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-xs sm:text-sm font-medium">
                  No criteria added by user.
                </div>
              ) : (
                <AnimatedList
                  items={customCategories}
                  getKey={(key) => key}
                  className="flex flex-col gap-3 sm:gap-4 w-full"
                  renderItem={(key) => {
                    // Перевіряємо чи змінилося значення для конкретного ключа
                    const isFieldChanged = Boolean(changedFields[key]);

                    return (
                      <ChangeHighlight
                        isChanged={isFieldChanged}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card/40"
                      >
                        <span className="text-xs sm:text-sm font-bold text-muted-foreground capitalize">
                          {key}
                        </span>

                        <div className="flex items-center gap-2">
                          <DropdownMenu.Root
                            open={openPopoverKey === key}
                            onOpenChange={(open) =>
                              setOpenPopoverKey(open ? key : null)
                            }
                          >
                            <DropdownMenu.Trigger asChild>
                              <button className="p-1.5 rounded-lg border border-border/50 bg-background-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                                <CompareArrowsIcon sx={{ fontSize: 16 }} />
                              </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                align="end"
                                side="bottom"
                                sideOffset={8}
                                className="z-[9999] outline-none"
                              >
                                <RatingNeighborsContent
                                  titleId={titleId}
                                  category={key}
                                  ratingValue={safeRatings[key] ?? 0}
                                  onClose={() => setOpenPopoverKey(null)}
                                  onTitleChange={(newTitleId) => {
                                    onTitleChange?.(newTitleId);
                                    setOpenPopoverKey(null);
                                  }}
                                />
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>

                          <div className="scale-[0.85] sm:scale-100 origin-right pointer-events-none">
                            <CompactRate
                              currentRating={safeRatings[key] ?? 0}
                              isOwn={false}
                            />
                          </div>
                        </div>
                      </ChangeHighlight>
                    );
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-border">
        <button
          type="button"
          className="w-full h-12 sm:h-14 rounded-xl bg-card hover:bg-background-muted text-foreground border border-border font-bold transition-all cursor-pointer"
          onClick={onCancel}
        >
          Close
        </button>
      </div>
    </div>
  );
};