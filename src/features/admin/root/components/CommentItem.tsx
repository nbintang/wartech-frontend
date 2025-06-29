"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
} from "lucide-react";

import type { CommentApiResponse } from "@/types/api/CommentApiResponse";
import Link from "next/link";

interface CommentItemProps {
  comment: CommentApiResponse | CommentApiResponse["children"][0];
  depth?: number;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  isChild?: boolean;
}

export function CommentItem({
  comment,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  onReport,
  isChild = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = comment.children && comment.children.length > 0;
  const maxDepth = 6; // Increase max depth for deeper nesting
  const children = hasChildren ? (comment as CommentApiResponse).children : [];

  const handleReply = (content: string) => {
    onReply?.(comment.id, content);
    setIsReplying(false);
  };

  const handleEdit = (content: string) => {
    onEdit?.(comment.id, content);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getImageUrl = (image: string | null) => {
    return image || "/placeholder.svg?height=40&width=40";
  };

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={getImageUrl(comment.user.image) || "/placeholder.svg"}
                alt={comment.user.name}
              />
              <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {comment.isEdited && (
                      <span className="text-xs text-muted-foreground">
                        (edited)
                      </span>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReport?.(comment.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-muted-foreground text-xs">
                  Commented on{" "}
                  <Link
                    className="underline text-blue-400"
                    href={`/admin/dashboard/articles/${comment.article.id}`}
                  >
                    {comment.article.title}
                  </Link>
                </p>
              </div>
              {isEditing ? (
                <></>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: comment.content }} />
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="h-8 px-2 text-xs"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Reply
                </Button>

                {hasChildren && (
                  <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                      >
                        {isExpanded ? (
                          <ChevronDown className="mr-1 h-3 w-3" />
                        ) : (
                          <ChevronRight className="mr-1 h-3 w-3" />
                        )}
                        {comment.children.length}{" "}
                        {comment.children.length === 1 ? "reply" : "replies"}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isReplying && (
        <div className="mb-4 ml-13">
          <></>
        </div>
      )}

      {hasChildren && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-0">
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                depth={depth < maxDepth ? depth + 1 : maxDepth}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
