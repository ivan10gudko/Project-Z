import SearchBar from "~/shared/ui/SearchBar";
import { useRoomDetailsFilterStore } from "../../store/roomDetailsFilter.store";

export const RoomDetailsSearchFilter = () => {
    const { search, setSearch } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
                <label className="text-[13px] uppercase font-bold text-muted-foreground px-1">
                    Search Titles
                </label>
            </div>

            <div className="w-full">
                <SearchBar
                    key={search}
                    onSearch={setSearch}
                    className="w-full"
                    initialValue={search}
                    debounceMs={400}
                />
            </div>
        </div>
    );
};