import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import type { Participant } from "../types";

// Extended type to handle backend data that may have 'identifier' instead of 'username'
interface BackendParticipant extends Partial<Participant> {
  id: string;
  name: string;
  identifier?: string;
  source?: string;
}

interface ParticipantsListProps {
  participants: (Participant | BackendParticipant)[];
}

export default function ParticipantsList({
  participants,
}: ParticipantsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to get username (supports both 'username' and 'identifier' fields)
  const getUsername = (p: Participant | BackendParticipant): string => {
    return (p as Participant).username || (p as BackendParticipant).identifier || "";
  };

  // Helper to get platform (supports both 'platform' and 'source' fields)
  const getPlatform = (p: Participant | BackendParticipant): string => {
    return (p as Participant).platform || (p as BackendParticipant).source || "manual";
  };

  const filteredParticipants = participants.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const username = getUsername(p).toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || username.includes(search);
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Participants ({participants.length})
          </h2>
        </div>
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
                {(participant as Participant).avatar ? (
                  <img
                    src={(participant as Participant).avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {participant.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {participant.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    @{getUsername(participant)}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700 capitalize">
                    {getPlatform(participant)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredParticipants.length === 0 && searchTerm && (
            <p className="text-center text-gray-600 py-4">
              No participants found
            </p>
          )}
        </>
      )}
    </div>
  );
}
