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
import { useCommentStore } from "@/hooks/store/useCommentStore";
import usePostProtectedData from "@/hooks/hooks-api/usePostProtectedData";
import MinimalTiptapComment from "@/components/ui/minimal-tiptap/minimal-tiptap-comment";
import { cn } from "@/lib/utils";
import { useCallback, useRef } from "react";

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
  article: {
    id: string;
    slug: string;
  };
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  article,
  parentId,
  onSuccess,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const editorRef = useRef<Editor | null>(null);
  const { setReplyingTo } = useCommentStore();

  const createCommentMutation = usePostProtectedData({
    TAG: "comments",
    endpoint: `/comments/${parentId ? `${parentId}/replies` : null}`,
    retry: false,
    formSchema: commentSchema,
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      await createCommentMutation.mutateAsync({
        ...data,
        articleId: article.id,
        parentId,
      });
      form.reset();
      onSuccess?.();
      if (parentId) {
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
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
                  className={cn("h-full min-h-56 w-full rounded-xl")}
                  editorContentClassName="overflow-auto h-full"
                  output="html"
                  placeholder="Comment here..."
                  editable={true}
                  editorClassName="focus:outline-none px-5 py-4 "
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
            disabled={createCommentMutation.isPending}
            size="sm"
          >
            {createCommentMutation.isPending && (
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
