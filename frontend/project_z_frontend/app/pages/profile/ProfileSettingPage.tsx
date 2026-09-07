import type { ReactNode } from "react";
import { FaPalette, FaShieldAlt } from "react-icons/fa";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import KeyIcon from "@mui/icons-material/Key";
import ContrastIcon from "@mui/icons-material/Contrast";
import { Link } from "react-router";
import { LogoutButton } from "~/features/auth";
import { ThemeToggle } from "~/features/theme";

interface SettingGroup {
  label: string;
  icon: ReactNode;
}

interface SettingItem {
  id: string;
  group: string;
  label?: string;
  href?: string;
  icon?: ReactNode;
  render?: () => ReactNode;
} //or href & icon or render, but not both

const PROFILE_SETTING_GROUPS: SettingGroup[] = [
  { label: "Security", icon: <FaShieldAlt /> },
  { label: "Theme", icon: <FaPalette /> },
];

const PROFILE_SETTING_MENU: SettingItem[] = [
  {
    id: "change-password",
    label: "Change Password",
    href: "change-password",
    icon: <KeyIcon />,
    group: "Security",
  },
  {
    id: "forgot-password",
    label: "Forgot Password",
    href: "/auth/forgot-password",
    icon: <KeyOffIcon />,
    group: "Security",
  },
  {
    id: "logout",
    render: () => (
      <LogoutButton className="rounded-none border-none py-4 hover:scale-100" />
    ),
    group: "Security",
  },
  {
    id: "theme-toggle",
    group: "Theme",
    render: () => (
      <div className="flex items-center justify-between w-full px-4 py-2 hover:bg-primary/5 transition-colors">
        <span className="flex items-center gap-2">
          <ContrastIcon className="text-foreground/70" /> Theme Preferences
        </span>
        <ThemeToggle label />
      </div>
    ),
  },
];

const ProfileSettingPage = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-primary mb-5">User settings</h2>
      <section>
        {PROFILE_SETTING_GROUPS.map((group) => (
          <div key={group.label} className="mb-8 divide-y divide-primary/50">
            <h3 className="text-xl font-semibold mb-4 flex gap-2 items-center py-2 text-primary/80">
              {group.icon}
              {group.label}
            </h3>

            <div className="flex flex-col divide-y divide-foreground/20">
              {PROFILE_SETTING_MENU.filter(
                (item) => item.group === group.label,
              ).map((item) => {
                if (item.render) {
                  return (
                    <div key={item.id} className="block">
                      {item.render()}
                    </div>
                  );
                }

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-4 hover:bg-primary/10 transition-colors"
                    >
                      {item.icon && (
                        <span className="text-foreground/70">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ProfileSettingPage;
