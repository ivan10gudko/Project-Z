
import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ClearIcon from "@mui/icons-material/Clear";
import { StarRating } from "~/shared/ui/Rating";
import { useTitleRecordMutation } from '~/entities/titleRecord/hooks/useTitleRecordMutation';
import { Button } from "~/shared/ui/Button";
import { formatRatingInput } from "~/shared/helpers/formatRating";
import type { ManageTitleRecordProps } from "~/entities/titleRecord";

const PageRate = ({ initialData, titleRecord }: ManageTitleRecordProps) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { rate, isAnyActionLoading, clearRate } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord,
    );

    const currentRating = titleRecord?.rating?.overall;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();

        const val = e.target.value;

        const formatted = formatRatingInput(val);

        if (formatted !== null) {
            setValue(formatted);
            setError("");
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        const num = parseFloat(value);
        if (isNaN(num) || num < 1 || num > 10) {
            setError("Value must be 0 - 10");
            setValue("");
            return;
        }

        rate(num);
        setValue("");
    }

    function handleClear() {
        clearRate();
        setValue("");
    }

    return (
        <div
            className={`border-y border-y-background/15 text-center w-full transition-all duration-150 text-md`}
        >
            <div className="w-full flex gap-2 text-center justify-center items-center transition-all duration-150">
                <span className="ml-1 [padding-top:0.15em]">Your Rating</span>

                <span className="flex items-center gap-0.5 text-primary ">
                    {currentRating && (
                        <>
                            <StarRoundedIcon fontSize="small" />
                            <span className="[padding-top:0.15em]">
                                {`${currentRating}`} / 10
                            </span>
                            <Button variant="text-only" onClick={handleClear}>
                                <ClearIcon
                                    fontSize="small"
                                    className="text-danger hover:scale-120 hover:text-danger-hover"
                                />
                            </Button>
                        </>
                    )}
                </span>
            </div>

            <StarRating rating={+value || currentRating || 0} />

            <form
                onSubmit={handleSubmit}
                className={"flex justify-between overflow-hidden w-full"}
            >
                <input
                    name="rating"
                    type="text"
                    value={value}
                    autoComplete="off"
                    min={1}
                    max={10}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    ref={inputRef}
                    placeholder="1-10"
                    className=" bg-background-muted text-foreground rounded-l-md text-center outline-0 w-full py-2"
                />
                <button
                    type="submit"
                    className="group px-4 bg-primary cursor-pointer  text-background-muted-hover rounded-r-md duration-150"
                >
                    <DoneOutlinedIcon
                        fontSize="small"
                        className="group-hover:scale-120"
                    />
                </button>
            </form>
        </div>
    );
};

export default PageRate;
