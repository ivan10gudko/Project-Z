import {
  UserSearchDropdown,
  UserShortRow,
  type UserProfile,
} from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchBar from "~/shared/ui/SearchBar";

interface MembersStepProps {
  addedUsers: UserProfile[];
  onSearch: (query: string) => void;
  searchResults: UserProfile[];
  onSelect: (user: UserProfile) => void;
  onRemove: (userId: string) => void;
  isLoading: boolean;
}

export const MembersStep = ({
  addedUsers,
  onSearch,
  searchResults,
  onSelect,
  onRemove,
  isLoading,
}: MembersStepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div className="relative space-y-4">
      <SearchBar
        onSearch={onSearch}
        onChange={onSearch}
        placeholder="Search users..."
      />
      {searchResults.length > 0 && (
        <UserSearchDropdown
          results={searchResults}
          mapToDisplayItem={(p) => ({
            userId: p.userId,
            name: p.name,
            nameTag: p.nameTag,
            img: p.img ?? undefined,
          })}
          onSelect={(user) => {
            
            const isAlreadyAdded = addedUsers.some((u) => u.userId === user.userId);
            if (!isAlreadyAdded) {
              onSelect(user);
            }
          }}
          isLoading={isLoading}
          renderAction={(user) => {
            const isAdded = addedUsers.some((u) => u.userId === user.userId);

            if (isAdded) {
              return (
                <span className="text-[11px] font-medium text-foreground-muted bg-background-muted px-2.5 py-1 rounded-lg border border-border flex-shrink-0 select-none">
                  Added
                </span>
              );
            }

            return (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(user);
                }}
                className="p-2 bg-transparent hover:bg-primary/20 border border-border hover:border-primary/40 rounded-full transition-all group flex items-center justify-center flex-shrink-0"
              >
                <AddCircleOutlineIcon
                  className="text-primary group-hover:scale-110 transition-transform"
                  fontSize="small"
                />
              </Button>
            );
          }}
        />
      )}
    </div>

    <div className="bg-background-muted/30 rounded-xl p-2 border border-border h-[380px] flex flex-col">
      <h4 className="text-xs font-bold uppercase p-1 text-muted-foreground mb-3 shrink-0">
        Added Members ({addedUsers.length})
      </h4>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
        {addedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center mt-10">
            No users added yet
          </p>
        ) : (
          addedUsers.map((user: UserProfile) => (
            <div
              key={user.userId}
              className="p-1 border border-border/60 bg-background/50 rounded-lg transition-colors hover:border-border"
            >
              <UserShortRow
                user={user}
                action={
                  <Button
                    variant="altCancel"
                    onClick={() => onRemove(user.userId)}
                    className="w-10 shrink-0"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </Button>
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);