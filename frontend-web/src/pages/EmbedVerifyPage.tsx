import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Shield, Trophy, Users, CheckCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface EmbedData {
  draw: {
    id: string;
    title: string;
    participantsCount: number;
    numberOfWinners: number;
    executedAt: string;
  };
  winners: Array<{
    position: number;
    participant: {
      username: string;
      name: string;
      avatar?: string;
    };
  }>;
  participants?: Array<{
    username: string;
    name: string;
  }>;
  verification: {
    verified: boolean;
    verificationCode: string;
  };
}

/**
 * Embed Verification Widget
 * Lightweight embeddable version of verification page
 */
export default function EmbedVerifyPage() {
  const { drawId } = useParams<{ drawId: string }>();
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') || 'light';
  const showParticipants = searchParams.get('participants') === 'true';

  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [drawId]);

  const loadData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/public/verify/${drawId}`
      );

      setData({
        draw: response.data.draw,
        winners: response.data.winners,
        participants: showParticipants ? response.data.participants : undefined,
        verification: response.data.verification,
      });
    } catch (err) {
      console.error('Failed to load embed data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-gray-50';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
        <div className="text-center">
          <div
            className={`w-12 h-12 border-4 ${
              isDark ? 'border-blue-400' : 'border-blue-600'
            } border-t-transparent rounded-full animate-spin mx-auto mb-3`}
          ></div>
          <p className={textSecondary}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
        <p className={textSecondary}>Draw not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className={`${bgSecondary} rounded-lg p-4 mb-4 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-lg font-bold ${textColor}`}>Verified Draw</h2>
            </div>
            {data.verification.verified && (
              <span
                className={`flex items-center gap-1 px-2 py-1 ${
                  isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                } rounded-full text-xs font-semibold`}
              >
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-3`}>{data.draw.title}</h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {data.draw.participantsCount}
              </p>
              <p className={`text-xs ${textSecondary}`}>Participants</p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}
              >
                {data.draw.numberOfWinners}
              </p>
              <p className={`text-xs ${textSecondary}`}>Winners</p>
            </div>
            <div>
              <p className={`text-sm font-mono font-bold ${textColor}`}>
                {data.verification.verificationCode}
              </p>
              <p className={`text-xs ${textSecondary}`}>Code</p>
            </div>
          </div>
        </div>

        {/* Winners */}
        <div className={`rounded-lg p-4 mb-4 border ${borderColor} ${bgColor}`}>
          <h4 className={`font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
            Winners
          </h4>
          <div className="space-y-2">
            {data.winners.map((winner) => (
              <div
                key={winner.position}
                className={`flex items-center gap-3 p-2 ${bgSecondary} rounded`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 ${
                    isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-500 text-white'
                  } font-bold rounded-full text-sm`}
                >
                  #{winner.position}
                </div>
                {winner.participant.avatar && (
                  <img
                    src={winner.participant.avatar}
                    alt={winner.participant.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className={`font-medium text-sm ${textColor}`}>
                    {winner.participant.name}
                  </p>
                  <p className={`text-xs ${textSecondary}`}>@{winner.participant.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participants (if enabled) */}
        {showParticipants && data.participants && (
          <div className={`rounded-lg p-4 mb-4 border ${borderColor} ${bgColor}`}>
            <h4 className={`font-semibold ${textColor} mb-3 flex items-center gap-2`}>
              <Users className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              All Participants
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {data.participants.slice(0, 20).map((participant, index) => (
                <div key={index} className={`text-sm ${textSecondary} truncate`}>
                  @{participant.username}
                </div>
              ))}
            </div>
            {data.participants.length > 20 && (
              <p className={`text-xs ${textSecondary} mt-2 text-center`}>
                +{data.participants.length - 20} more participants
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <a
            href={`${window.location.origin}/verify/${drawId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-lg transition-colors text-sm`}
          >
            View Full Verification
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className={`text-xs ${textSecondary} mt-3`}>
            Powered by{' '}
            <a
              href={window.location.origin}
              target="_blank"
              rel="noopener noreferrer"
              className={isDark ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}
            >
              ContestDraw
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
