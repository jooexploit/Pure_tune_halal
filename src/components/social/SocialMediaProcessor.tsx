import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PlatformSelector from "./PlatformSelector";
import VideoProcessor from "./VideoProcessor";
import AudioOptions from "./AudioOptions";

interface SocialMediaProcessorProps {
  className?: string;
}

const SocialMediaProcessor: React.FC<SocialMediaProcessorProps> = ({
  className = "",
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [processingStep, setProcessingStep] = useState<
    "platform" | "process" | "options"
  >("platform");
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string>("");
  const [processedAudioTitle, setProcessedAudioTitle] = useState<string>("");

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setProcessingStep("process");
  };

  const handleProcessComplete = (audioUrl: string) => {
    setProcessedAudioUrl(audioUrl);
    setProcessedAudioTitle(`Extracted Audio from ${selectedPlatform}`);
    setProcessingStep("options");
  };

  const handleBackToPlatform = () => {
    setProcessingStep("platform");
    setSelectedPlatform("");
  };

  const handleBackToProcess = () => {
    setProcessingStep("process");
    setProcessedAudioUrl("");
  };

  return (
    <div className={`w-full h-full bg-background p-4 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Social Media Processor
          </h1>
          <p className="text-muted-foreground mt-2">
            Extract vocals-only audio from social media videos across different
            platforms
          </p>
        </div>

        <Card className="w-full bg-card border-border">
          <CardContent className="p-6">
            {processingStep === "platform" && (
              <PlatformSelector
                selectedPlatform={selectedPlatform}
                onSelectPlatform={handlePlatformSelect}
              />
            )}

            {processingStep === "process" && (
              <div className="space-y-4">
                <button
                  onClick={handleBackToPlatform}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  ← Back to platform selection
                </button>
                <VideoProcessor
                  selectedPlatform={selectedPlatform}
                  onProcessComplete={handleProcessComplete}
                />
              </div>
            )}

            {processingStep === "options" && (
              <div className="space-y-4">
                <button
                  onClick={handleBackToProcess}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  ← Back to processor
                </button>
                <AudioOptions
                  audioTitle={processedAudioTitle}
                  audioUrl={processedAudioUrl}
                  audioArtist="Extracted from Social Media"
                  onSaveToLibrary={() => console.log("Saving to library")}
                  onDownload={() => console.log("Downloading")}
                  onShare={() => console.log("Sharing")}
                  onAddToPlaylist={(playlistId) =>
                    console.log(`Adding to playlist ${playlistId}`)
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-medium mb-2">How it works</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Select the social media platform where your video is hosted</li>
            <li>Paste the URL of the video you want to process</li>
            <li>Our AI will extract the vocals-only audio from the video</li>
            <li>
              Preview the extracted audio and save it to your library or
              download it
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: Processing time may vary depending on the length and quality
            of the video. For optimal results, use videos with clear vocal
            content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaProcessor;
