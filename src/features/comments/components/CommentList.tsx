"use client"

import type { CommentApiResponse } from "@/types/api/CommentApiResponse"
import CommentItem from "./CommentItem"


interface CommentListProps {
comments: CommentApiResponse[]; 
  article:{
    id: string;
    slug: string;
  }
  depth?: number
}

export default function CommentList({ comments, article, depth = 0 }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} article={article} depth={depth} />
      ))}
    </div>
  )
}
