import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Download, Users, Settings } from 'lucide-react';
import { useDrawStore } from '../store/useDrawStore';
import FilterConfig from '../components/FilterConfig';
import ParticipantsList from '../components/ParticipantsList';
import SocialConnect from '../components/SocialConnect';
import toast from 'react-hot-toast';

export default function DrawConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDraw, fetchDraw, updateDraw, importParticipants, uploadParticipantsCSV, isLoading } = useDrawStore();
  const [activeTab, setActiveTab] = useState<'participants' | 'filters'>('participants');

  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      await uploadParticipantsCSV(id, file);
      toast.success('Participants imported successfully!');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleSocialImport = async (platform: string, url: string) => {
    if (!id) return;

    try {
      await importParticipants(id, platform, url);
      toast.success('Participants imported from social media!');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleContinue = async () => {
    if (!id || !currentDraw) return;

    if ((currentDraw.participants?.length || 0) === 0) {
      toast.error('Please add participants before continuing');
      return;
    }

    await updateDraw(id, { status: 'configured' });
    navigate(`/draw/${id}/execute`);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDraw.title}</h1>
            <p className="text-gray-600">Configure participants and draw filters</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Setup</span>
              </div>
              <div className="w-12 h-0.5 bg-primary-600"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Configure</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Execute</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'participants'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  Participants
                  {currentDraw.participants && (
                    <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {currentDraw.participants.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('filters')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'filters'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  Filters & Rules
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'participants' ? (
              <>
                {/* Import Options */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Import Participants</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CSV Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Upload CSV File</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload a CSV file with participant information
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label
                        htmlFor="csv-upload"
                        className="btn-secondary cursor-pointer inline-block"
                      >
                        Choose File
                      </label>
                    </div>

                    {/* Social Import */}
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                      <Download className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Import from Social Media</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Connect your account and import automatically
                      </p>
                      <SocialConnect drawId={id!} onImport={handleSocialImport} />
                    </div>
                  </div>
                </div>

                {/* Participants List */}
                <ParticipantsList participants={currentDraw.participants || []} />
              </>
            ) : (
              <FilterConfig drawId={id!} currentFilters={currentDraw.filters || {}} />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleContinue}
              disabled={!currentDraw.participants || currentDraw.participants.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Draw
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
