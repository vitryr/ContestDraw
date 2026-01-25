import { motion } from 'framer-motion';
import { Trophy, Download, ExternalLink } from 'lucide-react';
import type { Winner } from '../types';

interface WinnerCardProps {
  winner: Winner;
  onDownloadCertificate: () => void;
}

export default function WinnerCard({ winner, onDownloadCertificate }: WinnerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold text-gray-900">Winner #{winner.position}</span>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        {winner.participant.avatar ? (
          <img
            src={winner.participant.avatar}
            alt={winner.participant.name}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary-100"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 border-4 border-primary-100">
            <span className="text-3xl font-bold text-white">
              {winner.participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-1">{winner.participant.name}</h3>
        <p className="text-gray-600 mb-2">@{winner.participant.username}</p>

        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 capitalize">
          {winner.participant.platform}
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={onDownloadCertificate}
          className="w-full btn-primary text-sm py-2"
        >
          <Download className="w-4 h-4 mr-2 inline" />
          Download Certificate
        </button>

        {winner.participant.platform === 'instagram' && (
          <a
            href={`https://instagram.com/${winner.participant.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-secondary text-sm py-2 block text-center"
          >
            <ExternalLink className="w-4 h-4 mr-2 inline" />
            View Profile
          </a>
        )}
      </div>

      {winner.certificateUrl && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href={winner.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Certificate →
          </a>
        </div>
      )}
    </motion.div>
  );
}
