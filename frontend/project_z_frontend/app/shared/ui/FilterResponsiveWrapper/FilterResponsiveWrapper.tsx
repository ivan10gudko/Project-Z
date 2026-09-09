import FilterListIcon from "@mui/icons-material/FilterList";
import { Button } from "~/shared/ui/Button";
import { useState, type ReactNode } from "react";

interface FilterResponsiveWrapperProps {
  children: ReactNode;
  pageTitle: string;
  filterTitle?: string;
  modal?: ReactNode;
  actionButtons?: ReactNode[];
}

export const FilterResponsiveWrapper = ({
  children,
  pageTitle,
  filterTitle = "Filters",
  actionButtons,
}: FilterResponsiveWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="lg:hidden flex items-center justify-between gap-4 mb-6 px-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          {pageTitle}
        </h1>
        <Button onClick={() => setIsOpen(true)} variant="accept" className="">
          <FilterListIcon sx={{ fontSize: 20 }} />
          <span className="font-bold text-sm">Filters</span>
        </Button>
      </div>

      <aside
        className={`
        fixed inset-0 z-[100] transition-all duration-300 lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? "visible opacity-100" : "invisible opacity-0 lg:visible lg:opacity-100"}
        flex lg:block
      `}
      >
        <div
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={close}
        />

        <div
          className={`
          relative w-80 lg:w-64 h-full bg-background lg:bg-transparent shadow-2xl lg:shadow-none transition-transform duration-300
          lg:sticky lg:top-21 lg:h-fit
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-5 lg:p-0 lg:h-auto overflow-y-auto lg:overflow-visible flex flex-col gap-6">
            <div className="lg:hidden flex justify-between items-center pt-6 p-5 border-b border-border bg-transparent"></div>
            <div>{children}</div>

            {actionButtons && actionButtons.length > 0 && (
              <div className="px-5 lg:px-0 mt-auto pb-5 flex flex-col gap-2">
                {actionButtons.map((btn, index) => (
                  <div key={index}>{btn}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
