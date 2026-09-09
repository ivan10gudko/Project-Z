import { useState } from "react";
import { Outlet, useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { RoomSettingsSidebar } from "~/widgets/RoomDetailsSettingsSidebar";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function RoomsSettingsIndexLayout() {
    const { id } = useParams<{ id: string }>();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const roomId = id ? Number(id) : undefined;

    if (!roomId) return <ErrorScreen title="Not found" message="Room with that id not found" />;

    const { userId } = useAuthStore();
    
    const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId!, roomId);
    const { room, isLoading: isRoomLoading } = useRoomDetails(roomId);

    if (isMemberLoading || isRoomLoading) {
        return <div className="p-10 text-foreground">Loading settings...</div>;
    }

    if (!room || !roomMember) {
        return <ErrorScreen title="Access Denied" message="Room not found or you don't have permission to view settings." />;
    }

    return (
        <div className="relative page-container overflow-x-hidden">
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`
                fixed top-0 left-0 h-full z-50 w-[290px] p-4 bg-background border-r border-border
                transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:transform-none md:transition-none md:h-auto md:w-80 md:p-0 md:bg-transparent md:border-none md:z-0
            `}>
                <RoomSettingsSidebar
                    roomId={roomId}
                    role={roomMember.role}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />
            </div>

            <main className="flex-1 w-full flex flex-col pt-2 pl-2 md:pt-5">
                <div className="md:hidden flex items-center justify-between mb-4 bg-card border border-border p-3 rounded-xl shadow-md">
                    <span className="text-sm font-bold text-foreground">Settings Navigation</span>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 active:scale-95 transition-all text-xs font-semibold cursor-pointer hover:bg-primary/20"
                    >
                        <MenuOpenIcon sx={{ fontSize: 16 }} />
                        <span>Open Menu</span>
                    </button>
                </div>

                <div className="w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}