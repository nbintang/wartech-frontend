import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface CommentState {
  // UI States only - no complex business logic
  expandedComments: Set<string>;
  replyingTo: string | null;
  isCollapsed: boolean;
  isSubmitting: boolean;

  // Actions
  toggleExpanded: (commentId: string) => void;
  setReplyingTo: (commentId: string | null) => void;
  toggleCollapsedComments: () => void;
  setIsSubmitting: (value: boolean) => void;
  isExpanded: (commentId: string) => boolean;
  clearStates: () => void;
}

export const useCommentStore = create<CommentState>()(
  subscribeWithSelector((set, get) => ({
    isSubmitting: false,
    expandedComments: new Set(),
    replyingTo: null,
    isCollapsed: false,
    setIsSubmitting: (value: boolean) => set({ isSubmitting: value }),
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
      });
    },
  }))
);
