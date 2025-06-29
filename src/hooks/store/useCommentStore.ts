import { create } from "zustand"

interface CommentState {
  expandedComments: Set<string>
  replyingTo: string | null
  toggleExpanded: (commentId: string) => void
  setReplyingTo: (commentId: string | null) => void
  isExpanded: (commentId: string) => boolean
}

export const useCommentStore = create<CommentState>((set, get) => ({
  expandedComments: new Set(),
  replyingTo: null,

  toggleExpanded: (commentId: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedComments)
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId)
      } else {
        newExpanded.add(commentId)
      }
      return { expandedComments: newExpanded }
    })
  },

  setReplyingTo: (commentId: string | null) => {
    set({ replyingTo: commentId })
  },

  isExpanded: (commentId: string) => {
    return get().expandedComments.has(commentId)
  },
}))
