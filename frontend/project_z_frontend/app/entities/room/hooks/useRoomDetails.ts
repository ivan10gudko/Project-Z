import { useQuery } from "@tanstack/react-query";
import { roomService } from "../api/roomService";

export const useRoomDetails = (roomId: number | undefined) => {
  const queryKey = ["room", roomId];

  const { data: room, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => roomService.getById(roomId!),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5, 
  });

  return {
    room,
    isLoading,
    isError,
    error,
    refetch,
  };
};