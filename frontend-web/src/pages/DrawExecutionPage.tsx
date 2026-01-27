import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import DrawAnimation from "../components/DrawAnimation";
import toast from "react-hot-toast";

export default function DrawExecutionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDraw, fetchDraw, executeDraw, winners, isLoading } =
    useDrawStore();
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  // Redirect completed draws to results page (cannot re-execute completed draws)
  useEffect(() => {
    if (currentDraw && currentDraw.status?.toLowerCase() === "completed") {
      navigate(`/draw/${id}/results`, { replace: true });
    }
  }, [currentDraw, id, navigate]);

  const handleExecuteDraw = async () => {
    if (!id) return;

    setIsExecuting(true);
    setShowAnimation(true);

    try {
      await executeDraw(id);
      toast.success("Draw completed successfully!");

      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigate(`/draw/${id}/results`);
      }, 5000);
    } catch (error) {
      setIsExecuting(false);
      setShowAnimation(false);
    }
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
    <div className="min-h-screen bg-gray-900">
      <AnimatePresence>
        {showAnimation ? (
          <DrawAnimation
            participants={currentDraw.participants || []}
            winners={winners}
            drawTitle={currentDraw.title}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container-custom py-12 min-h-screen flex items-center justify-center"
          >
            <div className="max-w-2xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Preview Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentDraw.title}
                  </h1>

                  {currentDraw.description && (
                    <p className="text-gray-600 mb-6">
                      {currentDraw.description}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {currentDraw.participants?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Participants</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-accent-600 mb-1">
                        {currentDraw.numberOfWinners}
                      </div>
                      <div className="text-sm text-gray-600">Winners</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {Object.keys(currentDraw.filters || {}).length}
                      </div>
                      <div className="text-sm text-gray-600">Filters</div>
                    </div>
                  </div>

                  {/* Applied Filters */}
                  {currentDraw.filters &&
                    Object.keys(currentDraw.filters).length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Applied Filters:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {currentDraw.filters.minFollowers && (
                            <li>
                              • Minimum {currentDraw.filters.minFollowers}{" "}
                              followers
                            </li>
                          )}
                          {currentDraw.filters.minLikes && (
                            <li>
                              • Minimum {currentDraw.filters.minLikes} likes
                            </li>
                          )}
                          {currentDraw.filters.requireFollowing && (
                            <li>• Must be following</li>
                          )}
                          {currentDraw.filters.duplicateCheck && (
                            <li>• Duplicate checking enabled</li>
                          )}
                        </ul>
                      </div>
                    )}

                  <button
                    onClick={handleExecuteDraw}
                    disabled={isExecuting}
                    className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-6 h-6 inline mr-2" />
                    {isExecuting ? "Executing Draw..." : "Start Draw"}
                  </button>
                </div>

                {/* Instructions */}
                <div className="text-white space-y-4">
                  <p className="text-lg">Ready to execute your draw?</p>
                  <p className="text-gray-400">
                    We'll randomly select {currentDraw.numberOfWinners}{" "}
                    winner(s) from {currentDraw.participants?.length || 0}{" "}
                    participants with a fair and transparent algorithm.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
