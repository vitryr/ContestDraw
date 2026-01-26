import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Filter, Save } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import type { DrawFilters } from "../types";
import toast from "react-hot-toast";

const filterSchema = z.object({
  minFollowers: z.number().min(0).optional(),
  minLikes: z.number().min(0).optional(),
  minComments: z.number().min(0).optional(),
  excludeKeywords: z.string().optional(),
  requireFollowing: z.boolean(),
  duplicateCheck: z.boolean(),
});

type FilterForm = z.infer<typeof filterSchema>;

interface FilterConfigProps {
  drawId: string;
  currentFilters: DrawFilters;
}

export default function FilterConfig({
  drawId,
  currentFilters,
}: FilterConfigProps) {
  const { updateDraw, isLoading } = useDrawStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      minFollowers: currentFilters.minFollowers || 0,
      minLikes: currentFilters.minLikes || 0,
      minComments: currentFilters.minComments || 0,
      excludeKeywords: currentFilters.excludeKeywords?.join(", ") || "",
      requireFollowing: currentFilters.requireFollowing || false,
      duplicateCheck: currentFilters.duplicateCheck !== false,
    },
  });

  const onSubmit = async (data: FilterForm) => {
    const filters: DrawFilters = {
      minFollowers: data.minFollowers || undefined,
      minLikes: data.minLikes || undefined,
      minComments: data.minComments || undefined,
      excludeKeywords: data.excludeKeywords
        ? data.excludeKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : undefined,
      requireFollowing: data.requireFollowing,
      duplicateCheck: data.duplicateCheck,
    };

    try {
      await updateDraw(drawId, { filters });
      toast.success("Filters saved successfully!");
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Draw Filters & Rules
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Engagement Filters */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Engagement Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Followers
              </label>
              <input
                type="number"
                {...register("minFollowers", { valueAsNumber: true })}
                className="input-field"
                min="0"
                placeholder="0"
              />
              {errors.minFollowers && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minFollowers.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Likes
              </label>
              <input
                type="number"
                {...register("minLikes", { valueAsNumber: true })}
                className="input-field"
                min="0"
                placeholder="0"
              />
              {errors.minLikes && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minLikes.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Comments
              </label>
              <input
                type="number"
                {...register("minComments", { valueAsNumber: true })}
                className="input-field"
                min="0"
                placeholder="0"
              />
              {errors.minComments && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minComments.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Filters */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Content Filters
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exclude Keywords (comma-separated)
            </label>
            <input
              type="text"
              {...register("excludeKeywords")}
              className="input-field"
              placeholder="spam, bot, fake"
            />
            <p className="mt-1 text-sm text-gray-600">
              Participants with these keywords in their profile will be excluded
            </p>
          </div>
        </div>

        {/* Requirement Toggles */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Requirements
          </h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("requireFollowing")}
                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Require Following
                </div>
                <div className="text-sm text-gray-600">
                  Only include participants who follow your account
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("duplicateCheck")}
                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Duplicate Detection
                </div>
                <div className="text-sm text-gray-600">
                  Automatically remove duplicate entries (recommended)
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Filters help ensure fair draws by removing
            ineligible participants. All filters are optional, but recommended
            for better results.
          </p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 mr-2 inline" />
          {isLoading ? "Saving..." : "Save Filters"}
        </button>
      </form>
    </div>
  );
}
