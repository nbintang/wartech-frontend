"use client";
import { AsyncSelect } from "@/components/ui/async-select";
import { Button } from "@/components/ui/button";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import AsyncTagsInput from "@/components/ui/async-tags-input";
import { axiosInstance } from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { CategorysApiResponse } from "@/types/api/CategoryApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, LoaderCircleIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type Editor } from "@tiptap/react";
import { DropzoneOptions } from "react-dropzone";
import { TagApiResponse } from "@/types/api/TagApiResponse";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import fetchSearchedData from "@/lib/fetchSearchData";
import usePostImage from "@/hooks/hooks-api/usePostImage";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import {
  ArticleApiPostResponse,
  ArticlebySlugApiResponse,
} from "@/types/api/ArticleApiResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHandleLoadingDialog from "@/hooks/useHandleLoadingDialog";
import catchAxiosError from "@/helpers/catchAxiosError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 1024 * 1024 * 0.8; // 800kB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const articleInputSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, {
      message: "Title must be at most 100 characters long.",
    })
    .trim(),
  content: z.string().min(1, { message: "Content is required." }),
  image: z
    .instanceof(File, {
      message: "Please upload an image.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than  1MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file (JPEG, PNG, or WebP).",
    })
    .or(z.string().url())
    .nullable(),
  categoryId: z.string().uuid(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string().optional(),
      createdAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime().optional(),
    })
  ),
});
type ArticleInput = z.infer<typeof articleInputSchema>;

