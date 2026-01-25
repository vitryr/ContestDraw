import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Video, FileText, Share2, Trophy } from 'lucide-react';
import { useDrawStore } from '../store/useDrawStore';
import WinnerCard from '../components/WinnerCard';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { currentDraw, winners, fetchDraw, fetchWinners, generateVideo, generateCertificate, isLoading } = useDrawStore();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDraw(id);
      fetchWinners(id);
    }
  }, [id, fetchDraw, fetchWinners]);

  const handleGenerateVideo = async () => {
    if (!id) return;

    setIsGeneratingVideo(true);
    try {
      const url = await generateVideo(id);
      setVideoUrl(url);
      toast.success('Video generated successfully!');
    } catch (error) {
      // Error handled by store
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownloadCertificate = async (winnerId: string) => {
    try {
      const url = await generateCertificate(winnerId);
      window.open(url, '_blank');
      toast.success('Certificate downloaded!');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleShare = () => {
    if (navigator.share && videoUrl) {
      navigator.share({
        title: `${currentDraw?.title} - Winners`,
        text: 'Check out the winners of our contest!',
        url: videoUrl,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contest Results</h1>
            <p className="text-xl text-gray-600">{currentDraw.title}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={handleGenerateVideo}
              disabled={isGeneratingVideo || !!videoUrl}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Video className="w-5 h-5 mr-2 inline" />
              {isGeneratingVideo ? 'Generating...' : videoUrl ? 'Video Generated' : 'Generate Video'}
            </button>

            {videoUrl && (
              <>
                <a
                  href={videoUrl}
                  download
                  className="btn-secondary"
                >
                  <Download className="w-5 h-5 mr-2 inline" />
                  Download Video
                </a>
                <button
                  onClick={handleShare}
                  className="btn-secondary"
                >
                  <Share2 className="w-5 h-5 mr-2 inline" />
                  Share
                </button>
              </>
            )}
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <div className="card max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h3>
                <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Winners */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {winners.length === 1 ? 'Winner' : 'Winners'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <WinnerCard
                    winner={winner}
                    onDownloadCertificate={() => handleDownloadCertificate(winner.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Draw Statistics</h3>
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
