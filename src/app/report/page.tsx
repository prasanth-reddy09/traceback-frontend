"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { imageService } from "@/services/imageService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";

// Zod Schema for validation
const itemSchema = z.object({
  title: z.string().min(2, "Item title is required"),       // Changed from 'name' to 'title'
  location: z.string().min(2, "Location is required"),      // NEW: Added location
  description: z.string().min(5, "Please provide a brief description"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["LOST", "FOUND"]),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function ReportItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { status: "LOST" }
  });

  const reportMutation = useMutation({
    mutationFn: itemService.reportItem,
    onSuccess: () => {
      toast.success("Item reported successfully!");
      // Tell React Query to refresh the dashboard items!
      queryClient.invalidateQueries({ queryKey: ["items"] }); 
      router.push("/dashboard");
    },
    onError: () => toast.error("Failed to report item"),
  });

  const onSubmit = async (data: ItemFormValues) => {
    try {
      setIsUploading(true);
      let imageUrl = null;

      // If they selected an image, run our brilliant Cloudinary architecture!
      if (selectedFile) {
        toast.loading("Uploading image...", { id: "upload" });
        imageUrl = await imageService.uploadToCloudinary(selectedFile);
        toast.dismiss("upload");
      }

      // Combine the form data with the new secure URL
      const finalItemData = {
        ...data,
        imageUrl: imageUrl,
      };

      // Send to Spring Boot
      reportMutation.mutate(finalItemData);
    } catch (error) {
      toast.dismiss("upload");
      toast.error("Image upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Report an Item</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Status Selection */}
          {/* <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input type="radio" value="LOST" {...register("status")} className="peer sr-only" />
              <div className="text-center p-4 border-2 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50 transition-all font-bold text-gray-700">
                I Lost Something
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" value="FOUND" {...register("status")} className="peer sr-only" />
              <div className="text-center p-4 border-2 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 transition-all font-bold text-gray-700">
                I Found Something
              </div>
            </label>
          </div> */}

         {/* Item Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
            <input
              type="text"
              {...register("title")} // Changed to 'title'
              className="w-full rounded-md border text-black border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., MacBook Air M4"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* NEW: Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              {...register("location")}
              className="w-full rounded-md border text-black border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Library 2nd Floor, Main Cafeteria"
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register("category")}
              className="w-full rounded-md border  text-black border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Keys">Keys</option>
              <option value="Wallet">Wallet</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-md  text-black border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Where did you last see it? Any distinguishing features?"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                {selectedFile && <p className="text-sm font-semibold text-green-600 mt-2">Selected: {selectedFile.name}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || reportMutation.isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isUploading || reportMutation.isPending ? "Uploading & Saving..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}