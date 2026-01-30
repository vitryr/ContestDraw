import { useState } from "react";
import { Instagram } from "lucide-react";
import toast from "react-hot-toast";

interface SocialConnectProps {
  drawId: string;
  onImport: (platform: string, url: string) => Promise<void>;
}

export default function SocialConnect({
  drawId,
  onImport,
}: SocialConnectProps) {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!url) {
      toast.error("Please enter a post URL");
      return;
    }

    setIsImporting(true);
    try {
      await onImport("instagram", url);
      setUrl("");
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Platform indicator */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-primary-600 bg-primary-50 text-primary-700">
        <Instagram className="w-5 h-5" />
        <span className="font-medium">Instagram</span>
      </div>

      {/* URL Input */}
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Instagram post URL..."
          className="input-field"
        />
      </div>

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={isImporting || !url}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isImporting ? "Importing..." : "Import Participants"}
      </button>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>How to import:</strong>
        </p>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Copy the URL of your contest post</li>
          <li>Paste it in the field above</li>
          <li>We'll automatically fetch all participants</li>
        </ol>
      </div>
    </div>
  );
}
