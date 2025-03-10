import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Play,
  Download,
  Share,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface VideoProcessorProps {
  selectedPlatform?: string;
  onProcessComplete?: (audioUrl: string) => void;
}

const VideoProcessor = ({
  selectedPlatform = "YouTube",
  onProcessComplete = () => {},
}: VideoProcessorProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setError(null);
  };

  const handleProcess = () => {
    if (!videoUrl) {
      setError("Please enter a valid URL");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Mock successful processing
          const mockAudioUrl = "https://example.com/processed-audio.mp3";
          setProcessedAudio(mockAudioUrl);
          onProcessComplete(mockAudioUrl);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleReset = () => {
    setVideoUrl("");
    setProcessedAudio(null);
    setProgress(0);
    setError(null);
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Process {selectedPlatform} Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="video-url"
            className="text-sm font-medium text-foreground"
          >
            Enter {selectedPlatform} URL
          </label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              placeholder={`Paste ${selectedPlatform} video URL here...`}
              value={videoUrl}
              onChange={handleUrlChange}
              disabled={isProcessing || !!processedAudio}
              className="flex-1"
            />
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !videoUrl || !!processedAudio}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Process"
              )}
            </Button>
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing video...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Extracting vocals-only audio from your {selectedPlatform} video.
              This may take a few moments.
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {processedAudio && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Processing Complete</AlertTitle>
              <AlertDescription>
                Vocals-only audio has been successfully extracted from your{" "}
                {selectedPlatform} video.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-md font-medium mb-2">Preview</h3>
              <audio controls className="w-full">
                <source src={processedAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </CardContent>

      {processedAudio && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={handleReset}>
            Process Another Video
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button>
              <Share className="mr-2 h-4 w-4" />
              Save to Library
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default VideoProcessor;
