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
import { useCallback, useMemo, useRef } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";

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
const updateChildrenCountRecursively = (
  commentsArray: CommentApiResponse[],
  targetCommentId: string
): CommentApiResponse[] => {
  return commentsArray.map((comment) => {
    // Jika ini adalah komentar induk yang dicari
    if (comment.id === targetCommentId) {
      console.log(`[OPTIMISTIC UPDATE] Found parent comment ${targetCommentId}. Old childrenCount: ${comment.childrenCount}, New: ${comment.childrenCount + 1}`);
      return {
        ...comment,
        childrenCount: (comment.childrenCount || 0) + 1, // Pastikan childrenCount tidak undefined
      };
    }
    // Jika komentar ini punya anak dan kita perlu mencari lebih dalam
    if (comment.children && comment.children.length > 0) {
      // Rekursif panggil fungsi untuk anak-anaknya
      return {
        ...comment,
        children: updateChildrenCountRecursively(comment.children, targetCommentId),
      };
    }
    return comment;
  });
};
export default function CommentForm({
  article,
  parentId,
  onSuccess,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const editorRef = useRef<Editor | null>(null);
  const queryClient = useQueryClient();
  const setReplyingTo = useCommentStore((state) => state.setReplyingTo);
  const expandedComments = useCommentStore((state) => state.expandedComments);
  const isCollapsed = useCommentStore((state) => state.isCollapsed);
  const expanded = parentId ? expandedComments.has(parentId) : false;
  const repliesQueryKey = useMemo(
    () => `comments-${parentId}-replies-${expanded ? "expanded" : "collapsed"}`,
    [parentId, expanded]
  );
  const createCommentMutation = usePostProtectedData({
    TAG: [repliesQueryKey],
    endpoint: `/comments${parentId ? `/${parentId}/replies` : ""}`,
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
await queryClient.invalidateQueries({
  queryKey: ["comments", article.slug], // Cukup ini, lebih generik
  refetchType: "all",
});
      // 1. Invalidasi dan refetch query replies spesifik untuk parent ini
      const replyQueryStringKey = `comments-${parentId}-replies-expanded`;
      console.log("Invalidating replies query:", [replyQueryStringKey]);
      await queryClient.invalidateQueries({
        queryKey: [replyQueryStringKey],
        refetchType: "all",
      });

      // 2. PERBARUI childrenCount PADA PARENT COMMENT SECARA OPTIMISTIC/MANUAL
      queryClient.setQueryData(
        ["comments", article.slug, isCollapsed ? "collapsed" : "expanded"],
        (
          oldData: InfiniteData<PaginatedDataResultResponse<CommentApiResponse>> | undefined
        ) => {
          console.log("setQueryData - oldData (before update):", oldData);
          if (!oldData) {
            console.log("setQueryData - oldData is undefined, returning.");
            return oldData;
          }

          let foundParentInPages = false;
          const newPages = oldData.pages?.map((page) => {
            const updatedItems = page.items.map((comment) => {
                if (comment.id === parentId) {
                    foundParentInPages = true;
                    console.log(`[OPTIMISTIC UPDATE - Top Level] Found parent comment ${parentId}. Old childrenCount: ${comment.childrenCount}, New: ${comment.childrenCount + 1}`);
                    return {
                        ...comment,
                        childrenCount: (comment.childrenCount || 0) + 1,
                    };
                }
                return comment; // Biarkan komentar lain tidak berubah
            });

            return {
                ...page,
                items: updatedItems,
            };
          }) || [];

          // Logika ini untuk memastikan parentId ditemukan di halaman yang di-cache.
          // Jika parentId adalah reply dari komentar lain, ia tidak akan ada di `oldData.pages[x].items`.
          // Dalam kasus itu, optimistis update childrenCount tidak bisa dilakukan dengan cara ini.
          // Solusi terbaik untuk itu adalah:
          // 1. Pastikan backend mengembalikan struktur nested yang lengkap (jarang dilakukan dengan infinite query).
          // 2. ATAU, cukup mengandalkan refetch.

          // Untuk saat ini, kita akan mengandalkan invalidasi dan refetch untuk semua level
          // Jika `foundParentInPages` adalah false, itu berarti parentId adalah nested comment,
          // atau tidak ada di halaman yang saat ini di-cache.
          // Dalam kedua kasus itu, invalidasi penuh adalah satu-satunya cara.
          if (!foundParentInPages && parentId) {
             console.warn(`Parent comment ${parentId} not found in top-level cache. Relying on full refetch for consistency.`);
             queryClient.invalidateQueries({
                 queryKey: ["comments", article.slug], // Invalidasi semua yang terkait dengan artikel slug ini
                 refetchType: "all",
             });
             // Penting: Jangan kembalikan oldData di sini jika ingin refetch
             return undefined; // Atau biarkan return default undefined jika tidak ada data
          }


          const newData = {
            ...oldData,
            pages: newPages,
            // Jika kamu juga mengupdate totalItems atau meta data setelah posting comment/reply,
            // itu juga harus diupdate di sini.
            // Misalnya: meta: { ...oldData.meta, totalItems: oldData.meta.totalItems + 1 }
          };
          console.log("setQueryData - newData after update:", newData);
          return newData;
        }
      );

      console.log("Toggling expanded state for parentId:", parentId);
      // Ini penting agar CommentItem yang menjadi parent bisa mengaktifkan query replies-nya.
      useCommentStore.getState().toggleExpanded(parentId);

    } else {
      // Jika ini adalah komentar top-level
      console.log("Invalidating top-level comments query:", ["comments", article.slug, isCollapsed ? "expanded" : "collapsed"]);
      await queryClient.invalidateQueries({
        queryKey: ["comments", article.slug, isCollapsed ? "expanded" : "collapsed"],
        refetchType: "all",
      });
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
                  placeholder={placeholder}
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
