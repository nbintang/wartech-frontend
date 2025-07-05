import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface CommentState {
  expandedComments: Set<string>;
  replyingTo: string | null;
  submittingReplies: Set<string>;
  loadingReplies: Set<string>;
  toggleExpanded: (commentId: string) => void;
  setReplyingTo: (commentId: string | null) => void;
  isExpanded: (commentId: string) => boolean;
  setSubmittingReply: (commentId: string, isSubmitting: boolean) => void;
  isSubmittingReply: (commentId: string) => boolean;
  setLoadingReplies: (commentId: string, isLoading: boolean) => void;
  isLoadingReplies: (commentId: string) => boolean;
  clearAllStates: () => void;
  isCollapsed: boolean;
  toggleCollapsedComments: () => void;
}

export const useCommentStore = create<CommentState>()(
  subscribeWithSelector((set, get) => ({
    expandedComments: new Set(),
    replyingTo: null,
    submittingReplies: new Set(),
    loadingReplies: new Set(),

    toggleExpanded: (commentId: string) => {
      set((state) => {
        const newExpanded = new Set(state.expandedComments);
        if (newExpanded.has(commentId)) {
          newExpanded.delete(commentId);
        } else newExpanded.add(commentId);
        return { expandedComments: newExpanded };
      });
    },
    isCollapsed: false,
    toggleCollapsedComments: () => {
      set((state) => ({ isCollapsed: !state.isCollapsed }));
    },
    setReplyingTo: (commentId: string | null) => {
      set({ replyingTo: commentId });
    },

    isExpanded: (commentId: string) => {
      return get().expandedComments.has(commentId);
    },

    setSubmittingReply: (commentId: string, isSubmitting: boolean) => {
      set((state) => {
        const newSubmitting = new Set(state.submittingReplies);
        if (isSubmitting) {
          newSubmitting.add(commentId);
        } else {
          newSubmitting.delete(commentId);
        }
        return { submittingReplies: newSubmitting };
      });
    },

    isSubmittingReply: (commentId: string) => {
      return get().submittingReplies.has(commentId);
    },

    setLoadingReplies: (commentId: string, isLoading: boolean) => {
      set((state) => {
        const newLoading = new Set(state.loadingReplies);
        if (isLoading) {
          newLoading.add(commentId);
        } else {
          newLoading.delete(commentId);
        }
        return { loadingReplies: newLoading };
      });
    },

    isLoadingReplies: (commentId: string) => {
      return get().loadingReplies.has(commentId);
    },

    clearAllStates: () => {
      set({
        expandedComments: new Set(),
        replyingTo: null,
        submittingReplies: new Set(),
        loadingReplies: new Set(),
      });
    },
  }))
);
