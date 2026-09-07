import { useAuthStore } from "~/features/auth";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { Sidebar } from "~/shared/ui/Sidebar";
import LogoutButton from "~/features/auth/ui/LogoutButton";
import { NavLink } from "react-router";

const NAV_LINKS = [
  {
    key: "profile",
    label: "Profile",
    getPath: (id: string) => `/profile/${id}`,
    Icon: PersonOutlineIcon,
    end: true,
    isPrivate: false,
  },
  {
    key: "watchlist",
    label: "Watchlist",
    getPath: (id: string) => `/watchlist/${id}`,
    Icon: FormatListBulletedIcon,
    end: false,
    isPrivate: false,
  },
  {
    key: "friends",
    label: "Friends",
    getPath: (id: string) => `${id}/friends`,
    Icon: PeopleOutlineIcon,
    end: false,
    isPrivate: false,
  },
  {
    key: "settings",
    label: "Settings",
    getPath: (id: string) => `${id}/settings`,
    Icon: SettingsIcon,
    end: false,
    isPrivate: true,
  },
];

const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm ${
    isActive
      ? "bg-primary text-background [&>svg]:text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
      : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UserProfileSidebar = ({
  isOpen,
  onClose,
  userId,
}: SidebarProps) => {
  const { userId: currentUserId } = useAuthStore();
  const isOwn = currentUserId === userId;

  const visibleLinks = NAV_LINKS.filter((link) => !link.isPrivate || isOwn);

  return (
    <>
      <div
        className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 pt-[93px] md:min-h-[calc(100vh-64px)] md:mt-0 mt-[93px] md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-y-4"
        }`}
        onClick={onClose}
      >
        <nav
          className="w-full max-w-sm flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {visibleLinks.map(({ key, label, getPath, Icon, end }) => (
            <NavLink
              key={key}
              to={getPath(userId)}
              end={end}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <Icon className="text-primary" />
              <span className="font-semibold text-lg text-foreground">
                {label}
              </span>
            </NavLink>
          ))}

          {isOwn && (
            <div className="pb-10 mt-4">
              <LogoutButton clickFallback={onClose} />
            </div>
          )}
        </nav>
      </div>

      <Sidebar className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-72 bg-background/95 border-r border-border/60 shadow-2xl backdrop-blur-md rounded-none md:relative md:min-h-[calc(100vh-64px)] md:z-auto md:rounded-3xl md:shadow-none">
        <div className="flex flex-col h-full p-5 gap-2">
          <nav className="flex flex-col gap-3.5">
            {visibleLinks.map(({ key, label, getPath, Icon, end }) => (
              <NavLink
                key={key}
                to={getPath(userId)}
                end={end}
                onClick={onClose}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                <Icon className="text-primary scale-110 opacity-90" />
                <span className="text-lg tracking-wide">{label}</span>
              </NavLink>
            ))}
          </nav>

          {isOwn && (
            <div className="mt-auto pt-4">
              <div className="h-px bg-border/80 my-5" />
              <LogoutButton clickFallback={onClose} />
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
};
