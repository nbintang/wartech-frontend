// src/features/comments/hooks/useHasLiked.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";

type CurrentUserLikeResponse = {
  id: string;
  userId: string;
  commentId: string;
  user: {
    id: string;
    name: string;
  };
} | null;

export const useHasLiked = (commentId: string, userId: string | undefined, enabled = true) => {
  return useQuery<CurrentUserLikeResponse, Error>({
    queryKey: ["commentLikes", commentId, "me"], // Kunci query yang unik untuk like pengguna pada komentar ini
    queryFn: async (): Promise<CurrentUserLikeResponse> => {
      if (!userId) {
        return null;
      }
      const res = await axiosInstance.get<ApiResponse<CurrentUserLikeResponse>>(
        `/protected/comments/${commentId}/like/me`
      );
      // Backend Anda mengembalikan data langsung, jadi kita langsung kembalikan res.data
      // Sesuaikan jika struktur ApiResponse Anda berbeda
      return res.data.data as CurrentUserLikeResponse; // Mengembalikan objek like atau null
    },
    // Query ini hanya aktif jika commentId dan userId ada, dan enabled adalah true
    enabled: enabled && !!commentId && !!userId,
    staleTime: 5 * 60 * 1000, // Stale for 5 minutes
    retry: 1, // Coba lagi 1 kali
    refetchOnWindowFocus: false, // Jangan refetch saat fokus window
  });
};