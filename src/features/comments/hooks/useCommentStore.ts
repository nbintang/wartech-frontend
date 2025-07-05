import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ClientCommentApiResponse, CommentApiResponse } from "@/types/api/CommentApiResponse";

interface CommentState {
  isSubmitting: boolean;
  submittingParentId: string | null;
  isSubmittingMainComment: boolean;
  optimisticComment: ClientCommentApiResponse | null;
  expandedComments: Set<string>;
  replyingTo: string | null;
  isCollapsed: boolean;
  toggleExpanded: (commentId: string) => void;
  setReplyingTo: (commentId: string | null) => void;
  toggleCollapsedComments: () => void;
  setIsSubmitting: (value: boolean) => void;
  isExpanded: (commentId: string) => boolean;
  clearStates: () => void;
  setIsSubmittingMainComment: (submitting: boolean) => void;
  setSubmittingParentId: (parentId: string | null) => void;
  setOptimisticComment: (comment: ClientCommentApiResponse | null) => void;
}

export const useCommentStore = create<CommentState>()(
  subscribeWithSelector((set, get) => ({
    submittingParentId: null,
    isSubmittingMainComment: false,
    isSubmitting: false,
    expandedComments: new Set(),
    replyingTo: null,
    isCollapsed: false,
    optimisticComment: null,

    setIsSubmitting: (value: boolean) => set({ isSubmitting: value }),
    setSubmittingParentId: (parentId: string | null) => {
      set({ submittingParentId: parentId });
    },
    setIsSubmittingMainComment: (submitting: boolean) => {
      set({ isSubmittingMainComment: submitting });
    },
    setOptimisticComment: (comment: ClientCommentApiResponse | null) => {
      set({ optimisticComment: comment });
    },
    toggleExpanded: (commentId: string) => {
      set((state) => {
        const newExpanded = new Set(state.expandedComments);
        if (newExpanded.has(commentId)) {
          newExpanded.delete(commentId);
        } else {
          newExpanded.add(commentId);
        }
        return { expandedComments: newExpanded };
      });
    },
    setReplyingTo: (commentId: string | null) => {
      set({ replyingTo: commentId });
    },
    toggleCollapsedComments: () => {
      set((state) => ({ isCollapsed: !state.isCollapsed }));
    },
    isExpanded: (commentId: string) => {
      return get().expandedComments.has(commentId);
    },
    clearStates: () => {
      set({
        expandedComments: new Set(),
        replyingTo: null,
        optimisticComment: null,
      });
    },
  }))
);