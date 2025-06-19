import { create } from "zustand";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";

interface CommentStoreState {
  comments: CommentApiResponse[];
  setComments: (comments: CommentApiResponse[]) => void;
  addComment: (comment: CommentApiResponse) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
}

export const useCommentStore = create<CommentStoreState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (newComment) =>
    set((state) => ({
      comments: [newComment, ...state.comments],
    })),
  updateComment: (commentId, content) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId ? { ...comment, content, isEdited: true } : comment
      ),
    })),
  deleteComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    })),
}));
