import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { EditRatingScreen } from "~/features/TitleRating/ui/EditRatingScreen";
import { useTitleById } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";

export default function WatchlistEditRoute() {
  const navigate = useNavigate();
  const { titleId, userId } = useParams();
  const { data: title, isLoading } = useTitleById(Number(titleId));
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  const handleClose = () => {
    navigate("../..", { relative: "path", replace: true });
  };

  const handleTitleChange = (newTitleId: number) => {
    navigate(`../${newTitleId}`, { relative: "path" });
  };



  if (isLoading) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Loading..."
        maxWidth="max-w-2xl"
      >
        <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
          Loading title...
        </div>
      </Modal>
    );
  }
  if (!title) {
    return (
      <ErrorAnimePage></ErrorAnimePage>
    )
  }
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={
        isOwn
          ? `Edit Rating "${title.titleName}"`
          : `Rating Overview "${title.titleName}"`
      }
      maxWidth="max-w-2xl"
    >
      <EditRatingScreen
        title={title}
        isOwn={isOwn}
        onClose={handleClose}
        onTitleChange={handleTitleChange}
      />
    </Modal>
  );
}
