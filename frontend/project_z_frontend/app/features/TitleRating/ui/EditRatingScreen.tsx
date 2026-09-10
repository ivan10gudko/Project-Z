import { useEffect, useState } from "react";
import { useTitleRecordMutation, type TitleRecord } from "~/entities/titleRecord";
import { RatingEditorContent } from "./RatingEditorContent";
import { ReadonlyRatingContent } from "./ReadonlyRatingContent";
import type { Rating } from "~/shared/types";

interface EditRatingScreenProps {
  title: TitleRecord;
  onClose: () => void;
  isOwn: boolean;
  onTitleChange?: (newTitleId: number) => void;
}

const getInitialRating = (rating: TitleRecord["rating"]): Rating => {
  return rating && "overall" in rating ? (rating as Rating) : { overall: 0 };
};

export const EditRatingScreen = ({
  title,
  onClose,
  isOwn,
  onTitleChange,
}: EditRatingScreenProps) => {
  const { rate, rateLoading } = useTitleRecordMutation(
    title.apiTitleId,
    title,
    title
  );

  const [localRatings, setLocalRatings] = useState<Rating>(() =>
    getInitialRating(title.rating)
  );

  useEffect(() => {
    if (title.rating) {
      setLocalRatings(getInitialRating(title.rating));
    }
  }, [title.titleId, title.rating]);

  const handleSave = () => {
    const hasChanges =
      JSON.stringify(localRatings) !== JSON.stringify(title.rating);

    if (hasChanges) {
      rate(localRatings, {
        onSuccess: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOwn) {
    return (
      <ReadonlyRatingContent
        ratings={getInitialRating(title.rating)}
        onCancel={onClose}
        onTitleChange={onTitleChange}
        titleId={title.titleId}
      />
    );
  }

  return (
    <RatingEditorContent
      titleId={title.titleId}
      ratings={localRatings}
      avgRating={title.avgRating || 0}
      onChange={setLocalRatings}
      isSaving={rateLoading}
      onSave={handleSave}
      onCancel={onClose}
      onTitleChange={onTitleChange}
    />
  );
};