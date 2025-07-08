"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import useHandleCategoryFormDialog from "@/features/admin/categories/hooks/useHandlenFormDialog";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import usePatchProtectedData from "@/hooks/hooks-api/usePatchProtectedData";
import usePostProtectedData from "@/hooks/hooks-api/usePostProtectedData";
import { CategoryApiResponse } from "@/types/api/CategoryApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const categorySchema = z.object({
  name: z
    .string()
    .min(6, { message: "Name must be at least 6 characters long." }),
  description: z
    .string()
    .max(255, { message: "Description must be at most 255 characters long." })
    .optional(),
});
const CategoryFormDialog = () => {
  const isOpen = useHandleCategoryFormDialog((s) => s.open);
  const setOpen = useHandleCategoryFormDialog((s) => s.setOpen);
  const category = useHandleCategoryFormDialog((s) => s.category);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  // Mutations
  const { mutateAsync: createCategory } = usePostProtectedData({
    TAG: ["categories"],
    endpoint: "/categories",
    formSchema: categorySchema,
  });
  console.log(category);
  const { mutateAsync: updateCategory } = usePatchProtectedData({
    TAG: ["categories"],
    endpoint: `/categories/${category?.slug}`,
    formSchema: categorySchema,
  });

  useEffect(() => {
    form.reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
    });
  }, [category, form]);
  const onSubmit = useCallback(
    async (values: z.infer<typeof categorySchema>) => {
      try {
        if (category?.id) {
          // ⚠️ await the mutation
          await updateCategory(values);
        } else {
          await createCategory(values);
        }
        setOpen(false);
      } catch {
        console.log("Failed to create category");
      }
    },
    [category?.id, createCategory, updateCategory, setOpen]
  );
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Category Form</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormDescription>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
                    voluptatibus sit quibusdam!'
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Enter Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
                    voluptatibu!'
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Category Description"
                      className="min-h-[160px] resize-y" // `resize-y` agar hanya bisa resize vertikal
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
