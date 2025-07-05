import { z } from "zod";
type ImageSchemOptions = {
  ACCEPTED_IMAGE_TYPES: string[];
  MAX_FILE_SIZE: number;
  MAX_DIMENSIONS: {
    width: number;
    height: number;
  };
  MIN_DIMENSIONS: {
    width: number;
    height: number;
  };
};
export const imageSchemOptions: ImageSchemOptions = {
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  MAX_FILE_SIZE: 1024 * 1024 * 3,
  //default for article
  MAX_DIMENSIONS: { width: 1600, height: 900 },
  MIN_DIMENSIONS: { width: 400, height: 250 },
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const imageSchema = (
  options: ImageSchemOptions = imageSchemOptions
) =>
  z.union([
    z
      .instanceof(File, {
        message: "Please select an image file.",
      })
      .refine((file) => file.size <= options?.MAX_FILE_SIZE, {
        message: `The image is too large. Please choose an image smaller than ${formatBytes(
          options.MAX_FILE_SIZE
        )}.`,
      })
      .refine((file) => options.ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please upload a valid image file (JPEG, PNG, or WebP).",
      })
      .refine(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const meetsDimensions =
                  img.width >= options.MIN_DIMENSIONS.width &&
                  img.height >= options.MIN_DIMENSIONS.height &&
                  img.width <= options.MAX_DIMENSIONS.width &&
                  img.height <= options.MAX_DIMENSIONS.height;
                resolve(meetsDimensions);
              };
              img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
          }),
        {
          message: `The image dimensions are invalid. Please upload an image between ${options.MIN_DIMENSIONS.width}x${options.MIN_DIMENSIONS.height} and ${options.MAX_DIMENSIONS.width}x${options.MAX_DIMENSIONS.height} pixels.`,
        }
      ),
    z.string().url(),
    z.null(),
  ]);