const UpdateArticleForm = ({
  article,
  profile,
}: {
  article: ArticlebySlugApiResponse;
  profile: UserProfileApiResponse;
}) => {
  const [files, setFiles] = useState<File[] | null | undefined>(null);
  const [isContentReady, setIsContentReady] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const editorRef = useRef<Editor | null>(null);
  const queryCLient = useQueryClient();
  const router = useRouter();
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);

  const { mutateAsync: uploadImage, ...uploadMutations } = usePostImage({
    "image-url": article?.image,
    folder: "articles",
  });

  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleInputSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      image: null,
      tags: [],
    },
  });

  const dropZoneConfig: DropzoneOptions = {
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      editorRef.current = editor;
      if (article?.content && editor.isEmpty) {
        editor.commands.setContent(article.content, false);
      }
    },
    [article?.content]
  );

  useEffect(() => {
    if (article && !isInitialized) {
      form.reset({
        title: article.title,
        content: article.content,
        categoryId: article.category.id,
        image: article.image,
        tags: article.tags,
      });
      if (editorRef.current && article.content) {
        // Only set if the editor's current content is different to avoid unnecessary updates
        if (editorRef.current.getHTML() !== article.content) {
          editorRef.current.commands.setContent(article.content, false);
        }
      }

      if (typeof article.image === "string") {
        setFiles(null);
      }

      setIsContentReady(true);
      setIsInitialized(true);
    }
  }, [article, isInitialized, form]);

  const { mutateAsync: updateArticle, ...updateMutations } = useMutation({
    mutationKey: ["articles"],
    mutationFn: async (data: ArticleInput) => {
      const { tags, image, ...rest } = data;

      const [uploadedImage, resNewTags] = await Promise.all([
        uploadImage(image as File),
        axiosInstance.post<ApiResponse<TagApiResponse[]>>(
          "/protected/tags?bulk=true",
          { names: tags.map((tag) => tag.name) }
        ),
      ]);

      const resUpdateArticle = await axiosInstance.patch<
        ApiResponse<ArticleApiPostResponse>
      >(`/protected/articles/${article.slug}`, {
        ...rest,
        image: uploadedImage.secureUrl,
        authorId: profile?.id,
      });

      await Promise.all([
        axiosInstance.delete<ApiResponse>(
          `/protected/article-tags/${resUpdateArticle.data?.data?.slug}`,
          { params: { bulk: true } }
        ),
        axiosInstance.post("/protected/article-tags?bulk=true", {
          articleSlug: resUpdateArticle.data?.data?.slug,
          tagIds: resNewTags.data?.data?.map((tag) => tag.id),
        }),
      ]);
      router.push("/admin/dashboard/articles");
      return resUpdateArticle;
    },
    onMutate: () => {
      setOpenDialog("update-article", {
        description: "Updating article...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["articles"] });
      useHandleLoadingDialog.getState().closeDialog();
      toast.success("Article updated successfully!", {
        id: "update-article",
        duration: 2000,
      });
    },
    onError: (err) => {
      const message = catchAxiosError(err) ?? "An unknown error occurred.";
      setOpenDialog("update-article", {
        description: message,
        isError: true,
        isLoading: false,
      });
      return message;
    },
  });
  console.log("Form State:", form.formState);
  console.log("Form Values:", form.getValues());
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) =>
          updateArticle({
            ...v,
            content: editorRef.current?.getHTML() ?? v.content,
          })
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Title</FormLabel>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt mollitia inventore totam?
              </FormDescription>
              <FormControl>
                <Input type="text" placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Image</FormLabel>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt mollitia inventore totam?
              </FormDescription>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={(newFiles) => {
                    setFiles(newFiles);
                    field.onChange(newFiles?.[0]);
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative  rounded-lg p-2"
                >
                  <FileInput
                    className={cn(
                      "h-80  overflow-hidden bg-accent/50 outline-white flex items-center justify-center",
                      files && files.length > 0
                        ? ""
                        : "outline-1 outline-dashed"
                    )}
                  >
                    {files && files.length > 0 ? (
                      // Render newly selected file
                      files.map((file, i) => (
                        <div key={i} className="z-30">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-contain"
                            width={400}
                            height={400}
                          />
                        </div>
                      ))
                    ) : typeof field.value === "string" && field.value ? (
                      <div className="z-30">
                        <Image
                          src={field.value}
                          alt={form.getValues("title") || "Article Image"}
                          className="w-full h-full object-contain"
                          width={400}
                          height={400}
                        />
                      </div>
                    ) : (
                      // Render upload prompt if no file or URL
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                        <CloudUpload className="text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG and JPEG
                        </p>
                      </div>
                    )}
                  </FileInput>
                  {files && files.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="absolute top-2 right-2 z-50"
                          onClick={() => {
                            setFiles(null);
                            field.onChange(article?.image || null);
                          }}
                        >
                          <Trash2Icon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove image</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-3">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl ">Categories</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                  minus iste expedita doloribus eos.
                </FormDescription>
                <FormControl>
                  <AsyncSelect<CategorysApiResponse>
                    fetcher={(query) =>
                      !field.onChange
                        ? fetchSearchedData<CategorysApiResponse>(
                            `/categories/${article.category.id}`
                          )
                        : fetchSearchedData<CategorysApiResponse>(
                            `/categories`,
                            { name: query }
                          )
                    }
                    renderOption={(item) => <div>{item.name}</div>}
                    getOptionValue={(item) => item.id}
                    getDisplayValue={(item) => <div>{item.name}</div>}
                    label="Categories"
                    placeholder="Select Categories"
                    width={"100%"}
                    loadingSkeleton={
                      <div className="grid place-items-center">
                        <div className="text-muted-foreground  flex items-center gap-2 py-5">
                          <LoaderCircleIcon className="animate-spin size-4" />
                          <p className="text-sm"> Loading...</p>
                        </div>
                      </div>
                    }
                    triggerClassName={cn("text-muted-foreground ")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Tags</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                  minus iste expedita doloribus eos.
                </FormDescription>
                <FormControl>
                  <AsyncTagsInput<TagApiResponse>
                    fetcher={(query) =>
                      fetchSearchedData<TagApiResponse>("/tags", {
                        name: query,
                      })
                    }
                    maxItems={5}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <>
              <div className="mb-5">
                <FormLabel className="text-2xl">Content</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Itaque consequatur deleniti repellendus eum error nam numquam
                  veniam ut pariatur cupiditate. Temporibus.
                </FormDescription>
              </div>
              <MinimalTiptapEditor
                throttleDelay={0}
                className={cn("w-full min-h-screen", {
                  "border-destructive focus-within:border-destructive":
                    form.formState.errors.content,
                })}
                output="html"
                placeholder="Type your content here..."
                onCreate={handleCreate}
                editable={article.content ? true : false}
                injectCSS={true}
                editorClassName="focus:outline-none p-5"
                onChange={(content) => field.onChange?.(content)}
              />
            </>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="md:mt-5 min-w-full md:min-w-xs"
            disabled={form.formState.isSubmitting || !form.formState.isDirty  || updateMutations.isPending}
          >
            {!form.formState.isSubmitting ? (
              "Update Article"
            ) : (
              <span className="flex items-center gap-2">
                Updating...
                <LoaderCircleIcon className="animate-spin" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateArticleForm;
