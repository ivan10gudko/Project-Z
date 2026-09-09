import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useEffect, useState } from "react";
import { TitleType } from "~/entities/titleRecord";
import type { TitleRecord } from "~/entities/titleRecord";
import { StatusSelect } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { Status } from "~/shared/types/Status";
import { CompactRate } from "~/shared/ui/CompactRate";
import { notify } from "~/shared/lib/notify";
import type { Rating } from "~/shared/types";
import TitleTypeSelect from "~/entities/titleRecord/ui/TitleTypeSelect";
import { ImageUrlField } from "~/shared/ui/imageUrlField";
import { useNavigate } from "react-router";
interface EditTitleScreenProps {
  title: TitleRecord;
}

export const EditTitleScreen = ({ title }: EditTitleScreenProps) => {
  const navigate = useNavigate();
  const [titleName, setTitleName] = useState(title.titleName);
  const [imageUrl, setImageUrl] = useState<string | null>(
    title.imageUrl ?? null,
  );
  const [status, setStatus] = useState<Status>(title.status);
  const [rating, setRating] = useState<number | undefined>(
    title.rating?.overall,
  );
  const [titleType, setTitleType] = useState<TitleType>(
    title.titleType ?? TitleType.ANIME,
  );
  const [description, setDescription] = useState(title.description ?? "");

  const { updateTitle, isUpdating } = useUpdateTitleRecord(title.titleId);

  useEffect(() => {
    setTitleName(title.titleName);
    setImageUrl(title.imageUrl ?? null);
    setStatus(title.status);
    setRating(title.rating?.overall);
    setTitleType(title.titleType ?? TitleType.ANIME);
    setDescription(title.description ?? "");
  }, [title]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (!titleName.trim()) {
      notify.error("Title name cannot be empty");
      return;
    }
    const hasChanges =
      titleName !== title.titleName ||
      imageUrl !== title.imageUrl ||
      status !== title.status ||
      rating !== title.rating?.overall ||
      titleType !== title.titleType ||
      description !== (title.description ?? "");

    if (!hasChanges) {
      handleClose();
      return;
    }

    let finalRating: Partial<Rating> | undefined = undefined;

    if (rating !== undefined) {
      finalRating = { ...title.rating, overall: rating };
    } else if (title.rating) {
      finalRating = { ...title.rating };
      delete finalRating.overall;
    }

    updateTitle(
      {
        titleName,
        imageUrl,
        status,
        rating: finalRating as Rating,
        titleType,
        description,
      },
      {
        onSuccess: () => {
          notify.success("Changes saved successfully");
          handleClose();
        },
        onError: () => {
          notify.error("Failed to save changes");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <ImageUrlField imageUrl={imageUrl} onImageChange={setImageUrl}>
        <div className="flex flex-col gap-5">
          <div className="overflow-y-auto flex-1 space-y-4 pr-1 custom-scrollbar min-h-0">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              <ImageUrlField.Preview containerClassName="w-38 h-54 sm:w-40 sm:h-56 shrink-0 rounded-xl overflow-hidden shadow-md border border-border/60" />

              <div className="flex-1 space-y-3.5 w-full text-left">
                <div>
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                    Title Name
                  </label>
                  <Input
                    value={titleName}
                    onChange={(val) => setTitleName(val)}
                    placeholder="Enter custom name..."
                    className="h-11 border-2 p-3 border-border focus:border-primary rounded-xl font-bold w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Type
                    </label>
                    <TitleTypeSelect
                      value={titleType}
                      onChange={(val: string) => setTitleType(val as TitleType)}
                      className="h-11 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Status
                    </label>
                    <StatusSelect
                      variant="page"
                      initialData={title}
                      titleRecord={{ ...title, status }}
                      onStatusChange={(newStatus) => setStatus(newStatus)}
                      className="h-11 w-full border-2 border-border rounded-xl bg-background font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-0.5">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-2">
                      Rating
                    </label>
                    <CompactRate
                      currentRating={rating}
                      onRate={(val) => setRating(val)}
                      onClear={() => setRating(undefined)}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Image URL
                    </label>
                    <ImageUrlField.Input showLabel={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border/40 pt-3.5">
              <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                Description & Notes
              </label>
              <textarea
                name="Description"
                placeholder="Enter title description, plot summary or your notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3.5 border-2 border-border focus:border-primary rounded-xl font-medium text-foreground text-sm bg-background/50 hover:border-border/80 focus:bg-background transition-all shadow-sm resize-none custom-scrollbar outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-border/60 bg-background shrink-0">
            <Button
              onClick={handleClose}
              variant="cancel"
              className="w-full sm:flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              variant="save"
              className="w-full sm:flex-2 h-11"
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </ImageUrlField>
    </div>
  );
};
