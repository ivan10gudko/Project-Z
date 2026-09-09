import { useState } from "react";
import { Outlet, redirect, useParams } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthStore } from "~/features/auth";
import { RoomRequestsSidebar } from "~/features/manageRoomRequests";

export default function RoomsUserRequestsLayout() {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {userId} = useAuthStore();

    if(!userId){
        return redirect("/auth/login");
    }

    return (
        <div className="page-container">
            
            <div className="md:hidden w-full">
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-background-muted/40 border border-border/40 text-foreground/90 font-medium backdrop-blur-md active:scale-98 transition-all duration-200 shadow-sm"
                >
                    <MenuIcon className="text-primary scale-110" />
                    <span>Rooms requests menu</span>
                </button>
            </div>

            <RoomRequestsSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userId = {userId}
            /> 

            <main className="flex-1 w-full">
                <Outlet /> 
            </main>
        </div>
    );
}