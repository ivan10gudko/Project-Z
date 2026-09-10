import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedListProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export const AnimatedList = <T,>({
  items,
  getKey,
  renderItem,
  className = "flex flex-col gap-2 w-full",
}: AnimatedListProps<T>) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={getKey(item)}
          layout
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  );
};