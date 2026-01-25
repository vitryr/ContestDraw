import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Send, QrCode, Copy, Check, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

interface SocialShareProps {
  drawId: string;
  drawTitle: string;
  verificationUrl: string;
  shortUrl: string;
  qrCodeUrl: string;
  socialUrls: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
  };
  embedCode?: string;
}

/**
 * Social Share Component
 * Provides sharing options for verification links
 */
export default function SocialShare({
  drawId,
  drawTitle,
  verificationUrl,
  shortUrl,
  qrCodeUrl,
  socialUrls,
  embedCode,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const copyToClipboard = async (text: string, type: 'link' | 'embed' = 'link') => {
    try {
      await navigator.clipboard.writeText(text);

      if (type === 'link') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard!');
      } else {
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 2000);
        toast.success('Embed code copied!');
      }
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareVia = (platform: string, url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Share Verification</h3>
      </div>

      {/* Quick Copy Link */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Verification Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={shortUrl}
            readOnly
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-700"
          />
          <button
            onClick={() => copyToClipboard(shortUrl)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link to prove the authenticity of your draw results
        </p>
      </div>

      {/* Social Media Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Share on Social Media
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => shareVia('Twitter', socialUrls.twitter)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span className="text-sm font-medium">Twitter</span>
          </button>

          <button
            onClick={() => shareVia('Facebook', socialUrls.facebook)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span className="text-sm font-medium">Facebook</span>
          </button>

          <button
            onClick={() => shareVia('LinkedIn', socialUrls.linkedin)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm font-medium">LinkedIn</span>
          </button>

          <button
            onClick={() => shareVia('WhatsApp', socialUrls.whatsapp)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => shareVia('Telegram', socialUrls.telegram)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Telegram</span>
          </button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex gap-3">
        <Dialog.Root open={showQR} onOpenChange={setShowQR}>
          <Dialog.Trigger asChild>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <QrCode className="w-4 h-4" />
              <span className="text-sm font-medium">QR Code</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 max-w-md w-full">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                QR Code for Verification
              </Dialog.Title>
              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center mb-4">
                <img
                  src={qrCodeUrl}
                  alt="Verification QR Code"
                  className="w-64 h-64"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                      <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                        <rect width="256" height="256" fill="#f3f4f6"/>
                        <text x="128" y="128" text-anchor="middle" font-size="14" fill="#6b7280">
                          QR Code
                        </text>
                      </svg>
                    `);
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">
                Scan this QR code to verify draw results on any device
              </p>
              <Dialog.Close asChild>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {embedCode && (
          <Dialog.Root open={showEmbed} onOpenChange={setShowEmbed}>
            <Dialog.Trigger asChild>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Embed Code</span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                  Embed Verification Widget
                </Dialog.Title>
                <p className="text-sm text-gray-600 mb-4">
                  Copy this code and paste it into your website to display the verification widget
                </p>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-xs text-gray-100 overflow-x-auto font-mono">
                    {embedCode}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {embedCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Share the verification link to build trust and transparency with your
          participants. Anyone can verify the authenticity of the draw results.
        </p>
      </div>
    </div>
  );
}
