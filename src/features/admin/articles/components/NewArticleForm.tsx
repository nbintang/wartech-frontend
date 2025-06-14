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
import { useCallback, useRef, useState } from "react";
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
import { validate as validateUUID } from "uuid";
import fetchSearchedData from "@/lib/fetchSearchData";
interface TagInput extends TagApiResponse {
  label: string;
}
const articleInputSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, {
      message: "Title must be at most 100 characters long.",
    })
    .trim(),
  content: z.string().min(1, { message: "Content is required." }),
  image: z.instanceof(File).optional(),
  categoryId: z.string().uuid(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
  ),
});
type ArticleInput = z.infer<typeof articleInputSchema>;
const NewArticleForm = () => {
  const [files, setFiles] = useState<File[] | null | undefined>(null);
  const editorRef = useRef<Editor | null>(null);

  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleInputSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      image: undefined,
      tags: [],
    },
  });
  const dropZoneConfig: DropzoneOptions = {
    maxSize: 1024 * 1024 * 4,
    multiple: false,
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
  const onSubmit = async (data: ArticleInput) => {
    const { tags, ...rest } = data;
    const content = editorRef.current?.getHTML() ?? "";
    const existedDataTags = tags.filter((tag) => validateUUID(tag.id));
    const newTags = tags.filter((tag) => !validateUUID(tag.id));
    const dataToArticles = {
      ...rest,
      content,
      tags: [...existedDataTags],
    };
    console.log(dataToArticles);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      files.map((file, i) => {
                        return (
                          <div key={i} className=" z-30">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt=""
                              className="w-full h-full object-contain "
                              width={100}
                              height={100}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                        <CloudUpload className="text-muted-foreground" />
                        <p className="mb-1 text-sm  text-muted-foreground ">
                          <span className="font-semibold ">
                            Click to upload
                          </span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground ">
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
                          onClick={() => setFiles(null)}
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
                      fetchSearchedData<CategorysApiResponse>("/categories", {
                        name: query,
                      })
                    }
                    renderOption={(item) => <div>{item.name}</div>}
                    getOptionValue={(item) => item.id}
                    getDisplayValue={(item) => <div>{item.name}</div>}
                    label="Select Categories"
                    width={"100%"}
                    loadingSkeleton={
                      <div className="grid place-items-center">
                        <div className="text-muted-foreground  flex items-center gap-2 py-5">
                          <LoaderCircleIcon className="animate-spin size-4" />
                          <p className="text-sm"> Loading...</p>
                        </div>
                      </div>
                    }
                    triggerClassName={cn("text-muted-foreground font-light")}
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
                    label={"Select Tags"}
                    maxItems={15}
                    {...field}
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
                editorContentClassName="some-class"
                output="html"
                placeholder="Type your description here..."
                onCreate={handleCreate}
                autofocus={true}
                immediatelyRender={true}
                editable={true}
                injectCSS={true}
                editorClassName="focus:outline-none p-5"
                {...field}
              />
            </>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="md:mt-5 min-w-full md:min-w-xs">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewArticleForm;
