import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Shield,
  Calendar,
  Users,
  Trophy,
  Filter,
  CheckCircle,
  ExternalLink,
  Home,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import VerifyHash from "../components/VerifyHash";
import SocialShare from "../components/SocialShare";

interface VerificationData {
  draw: {
    id: string;
    title: string;
    description: string;
    platform: string;
    status: string;
    createdAt: string;
    executedAt: string;
    participantsCount: number;
    numberOfWinners: number;
    filters: any;
    organizer: {
      name: string;
    };
  };
  winners: Array<{
    id: string;
    position: number;
    participant: {
      username: string;
      name: string;
      avatar?: string;
      platform: string;
    };
    selectedAt: string;
    certificateUrl?: string;
  }>;
  participants: Array<{
    username: string;
    name: string;
    avatar?: string;
    platform: string;
  }>;
  verification: {
    hash: string;
    verificationCode: string;
    algorithm: string;
    hashAlgorithm: string;
    verified: boolean;
  };
  sharing: {
    verificationUrl: string;
    shortUrl: string;
    shortCode: string;
    qrCodeUrl: string;
    socialUrls: {
      twitter: string;
      facebook: string;
      linkedin: string;
      whatsapp: string;
      telegram: string;
    };
  };
}

/**
 * Public Verification Page
 * Displays draw details and verification information
 * No authentication required - fully transparent
 */
export default function PublicVerifyPage() {
  const { drawId } = useParams<{ drawId: string }>();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  useEffect(() => {
    loadVerificationData();
  }, [drawId]);

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/public/verify/${drawId}`,
      );
      setData(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load verification data",
      );
      toast.error("Failed to load draw verification");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error || "Draw not found"}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const participantsToShow = showAllParticipants
    ? data.participants
    : data.participants.slice(0, 20);

  return (
    <>
      <Helmet>
        <title>{`Verify Draw: ${data.draw.title} | ContestDraw`}</title>
        <meta
          name="description"
          content={`Verify the results of "${data.draw.title}" - a transparent and fair draw with ${data.draw.participantsCount} participants and ${data.draw.numberOfWinners} winners.`}
        />
        <meta property="og:title" content={`Verify Draw: ${data.draw.title}`} />
        <meta
          property="og:description"
          content={`Transparent draw results verified with cryptographic proof. ${data.draw.participantsCount} participants, ${data.draw.numberOfWinners} winners.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={data.sharing.verificationUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Verify Draw: ${data.draw.title}`}
        />
        <meta
          name="twitter:description"
          content={`Transparent and verifiable draw results. ${data.draw.numberOfWinners} winners selected from ${data.draw.participantsCount} participants.`}
        />
        <link rel="canonical" href={data.sharing.verificationUrl} />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: data.draw.title,
            description: data.draw.description,
            startDate: data.draw.createdAt,
            endDate: data.draw.executedAt,
            organizer: {
              "@type": "Person",
              name: data.draw.organizer.name,
            },
            attendeeCount: data.draw.participantsCount,
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    Draw Verification
                  </h1>
                  {data.verification.verified && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
                <h2 className="text-xl text-gray-700">{data.draw.title}</h2>
                {data.draw.description && (
                  <p className="text-gray-600 mt-2">{data.draw.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Executed</p>
                  <p className="text-sm font-medium">
                    {new Date(data.draw.executedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Participants</p>
                  <p className="text-sm font-medium">
                    {data.draw.participantsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Trophy className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Winners</p>
                  <p className="text-sm font-medium">
                    {data.draw.numberOfWinners}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">Platform</p>
                  <p className="text-sm font-medium capitalize">
                    {data.draw.platform}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Organized by:</strong> {data.draw.organizer.name}
              </p>
            </div>
          </div>

          {/* Winners Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Winners
            </h3>
            <div className="space-y-3">
              {data.winners.map((winner) => (
                <div
                  key={winner.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white font-bold rounded-full">
                      #{winner.position}
                    </div>
                    {winner.participant.avatar && (
                      <img
                        src={winner.participant.avatar}
                        alt={winner.participant.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {winner.participant.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        @{winner.participant.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        Selected: {new Date(winner.selectedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {winner.certificateUrl && (
                    <a
                      href={winner.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Certificate
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Participants ({data.draw.participantsCount})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {participantsToShow.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {participant.avatar && (
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{participant.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {data.participants.length > 20 && (
              <button
                onClick={() => setShowAllParticipants(!showAllParticipants)}
                className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAllParticipants
                  ? "Show Less"
                  : `Show All ${data.participants.length} Participants`}
              </button>
            )}
          </div>

          {/* Hash Verification */}
          <div className="mb-6">
            <VerifyHash
              drawId={data.draw.id}
              expectedHash={data.verification.hash}
              verified={data.verification.verified}
            />
          </div>

          {/* Social Share */}
          <SocialShare
            drawId={data.draw.id}
            drawTitle={data.draw.title}
            verificationUrl={data.sharing.verificationUrl}
            shortUrl={data.sharing.shortUrl}
            qrCodeUrl={data.sharing.qrCodeUrl}
            socialUrls={data.sharing.socialUrls}
          />

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Create Your Own Fair Draw
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
