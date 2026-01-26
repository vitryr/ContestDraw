import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Instagram, Twitter, Upload, Link as LinkIcon } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import toast from "react-hot-toast";

const drawSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  platform: z.enum(["instagram", "twitter", "tiktok", "manual"]),
  postUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  numberOfWinners: z
    .number()
    .min(1, "At least 1 winner required")
    .max(100, "Maximum 100 winners"),
});

type DrawForm = z.infer<typeof drawSchema>;

export default function NewDrawPage() {
  const navigate = useNavigate();
  const { createDraw, isLoading } = useDrawStore();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DrawForm>({
    resolver: zodResolver(drawSchema),
    defaultValues: {
      numberOfWinners: 1,
      platform: "instagram",
    },
  });

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
    },
    { id: "twitter", name: "Twitter", icon: <Twitter className="w-6 h-6" /> },
    {
      id: "manual",
      name: "Manual Upload",
      icon: <Upload className="w-6 h-6" />,
    },
  ];

  const onSubmit = async (data: DrawForm) => {
    try {
      const draw = await createDraw({
        title: data.title,
        description: data.description,
        platform: data.platform,
        postUrl: data.postUrl,
        numberOfWinners: data.numberOfWinners,
        status: "draft",
      });
      toast.success("Draw created successfully!");
      navigate(`/draw/${draw.id}/config`);
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Draw
          </h1>
          <p className="text-gray-600 mb-8">
            Set up your contest draw and import participants
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="input-field"
                    placeholder="e.g., Summer Giveaway 2024"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of your contest..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Winners *
                  </label>
                  <input
                    type="number"
                    {...register("numberOfWinners", { valueAsNumber: true })}
                    className="input-field"
                    min="1"
                    max="100"
                  />
                  {errors.numberOfWinners && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.numberOfWinners.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Participant Source
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setValue("platform", platform.id as any);
                    }}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                        selectedPlatform === platform.id
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {platform.icon}
                    </div>
                    <div className="font-medium text-gray-900">
                      {platform.name}
                    </div>
                  </button>
                ))}
              </div>

              {selectedPlatform !== "manual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Post URL
                  </label>
                  <input
                    type="url"
                    {...register("postUrl")}
                    className="input-field"
                    placeholder={`https://${selectedPlatform}.com/...`}
                  />
                  {errors.postUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postUrl.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-600">
                    We'll automatically import participants from this post
                  </p>
                </div>
              )}

              {selectedPlatform === "manual" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    You'll be able to upload a CSV file with participants in the
                    next step.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Continue to Configuration"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
