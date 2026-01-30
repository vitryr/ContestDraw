import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  Users,
  Settings,
  ArrowLeft,
  Instagram,
  Edit3,
  Trophy,
} from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import FilterConfig from "../components/FilterConfig";
import ParticipantsList from "../components/ParticipantsList";
import SocialConnect from "../components/SocialConnect";
import toast from "react-hot-toast";

const WINNER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export default function DrawConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentDraw,
    fetchDraw,
    updateDraw,
    importParticipants,
    uploadParticipantsCSV,
    isLoading,
  } = useDrawStore();
  const [activeTab, setActiveTab] = useState<"participants" | "filters">(
    "participants",
  );
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefSocial = useRef<HTMLInputElement>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNumberOfWinners, setEditNumberOfWinners] = useState(1);
  const [editPlatform, setEditPlatform] = useState<string>("instagram");

  // Initialize edit form when draw loads
  useEffect(() => {
    if (currentDraw) {
      setEditTitle(currentDraw.title || "");
      setEditNumberOfWinners(currentDraw.numberOfWinners || 1);
      setEditPlatform(currentDraw.platform || "instagram");
    }
  }, [currentDraw]);

  // Redirect completed draws to results page (cannot modify completed draws)
  useEffect(() => {
    if (currentDraw && currentDraw.status?.toLowerCase() === "completed") {
      navigate(`/draw/${id}/results`, { replace: true });
    }
  }, [currentDraw, id, navigate]);

  const handleSaveBasicInfo = async () => {
    if (!id || !editTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await updateDraw(id, {
        title: editTitle,
        numberOfWinners: editNumberOfWinners,
        platform: editPlatform,
      });
      setIsEditingBasicInfo(false);
      toast.success("Draw updated successfully!");
    } catch (error) {
      // Error handled by store
    }
  };

  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      await uploadParticipantsCSV(id, file);
      toast.success("Participants imported successfully!");
    } catch (error) {
      // Error handled by store
    }
  };

  const handleSocialImport = async (platform: string, url: string) => {
    if (!id) return;

    try {
      await importParticipants(id, platform, url);
      toast.success("Participants imported from social media!");
    } catch (error) {
      // Error handled by store
    }
  };

  const handleContinue = async () => {
    if (!id || !currentDraw) return;

    if ((currentDraw.participants?.length || 0) === 0) {
      toast.error("Please add participants before continuing");
      return;
    }

    await updateDraw(id, { status: "configured" });
    navigate(`/draw/${id}/execute`);
  };

  if (isLoading && !currentDraw) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading draw...</p>
        </div>
      </div>
    );
  }

  if (!currentDraw) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Draw not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress Steps - Always at top */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsEditingBasicInfo(true)}
                className="flex items-center group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    isEditingBasicInfo
                      ? "bg-primary-600 text-white ring-4 ring-primary-200"
                      : "bg-primary-600 text-white group-hover:bg-primary-700"
                  }`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isEditingBasicInfo
                      ? "text-primary-600"
                      : "text-gray-900 group-hover:text-primary-600"
                  }`}
                >
                  Setup
                </span>
              </button>
              <div className="w-12 h-0.5 bg-primary-600"></div>
              <button
                onClick={() => setIsEditingBasicInfo(false)}
                className="flex items-center group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    !isEditingBasicInfo
                      ? "bg-primary-600 text-white ring-4 ring-primary-200"
                      : "bg-primary-600 text-white group-hover:bg-primary-700"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    !isEditingBasicInfo
                      ? "text-primary-600"
                      : "text-gray-900 group-hover:text-primary-600"
                  }`}
                >
                  Configure
                </span>
              </button>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Execute
                </span>
              </div>
            </div>
          </div>

          {/* Header with title */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentDraw.title}
                </h1>
                {currentDraw.description && (
                  <p className="text-gray-600 mb-2">
                    {currentDraw.description}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {currentDraw.numberOfWinners} winner(s) •{" "}
                  {currentDraw.platform === "manual"
                    ? "Manual Upload"
                    : currentDraw.platform === "instagram"
                      ? "Instagram"
                      : currentDraw.platform}
                </p>
              </div>
              {!isEditingBasicInfo && (
                <button
                  onClick={() => setIsEditingBasicInfo(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Settings
                </button>
              )}
            </div>
          </div>

          {/* Edit Settings Form - Step 1 */}
          {isEditingBasicInfo && (
            <div className="card mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Draw Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw Title *
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Summer Giveaway 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Number of Winners *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WINNER_OPTIONS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setEditNumberOfWinners(num)}
                        className={`
                          flex items-center justify-center w-12 h-12 rounded-xl
                          border-2 transition-all duration-200 font-semibold text-lg
                          ${
                            editNumberOfWinners === num
                              ? "border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-200"
                              : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                          }
                        `}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Participant Source *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setEditPlatform("instagram")}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        editPlatform === "instagram"
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          editPlatform === "instagram"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Instagram className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">Instagram</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPlatform("manual")}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        editPlatform === "manual"
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          editPlatform === "manual"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">Manual Upload</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveBasicInfo} className="btn-primary">
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBasicInfo(false);
                      // Reset to original values
                      setEditTitle(currentDraw.title || "");
                      setEditNumberOfWinners(currentDraw.numberOfWinners || 1);
                      setEditPlatform(currentDraw.platform || "instagram");
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Configure Content - Step 2 (Hidden when editing settings) */}
          {!isEditingBasicInfo && (
            <>
              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex gap-8">
                    <button
                      onClick={() => setActiveTab("participants")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "participants"
                          ? "border-primary-600 text-primary-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Users className="w-5 h-5 inline mr-2" />
                      Participants
                      {currentDraw.participants && (
                        <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {currentDraw.participants.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("filters")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === "filters"
                          ? "border-primary-600 text-primary-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Settings className="w-5 h-5 inline mr-2" />
                      Filters & Rules
                    </button>
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "participants" ? (
                  <>
                    {/* Import Options - Conditional based on platform */}
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Import Participants
                      </h2>

                      {currentDraw.platform === "manual" ? (
                        /* Manual Upload - CSV Only */
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Upload CSV File
                          </h3>
                          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                            Upload a CSV file with participant information. The
                            file should contain columns for username, name, and
                            email.
                          </p>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary"
                          >
                            Choose CSV File
                          </button>
                          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Expected CSV format:
                            </p>
                            <code className="text-xs text-gray-600 block">
                              username,name,email
                              <br />
                              user1,John Doe,john@example.com
                            </code>
                          </div>
                        </div>
                      ) : currentDraw.platform === "instagram" ? (
                        /* Instagram Import */
                        <div className="border-2 border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-center gap-3 mb-6">
                            <Instagram className="w-8 h-8 text-pink-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Import from Instagram
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-6 text-center">
                            Enter your Instagram post URL to automatically
                            import participants from comments
                          </p>
                          <SocialConnect
                            drawId={id!}
                            onImport={handleSocialImport}
                          />
                        </div>
                      ) : (
                        /* Other platforms - show both options */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* CSV Upload */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Upload CSV File
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Upload a CSV file with participant information
                            </p>
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleFileUpload}
                              className="hidden"
                              ref={fileInputRefSocial}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefSocial.current?.click()}
                              className="btn-secondary"
                            >
                              Choose File
                            </button>
                          </div>

                          {/* Social Import */}
                          <div className="border-2 border-gray-200 rounded-lg p-6">
                            <Download className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Import from Social Media
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Connect your account and import automatically
                            </p>
                            <SocialConnect
                              drawId={id!}
                              onImport={handleSocialImport}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Participants List */}
                    <ParticipantsList
                      participants={currentDraw.participants || []}
                    />
                  </>
                ) : (
                  <FilterConfig
                    drawId={id!}
                    currentFilters={currentDraw.filters || {}}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Dashboard
                  </button>
                </div>
                <button
                  onClick={handleContinue}
                  disabled={
                    !currentDraw.participants ||
                    currentDraw.participants.length === 0
                  }
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Draw
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
