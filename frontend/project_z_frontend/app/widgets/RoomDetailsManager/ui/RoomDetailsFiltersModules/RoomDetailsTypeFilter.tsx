import { Checkbox } from '~/shared/ui/CheckBox';
import { titleTypeOptions, TitleTypeOptionsColors } from '~/entities/titleRecord';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
import { ToggleSwitch } from '~/shared/ui/Switch';

export const RoomDetailsTypeFilter = () => {
  const { types, toggleType, isMyTypes, setIsMyTypes } = useRoomDetailsFilterStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] uppercase font-bold text-muted-foreground">Type</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isMyTypes ? 'Mine' : 'All'}
          </span>
          <ToggleSwitch isActive={isMyTypes} onToggle={setIsMyTypes} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {titleTypeOptions.map(type => {
          const colorClass = TitleTypeOptionsColors[type.value] || "text-foreground/90";

          return (
            <Checkbox
              key={type.value}
              label={
                <span className={`${colorClass} font-medium text-sm transition-colors duration-200`}>
                  {type.label}
                </span>
              }
              checked={types.includes(type.value)}
              onChange={() => toggleType(type.value)}
            />
          );
        })}
      </div>
    </div>
  );
};