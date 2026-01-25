import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Download } from 'lucide-react';
import type { Participant } from '../types';

interface ParticipantsListProps {
  participants: Participant[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Username', 'Platform'],
      ...participants.map((p) => [p.name, p.username, p.platform]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Participants ({participants.length})
          </h2>
        </div>
        {participants.length > 0 && (
          <button onClick={handleExportCSV} className="btn-secondary text-sm">
            <Download className="w-4 h-4 mr-2 inline" />
            Export CSV
          </button>
        )}
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No participants yet</p>
          <p className="text-sm text-gray-500">
            Upload a CSV file or import from social media to get started
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search participants..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{participant.name}</div>
                  <div className="text-sm text-gray-600">@{participant.username}</div>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700 capitalize">
                    {participant.platform}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredParticipants.length === 0 && searchTerm && (
            <p className="text-center text-gray-600 py-4">No participants found</p>
          )}
        </>
      )}
    </div>
  );
}
