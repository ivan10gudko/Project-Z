import { useMemo } from "react";
import type { TitleRecord } from "~/entities/titleRecord";
import { useChangesHighlight } from "~/shared/hooks";

export const useTitleChangesHighlight = (title: TitleRecord, duration = 2000) => {
  const watchedData = useMemo(() => ({
    titleName: title.titleName,
    status: title.status,
    rating: title.rating?.overall,
  }), [title.titleName, title.status, title.rating?.overall]);

  return useChangesHighlight(
    watchedData,
    ["titleName", "status", "rating"],
    duration
  );
};