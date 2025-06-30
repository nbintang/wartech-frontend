"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useCommentStore } from "@/features/comments/hooks/useCommentStore";
import usePostProtectedData from "@/hooks/hooks-api/usePostProtectedData";
import MinimalTiptapComment from "@/components/ui/minimal-tiptap/minimal-tiptap-comment";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useRef } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { useCreateComment } from "../hooks/useCreateComment";
import { shallow, useShallow } from "zustand/shallow";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(100, "Comment too long"),
  parentId: z.string().optional(),
  articleId: z.string().optional(),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
articleSlug: string;
  articleId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  articleId,
  articleSlug,
  parentId,
  onSuccess,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const editorRef = useRef<Editor | null>(null);
  const { setReplyingTo, isSubmittingReply } = useCommentStore(useShallow(state => ({
    setReplyingTo: state.setReplyingTo,
    isSubmittingReply: state.isSubmittingReply
  })));
  const createCommentMutation = useCreateComment();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const isSubmitting =
    createCommentMutation.isPending ||
    (parentId ? isSubmittingReply(parentId) : false);

  const onSubmit = async (data: CommentFormData) => {
    try {
      await createCommentMutation.mutateAsync({
        content: data.content,
        parentId,
        articleId,
        articleSlug
      });

      // Reset form and close reply form immediately
      form.reset();
      onSuccess?.();
      if (parentId) {
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      // Form stays open on error so user can retry
    }
  };

  const handleCancel = () => {
    form.reset();
    if (parentId) {
      setReplyingTo(null);
    }
  };

  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues("content") && editor.isEmpty) {
        editor.commands.setContent(form.getValues("content"));
      }
      editorRef.current = editor;
    },
    [form]
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1  items-center gap-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <>
                <MinimalTiptapComment
                  throttleDelay={1000}
                  className={cn("h-full min-h-56 w-full  rounded-xl")}
                  editorContentClassName="overflow-auto h-full"
                  output="html"
                  placeholder={placeholder}
                  editable={true}
                  editorClassName={cn(
                    "focus:outline-none focus:ring-0 focus-within:border-none focus:ring-offset-0 px-5 py-4"
                  )}
                  onCreate={handleCreate}
                  {...field}
                />
                <FormMessage />
              </>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {parentId ? "Reply" : "Comment"}
          </Button>

          {parentId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
