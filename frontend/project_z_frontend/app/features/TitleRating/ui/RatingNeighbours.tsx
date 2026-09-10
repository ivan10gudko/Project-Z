import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSameCriteriaRating } from "../hooks/useSameCriteriaRating";
import { useNavigate } from "react-router";

interface RatingNeighborsProps {
  titleId: number;
  category: string;
  ratingValue: number;
  onClose?: () => void;
  onTitleChange?: (newTitleId: number) => void;
}

export const RatingNeighborsContent = ({
  titleId,
  category,
  ratingValue,
  onClose,
  onTitleChange,
}: RatingNeighborsProps) => {
  const { data, isLoading } = useSameCriteriaRating(titleId, category, ratingValue);
  const navigate = useNavigate();

  const neighbors = data?.titles ?? [];
  const averageRating = data?.avgRating ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && neighbors.length > 0 && currentItemRef.current && containerRef.current) {
      const timeoutId = setTimeout(() => {
        currentItemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, neighbors, titleId]);

  return (
    <div className="flex flex-col gap-2 p-3 bg-card border border-border rounded-xl shadow-2xl w-full min-w-[240px] sm:min-w-[280px] max-w-[320px] md:max-w-[350px]">
      <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2 gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 truncate">
            Live Comparison ({category})
          </span>
          <span className="text-[11px] font-bold text-foreground/90 truncate flex items-center gap-1">
            Average rating: <span className="text-primary font-black">{Number(averageRating).toFixed(2)}</span>
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-1 py-6 text-[11px] font-bold text-foreground/70 text-center">
          Loading comparison...
        </div>
      ) : !neighbors || neighbors.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No records found
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-col gap-0.5 max-h-[285px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar scroll-smooth"
        >
          {neighbors.map((item) => {
            const isCurrent = item.titleId === titleId;

            return (
              <div
                key={item.titleId}
                ref={isCurrent ? currentItemRef : null}
                onClick={() => {
                  if (!isCurrent) {
                    onTitleChange?.(item.titleId); 
                    navigate(`../rating/${item.titleId}`);
                  }
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all text-xs gap-2 ${isCurrent
                  ? "bg-primary/20 border border-primary/40 font-black text-primary shadow-sm cursor-default"
                  : "text-foreground/90 font-semibold hover:bg-border/30 cursor-pointer"
                  }`}
              >
                <span className="truncate flex items-center gap-1 flex-1 min-w-0">
                  {isCurrent && <span className="text-primary text-[10px] flex-shrink-0">➜</span>}
                  <span className="truncate">{item.titleName}</span>
                </span>

                <span className={`font-mono text-[11px] pl-4 flex-shrink-0 ${isCurrent ? "text-primary font-bold" : "text-foreground/70"}`}>
                  {item.ratingValue !== undefined && item.ratingValue !== null
                    ? item.ratingValue.toFixed(1)
                    : "0.0"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};