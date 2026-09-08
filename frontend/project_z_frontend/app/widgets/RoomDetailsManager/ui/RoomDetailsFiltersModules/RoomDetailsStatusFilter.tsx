import { statusFilterStyles, statusOptionsFilters } from '~/shared/types/Status';
import { StatusButton } from '~/shared/ui/StatusButton';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
import { ToggleSwitch } from '~/shared/ui/Switch';

export const RoomDetailsStatusFilter = () => {
    const { status, setStatus, isMyStatus, setIsMyStatus } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-foreground uppercase">
                    Status
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {isMyStatus ? 'Mine' : 'All'}
                    </span>
                    <ToggleSwitch isActive={isMyStatus} onToggle={setIsMyStatus} />
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {statusOptionsFilters.map(s => {
                    const styleKey = s.value ?? 'ALL';
                    const styles = statusFilterStyles[styleKey] || statusFilterStyles['ALL'];
                    const isActive = (status ?? undefined) === (s.value ?? undefined);

                    return (
                        <StatusButton
                            key={styleKey}
                            label={s.label}
                            isActive={isActive}
                            onClick={() => setStatus(s.value ?? undefined)}
                            className={styles.text}
                            activeClassName={styles.active}
                            inactiveClassName={styles.inactive}
                        />
                    );
                })}
            </div>
        </div>
    );
};