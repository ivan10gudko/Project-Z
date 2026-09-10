import { useEffect, useRef, useState } from "react";

export type ChangedFields<T> = Partial<Record<keyof T, boolean>>;

export const useChangesHighlight = <T extends Record<string, unknown>>(
    data: T,
    watchKeys: (keyof T)[],
    duration = 1500
) => {
    const prevDataRef = useRef(data);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const watchKeysRef = useRef(watchKeys);
    watchKeysRef.current = watchKeys;
    const [changedFields, setChangedFields] = useState<ChangedFields<T>>({});

    useEffect(() => {
        const prev = prevDataRef.current;

        if (prev && prev !== data) {
            const newChanges: ChangedFields<T> = {};
            let hasChanges = false;

            for (const key of watchKeysRef.current) {
                if (prev[key] !== data[key]) {
                    newChanges[key] = true;
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                setChangedFields(newChanges);

                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }

                timerRef.current = setTimeout(() => {
                    setChangedFields({});
                }, duration);
            }
        }

        prevDataRef.current = data;

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [data, duration]); // watchKeys прибрано з deps

    return changedFields;
};