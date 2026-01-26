import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trophy, Clock, CheckCircle2, Calendar } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import { useCreditsStore } from "../store/useCreditsStore";
import { format } from "../utils/date";

export default function DashboardPage() {
  const { draws, fetchDraws, isLoading } = useDrawStore();
  const { balance } = useCreditsStore();

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      configured: "bg-blue-100 text-blue-800",
      executed: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      configured: <Calendar className="w-4 h-4" />,
      executed: <CheckCircle2 className="w-4 h-4" />,
      completed: <Trophy className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your contest draws</p>
          </div>
          <Link to="/draw/new" className="btn-primary mt-4 md:mt-0">
            <Plus className="w-5 h-5 mr-2 inline" />
            New Draw
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Draws</p>
                <p className="text-2xl font-bold text-gray-900">
                  {draws.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {draws.filter((d) => d.status === "completed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    draws.filter((d) =>
                      ["draft", "configured"].includes(d.status),
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {balance || 0}
                </p>
              </div>
              <Link
                to="/pricing"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Buy More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Draws List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Draws
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading draws...</p>
            </div>
          ) : draws.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No draws yet</p>
              <Link to="/draw/new" className="btn-primary">
                Create Your First Draw
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {draws.map((draw, index) => (
                <motion.div
                  key={draw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={
                      draw.status === "completed"
                        ? `/draw/${draw.id}/results`
                        : draw.status === "executed"
                          ? `/draw/${draw.id}/results`
                          : draw.status === "configured"
                            ? `/draw/${draw.id}/execute`
                            : `/draw/${draw.id}/config`
                    }
                    className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {draw.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              draw.status,
                            )}`}
                          >
                            {getStatusIcon(draw.status)}
                            {draw.status}
                          </span>
                        </div>
                        {draw.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {draw.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {draw.participants?.length || 0} participants
                          </span>
                          <span>•</span>
                          <span>{draw.numberOfWinners} winner(s)</span>
                          <span>•</span>
                          <span>
                            Created{" "}
                            {format(new Date(draw.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-primary-600 font-medium text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
