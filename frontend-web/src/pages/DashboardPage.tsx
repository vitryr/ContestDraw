import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Trophy,
  Clock,
  CheckCircle2,
  Users,
  CreditCard,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import { useCreditsStore } from "../store/useCreditsStore";
import { format } from "../utils/date";

// TikTok icon component (not in lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function DashboardPage() {
  const { t } = useTranslation();
  const { draws, fetchDraws, isLoading } = useDrawStore();
  const { balance } = useCreditsStore();

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  // Calculate stats
  const totalDraws = draws.length;
  const completedDraws = draws.filter((d) => d.status === "completed" || d.status === "executed").length;
  const inProgressDraws = draws.filter((d) => ["draft", "configured"].includes(d.status)).length;
  const totalParticipants = draws.reduce((acc, d) => acc + (d.participants?.length || 0), 0);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; border: string; label: string }> = {
      draft: {
        bg: "bg-info/10",
        text: "text-info",
        border: "border-info/20",
        label: t("dashboard.status.draft", "Draft"),
      },
      configured: {
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning/20",
        label: t("dashboard.status.configured", "Configured"),
      },
      executed: {
        bg: "bg-accent-secondary/10",
        text: "text-accent-secondary",
        border: "border-accent-secondary/20",
        label: t("dashboard.status.executed", "Executed"),
      },
      completed: {
        bg: "bg-success/10",
        text: "text-success",
        border: "border-success/20",
        label: t("dashboard.status.completed", "Completed"),
      },
    };
    return configs[status] || configs.draft;
  };

  const getPlatformIcon = (platform?: string) => {
    const iconClass = "w-5 h-5";
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <Instagram className={iconClass} />;
      case "tiktok":
        return <TikTokIcon className={iconClass} />;
      case "twitter":
        return <Twitter className={iconClass} />;
      case "youtube":
        return <Youtube className={iconClass} />;
      case "facebook":
        return <Facebook className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  const getPlatformStyle = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return "bg-gradient-to-br from-[#f6339a] to-[#ff6900]";
      case "tiktok":
        return "bg-black";
      case "twitter":
        return "bg-twitter";
      case "youtube":
        return "bg-youtube";
      case "facebook":
        return "bg-facebook";
      default:
        return "bg-accent-secondary";
    }
  };

  const getDrawLink = (draw: typeof draws[0]) => {
    if (draw.status === "completed" || draw.status === "executed") {
      return `/draw/${draw.id}/results`;
    }
    if (draw.status === "configured") {
      return `/draw/${draw.id}/execute`;
    }
    return `/draw/${draw.id}/config`;
  };

  const getActionLabel = (status: string) => {
    switch (status) {
      case "completed":
      case "executed":
        return t("dashboard.action.viewResults", "View Results");
      case "configured":
        return t("dashboard.action.execute", "Execute Draw");
      default:
        return t("dashboard.action.configure", "Configure");
    }
  };

  const stats = [
    {
      icon: <Trophy className="w-6 h-6 text-accent-secondary" />,
      iconBg: "bg-accent-secondary/10",
      label: t("dashboard.stats.totalDraws", "Total Draws"),
      value: totalDraws,
      trend: totalDraws > 0 ? "+12%" : null,
      trendUp: true,
    },
    {
      icon: <Users className="w-6 h-6 text-accent-primary" />,
      iconBg: "bg-accent-primary/10",
      label: t("dashboard.stats.participants", "Participants"),
      value: totalParticipants.toLocaleString(),
      trend: totalParticipants > 0 ? "+5%" : null,
      trendUp: true,
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-success" />,
      iconBg: "bg-success/10",
      label: t("dashboard.stats.completed", "Completed"),
      value: completedDraws,
      trend: null,
      trendUp: true,
    },
    {
      icon: <CreditCard className="w-6 h-6 text-warning" />,
      iconBg: "bg-warning/10",
      label: t("dashboard.stats.credits", "Credits"),
      value: balance || 0,
      trend: null,
      trendUp: true,
      hasAction: true,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("dashboard.title", "Dashboard")}
            </h1>
            <p className="text-ink-secondary">
              {t("dashboard.subtitle", "Manage your contest draws")}
            </p>
          </div>
          <Link
            to="/draw/new"
            className="inline-flex items-center gap-2 bg-accent-primary text-white px-5 py-3 rounded-xl font-medium hover:brightness-110 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            {t("dashboard.newDraw", "New Draw")}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-bg-card border border-white/[0.06] rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-ink-secondary">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </div>
                )}
                {stat.hasAction && (
                  <Link
                    to="/pricing"
                    className="text-sm font-medium text-accent-secondary hover:text-accent-tertiary transition-colors"
                  >
                    {t("dashboard.buyMore", "Buy More")}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <h2 className="text-2xl font-bold text-white">
              {t("dashboard.recentActivity", "Recent Activity")}
            </h2>
            {draws.length > 5 && (
              <button className="text-accent-secondary hover:text-accent-tertiary font-medium transition-colors">
                {t("dashboard.viewAll", "View all history")}
              </button>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent-secondary border-t-transparent"></div>
              <p className="text-ink-secondary ml-4">
                {t("dashboard.loading", "Loading draws...")}
              </p>
            </div>
          ) : draws.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-ink-muted" />
              </div>
              <p className="text-ink-secondary mb-4">
                {t("dashboard.noDraws", "No draws yet")}
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-accent-primary text-white px-5 py-3 rounded-xl font-medium hover:brightness-110 transition-all"
              >
                <Plus className="w-5 h-5" />
                {t("dashboard.createFirst", "Create Your First Draw")}
              </Link>
            </div>
          ) : (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-sm font-medium text-ink-secondary">
                <div className="col-span-4">{t("dashboard.table.name", "Draw Name")}</div>
                <div className="col-span-2">{t("dashboard.table.platform", "Platform")}</div>
                <div className="col-span-2">{t("dashboard.table.date", "Date")}</div>
                <div className="col-span-2">{t("dashboard.table.status", "Status")}</div>
                <div className="col-span-2 text-right">{t("dashboard.table.action", "Action")}</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/[0.06]">
                {draws.slice(0, 10).map((draw, index) => {
                  const statusConfig = getStatusConfig(draw.status);
                  return (
                    <motion.div
                      key={draw.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        to={getDrawLink(draw)}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-bg-elevated transition-colors items-center"
                      >
                        {/* Draw Name */}
                        <div className="col-span-1 md:col-span-4">
                          <p className="font-medium text-white">{draw.title}</p>
                          <p className="text-sm text-ink-secondary md:hidden mt-1">
                            {format(new Date(draw.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>

                        {/* Platform */}
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${getPlatformStyle(draw.platform)} flex items-center justify-center text-white`}>
                            {getPlatformIcon(draw.platform)}
                          </div>
                          <span className="text-sm text-white capitalize">
                            {draw.platform || "Manual"}
                          </span>
                        </div>

                        {/* Date - Desktop only */}
                        <div className="hidden md:block col-span-2 text-sm text-ink-secondary">
                          {format(new Date(draw.createdAt), "MMM d, yyyy")}
                        </div>

                        {/* Status */}
                        <div className="col-span-1 md:col-span-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 md:col-span-2 flex justify-end">
                          <span className="inline-flex items-center gap-1 text-accent-secondary hover:text-accent-tertiary font-medium text-sm transition-colors">
                            {getActionLabel(draw.status)}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-8 bg-bg-card border border-white/[0.06] rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {t("dashboard.promo.title", "Need more credits?")}
              </h3>
              <p className="text-ink-secondary">
                {t("dashboard.promo.subtitle", "Get more credits to run unlimited giveaways and access premium features.")}
              </p>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-bg-primary border border-white/10 text-white px-5 py-3 rounded-xl font-medium hover:bg-bg-elevated transition-all whitespace-nowrap"
            >
              {t("dashboard.promo.cta", "View Pricing")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
