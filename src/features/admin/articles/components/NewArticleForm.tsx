"use client";
import { AsyncSelect } from "@/components/ui/async-select";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
import { TagsInput } from "@/components/ui/tags-input";
import { axiosInstance } from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { CategoriesApiResponse } from "@/types/api/CategoriesApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Trash2Icon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type Editor } from "@tiptap/react";
const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

// Added FileUploaderTest component to wrap the uploader logic
const FileUploaderTest = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const dropZoneConfig = {
    maxFiles: 2,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropZoneConfig}
      className="relative  rounded-lg p-2"
    >
      <FileInput className="outline-dashed h-80 outline-1 overflow-hidden outline-white flex items-center justify-center">
        {files && files.length > 0 ? (
          files.map((file, i) => {
            return (
              <div className=" z-30">
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
            <FileSvgDraw />
          </div>
        )}
      </FileInput>
      {files && files.length > 0 && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-2 right-2 z-50"
          onClick={() => setFiles(null)}
        >
          <Trash2Icon />
        </Button>
      )}
    </FileUploader>
  );
};

const articleInputSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, {
      message: "Title must be at most 100 characters long.",
    })
    .trim(),
  content: z.string().min(1, { message: "Content is required." }),
  image: z.string().url(),
  categoryId: z.string().uuid(),
  tagIds: z.array(z.string().uuid()).optional(),
});

type ArticleInput = z.infer<typeof articleInputSchema>;

const NewArticleForm = () => {
  const editorRef = useRef<Editor | null>(null);
  const [value, setValue] = useState<string[]>([]);
  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleInputSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
      categoryId: "",
      tagIds: [],
    },
  });
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
      <form className="space-y-6">
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
                <FileUploaderTest />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Tag</FormLabel>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt mollitia inventore totam?
              </FormDescription>
              <FormControl>
                <TagsInput
                  value={value}
                  onValueChange={setValue}
                  placeholder="Enter anything"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Categories</FormLabel>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt mollitia inventore totam?
              </FormDescription>
              <FormControl>
                <AsyncSelect<CategoriesApiResponse>
                  fetcher={async () => {
                    const response = await axiosInstance.get(
                      `/protected/categories`
                    );
                    return response.data.data.items as CategoriesApiResponse[];
                  }}
                  renderOption={(item) => <div>{item.name}</div>}
                  getOptionValue={(item) => item.id}
                  getDisplayValue={(item) => item.name}
                  label="Select"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Description</FormLabel>
              <FormControl>
                <MinimalTiptapEditor
                  {...field}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default NewArticleForm;
