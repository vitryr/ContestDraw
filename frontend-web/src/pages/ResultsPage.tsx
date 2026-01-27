import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, FileText, Share2, Trophy, Play, Download, Check, Loader2 } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import WinnerCard from "../components/WinnerCard";
import DrawVideoPlayer from "../components/DrawVideoPlayer";
import { drawApi } from "../services/api";
import toast from "react-hot-toast";

type VideoStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    currentDraw,
    winners,
    fetchDraw,
    fetchWinners,
    generateCertificate,
    isLoading,
  } = useDrawStore();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDraw(id);
      fetchWinners(id);
      // Fetch video status
      drawApi.getVideoStatus(id).then((data) => {
        if (data) {
          setVideoStatus(data.status);
          setVideoUrl(data.videoUrl || null);
        }
      }).catch(() => {
        // Ignore errors - video status is optional
      });
    }
  }, [id, fetchDraw, fetchWinners]);

  const handleShowVideo = () => {
    setShowVideoPlayer(true);
    toast.success("Video animation loaded!");
  };

  const handleDownloadCertificate = async () => {
    if (!id) return;

    setIsGeneratingCertificate(true);
    try {
      const url = await generateCertificate(id);
      // Auto-download
      const link = document.createElement("a");
      link.href = url;
      link.download = `draw-${id}-certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Certificate downloaded!");
    } catch (error) {
      toast.error("Failed to generate certificate");
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentDraw?.title} - Winners`,
        text: "Check out the winners of our contest!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDownloadVideo = async () => {
    // If video is ready, download it
    if (videoStatus === "COMPLETED" && videoUrl) {
      window.open(videoUrl, "_blank");
      return;
    }

    if (!id || winners.length === 0) {
      toast.error("No winners to export");
      return;
    }

    setIsExportingVideo(true);

    try {
      // Call backend to queue video generation
      await drawApi.generateVideo(id);
      setVideoStatus("PENDING");

      toast.success(
        "Video generation started! You will receive an email with the download link when it's ready.",
        { duration: 6000 }
      );
    } catch (error: any) {
      console.error("Video generation error:", error);
      const errorCode = error.response?.data?.code;
      const message = error.response?.data?.message || "Failed to start video generation";

      // Handle specific error codes
      if (errorCode === "VIDEO_ALREADY_EXISTS") {
        setVideoStatus("COMPLETED");
        toast.error("Video already generated. Refreshing status...");
        // Refresh video status
        const data = await drawApi.getVideoStatus(id);
        if (data?.videoUrl) {
          setVideoUrl(data.videoUrl);
        }
      } else if (errorCode === "VIDEO_GENERATION_IN_PROGRESS") {
        setVideoStatus("PROCESSING");
        toast.error("Video is already being generated. Please wait.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsExportingVideo(false);
    }
  };

  const getVideoButtonText = () => {
    if (isExportingVideo) return "Requesting...";
    if (videoStatus === "COMPLETED" && videoUrl) return "Download MP4";
    if (videoStatus === "PENDING" || videoStatus === "PROCESSING") return "Processing...";
    return "Request MP4 Video";
  };

  const getVideoButtonIcon = () => {
    if (videoStatus === "COMPLETED" && videoUrl) return <Check className="w-5 h-5 mr-2 inline" />;
    if (videoStatus === "PENDING" || videoStatus === "PROCESSING") return <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />;
    return <Download className="w-5 h-5 mr-2 inline" />;
  };

  const isVideoButtonDisabled = () => {
    if (isExportingVideo) return true;
    if (videoStatus === "PENDING" || videoStatus === "PROCESSING") return true;
    return false;
  };

  // Prepare video data for Remotion player
  const videoWinners = winners.map((w) => ({
    position: w.position,
    name: w.participant?.name || "Winner",
    username: w.participant?.username || "user",
  }));

  if (isLoading && !currentDraw) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contest Results
            </h1>
            <p className="text-xl text-gray-600">{currentDraw.title}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={handleShowVideo}
              disabled={showVideoPlayer}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showVideoPlayer ? (
                <>
                  <Video className="w-5 h-5 mr-2 inline" />
                  Video Playing
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 inline" />
                  Play Animation
                </>
              )}
            </button>

            <button
              onClick={handleDownloadCertificate}
              disabled={isGeneratingCertificate}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5 mr-2 inline" />
              {isGeneratingCertificate
                ? "Generating..."
                : "Download Certificate"}
            </button>

            <button onClick={handleShare} className="btn-secondary">
              <Share2 className="w-5 h-5 mr-2 inline" />
              Share Results
            </button>

            <button
              onClick={handleDownloadVideo}
              disabled={isVideoButtonDisabled()}
              className={`btn-secondary disabled:opacity-50 disabled:cursor-not-allowed ${
                videoStatus === "COMPLETED" && videoUrl ? "!bg-green-600 !text-white hover:!bg-green-700" : ""
              }`}
            >
              {getVideoButtonIcon()}
              {getVideoButtonText()}
            </button>
          </div>

          {/* Video Animation Preview */}
          {showVideoPlayer && winners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <div className="card max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Draw Animation
                </h3>
                <div className="flex justify-center">
                  <DrawVideoPlayer
                    title={currentDraw.title}
                    participantCount={currentDraw.participants?.length || 0}
                    winners={videoWinners}
                    primaryColor="#8b5cf6"
                    width={360}
                    height={640}
                    autoPlay={true}
                    loop={true}
                    showControls={true}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Interactive animation - Use controls to play/pause
                </p>
              </div>
            </motion.div>
          )}

          {/* Winners */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {winners.length === 1 ? "Winner" : "Winners"}
            </h2>

            {/* Dynamic layout based on number of winners */}
            <div
              className={`
                ${winners.length === 1 ? "flex justify-center" : ""}
                ${winners.length === 2 ? "flex flex-col md:flex-row justify-center gap-6" : ""}
                ${winners.length >= 3 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}
              `}
            >
              {winners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`
                    ${winners.length === 1 ? "w-full max-w-md" : ""}
                    ${winners.length === 2 ? "w-full md:w-80" : ""}
                  `}
                >
                  <WinnerCard winner={winner} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Draw Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {currentDraw.participants?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  {winners.length}
                </div>
                <div className="text-sm text-gray-600">Winners Selected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {Object.keys(currentDraw.filters || {}).length}
                </div>
                <div className="text-sm text-gray-600">Filters Applied</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-600">Fair & Random</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard" className="btn-secondary text-center">
              Back to Dashboard
            </Link>
            <Link to="/draw/new" className="btn-primary text-center">
              Create New Draw
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
