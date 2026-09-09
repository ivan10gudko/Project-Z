import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { Dropdown } from "~/shared/ui/DropDown";
import {
  DropdownItem,
  DeleteDropdownItem,
} from "~/shared/ui/DropDown/DropDown";
import type { RoomTitleDetails } from "~/features/manageRoomTitles/model/roomTitle.types";
import { useNavigate } from "react-router";

interface RoomTitleActionMenuProps {
  item: RoomTitleDetails;
  onDelete: () => void;
  canManage: boolean;
}

export const RoomTitleActionMenu = ({
  item,
  onDelete,
  canManage,
}: RoomTitleActionMenuProps) => {
  const navigate = useNavigate();
  const itemId = item.id;
  return (
    <>
      <Dropdown
        align="end"
        trigger={
          <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground cursor-pointer">
            <MoreVert sx={{ fontSize: 20 }} />
          </div>
        }
      >
        <DropdownItem
          onClick={() => navigate(`links/${itemId}`)}
          icon={<LinkIcon sx={{ fontSize: 16 }} />}
        >
          View Links
        </DropdownItem>

        {canManage && (
          <>
            <DropdownItem
              onClick={() => navigate(`edit/${itemId}`)}
              icon={<Edit sx={{ fontSize: 16 }} />}
            >
              Edit
            </DropdownItem>
            <div className="h-px bg-border my-1" />
            <DeleteDropdownItem onDelete={onDelete} />
          </>
        )}
      </Dropdown>
    </>
  );
};
