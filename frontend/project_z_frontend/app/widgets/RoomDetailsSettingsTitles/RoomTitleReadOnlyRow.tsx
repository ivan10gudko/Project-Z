import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router";
import { TitleTypeThemes, TitleType, type TitleShort, getTitleThemeClassname } from "~/entities/titleRecord";
import type { RoomTitleWithUserLinks } from "~/features/manageRoomTitles";
import { useRoomTitleLinkActions } from "~/features/manageRoomTitles";
import { LinkItem } from "~/features/manageRoomTitles/ui/LinkItem";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
interface RoomTitleRowProps {
  title: RoomTitleWithUserLinks;
  isDraggingOver?: boolean;
}

const HOVER_EXPAND_DELAY_MS = 700; 



export const RoomTitleReadOnlyRowShort = ({
  title,
  isDraggingOver,
}: RoomTitleRowProps) => {
  const [isOpenManual, setIsOpenManual] = useState(false);
  const [isDragOpen, setIsDragOpen] = useState(false);

  const themeClasses = getTitleThemeClassname(title.titleType);
  const borderClass = themeClasses ? "" : "border-border/50";

  const { id: roomId } = useParams<{ id: string }>();
  const { deleteLink } = useRoomTitleLinkActions(Number(roomId));

  
  useEffect(() => {
    if (!isDraggingOver) {
      setIsDragOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsDragOpen(true);
    }, HOVER_EXPAND_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isDraggingOver]);

  
  const isOpen = isOpenManual || isDragOpen;

  const handleDeleteLink = (linkId: string | number) => {
    deleteLink({
      roomTitleLinkId: String(linkId),
      roomTitleId: String(title.id),
    });
  };

  return (
    <div
      className={`group/row flex flex-col bg-card rounded-xl border ${borderClass} transition-all duration-300 w-full overflow-hidden ${themeClasses}`}
    >
      <div className="flex items-center gap-4 p-2 w-full min-w-0">
        <div className="w-[20px]" />

        <div className="relative h-10 w-16 flex-shrink-0">
          <img
            src={title.imageUrl || DEFAULT_IMAGE_PATH}
            className="h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm">
            {title.titleName}
          </span>
        </div>

        <div className="ml-auto flex items-center pr-2">
          <button
            type="button"
            onClick={() => setIsOpenManual((prev) => !prev)}
            className={`p-1 hover:bg-border/50 rounded-lg transition-all text-foreground cursor-pointer ${
              isOpen ? "rotate-180" : ""
            }`}
            title={isOpen ? "hide" : "Expand linked titles"}
          >
            <ExpandMoreIcon sx={{ fontSize: 22 }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="w-full flex flex-col gap-2 p-3 bg-black/25 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Linked title
            </span>
          </div>

          {!title.links || title.links.length === 0 ? (
            <p className="p-2 text-center text-muted-foreground text-xs italic">
              No links found.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {title.links.map((link) => (
                <LinkItem
                  key={link.id}
                  title={link.title}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};