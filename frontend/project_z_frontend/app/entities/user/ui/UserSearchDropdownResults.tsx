import React from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { UserAvatar } from "./UserAvatar";

export interface SearchDisplayItem {
  userId: string;
  name: string;
  nameTag: string;
  img?: string;
}

interface UserSearchDropdownProps<T> {
  results: T[];
  mapToDisplayItem: (item: T) => SearchDisplayItem;
  onSelect: (item: T) => void;
  onClose?: () => void;
  isLoading?: boolean;
  renderAction?: (item: T, display: SearchDisplayItem) => React.ReactNode;
  compact?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  isFetchingNextPage?: boolean;
}

export const UserSearchDropdown = <T,>({
  results,
  onSelect,
  onClose,
  mapToDisplayItem,
  isLoading,
  renderAction,
  compact = false,
  onScroll,
  isFetchingNextPage = false,
}: UserSearchDropdownProps<T>) => {
  if (compact) {
    return (
      <div
        onScroll={onScroll}
        className="w-full min-w-0 bg-card border border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent"
      >
        {isLoading ? (
          <div className="text-xs text-foreground-muted p-4 animate-pulse">
            Searching users...
          </div>
        ) : results.length === 0 ? (
          <div className="text-xs text-foreground-muted/60 p-4 italic">
            No users found
          </div>
        ) : (
          <>
            {results.map((user) => {
              const display = mapToDisplayItem(user);

              return (
                <div
                  key={display.userId}
                  onClick={() => onSelect(user)}
                  className="flex items-center gap-3 px-4 py-2 min-w-0 hover:bg-primary/10 cursor-pointer transition-colors border-b border-border/40 last:border-none"
                >
                  <UserAvatar name={display.name} src={display.img} size="sm" />

                  <div className="flex flex-col min-w-0 flex-1 py-1">
                    <span className="text-sm font-semibold truncate text-foreground">
                      {display.name}
                    </span>

                    <span className="text-xs text-primary truncate">
                      @{display.nameTag}
                    </span>
                  </div>

                  {renderAction && (
                    <div
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {renderAction(user, display)}
                    </div>
                  )}
                </div>
              );
            })}

            {isFetchingNextPage && (
              <div className="text-center py-2 text-xs text-foreground-muted animate-pulse">
                Loading more...
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          {isLoading
            ? "Searching..."
            : results.length > 0
              ? "Results"
              : "No users found"}
        </span>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <div
        onScroll={onScroll}
        className="max-h-[280px] overflow-y-auto custom-scrollbar relative"
      >
        {isLoading ? (
          <div className="p-8 text-center text-foreground-muted text-sm">
            Loading...
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-foreground-muted gap-2">
            <SearchOffIcon className="opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          results.map((user) => {
            const display = mapToDisplayItem(user);

            return (
              <div
                onClick={() => onSelect(user)}
                key={display.userId}
                className="flex items-center justify-between gap-3 p-4 transition-colors border-b border-border last:border-0 hover:bg-background-muted cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UserAvatar name={display.name} src={display.img} size="sm" />

                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {display.name}
                    </p>

                    <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-medium mt-0.5">
                      @{display.nameTag}
                    </p>
                  </div>
                </div>

                {renderAction && (
                  <div onClick={(e) => e.stopPropagation()}>
                    {renderAction(user, display)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {results.length > 3 && (
        <div className="h-4 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-4 relative" />
      )}
    </div>
  );
};
