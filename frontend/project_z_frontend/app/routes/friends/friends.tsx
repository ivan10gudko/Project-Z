import { useState } from "react";
import { Outlet, useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { FriendsSidebar } from "~/features/manageFriends/ui/FriendsSidebar";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import MenuIcon from "@mui/icons-material/Menu";

export default function FriendsLayout() {
    const { userId } = useParams<{ userId: string }>();
    const { userId: currentUserId } = useAuthStore();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isOwnProfile = userId === currentUserId;

    const { counts } = useFriends(userId!, "friends"); 

    if (!userId) throw new Response("Not Found", { status: 404 });

    return (
        <div className="page-container">
            
            <div className="md:hidden w-full">
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-background-muted/40 border border-border/40 text-foreground/90 font-medium backdrop-blur-md active:scale-98 transition-all duration-200 shadow-sm"
                >
                    <MenuIcon className="text-primary scale-110" />
                    <span>Friends Menu</span>
                </button>
            </div>

            <FriendsSidebar 
                userId={userId} 
                friendsCount={counts.friendsCount}
                pendingCount={counts.pendingCount}
                sentCount={counts.sentCount}
                isReadOnly={!isOwnProfile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            /> 

            <main className="flex-1 w-full">
                <Outlet /> 
            </main>
        </div>
    );
}