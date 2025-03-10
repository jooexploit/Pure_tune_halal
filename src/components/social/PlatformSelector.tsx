import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Youtube, Instagram, Facebook, Music } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatform?: string;
  onSelectPlatform?: (platform: string) => void;
}

const PlatformSelector = ({
  selectedPlatform = "",
  onSelectPlatform = () => {},
}: PlatformSelectorProps) => {
  const platforms = [
    {
      id: "youtube",
      name: "YouTube",
      icon: <Youtube size={24} />,
      description: "Extract vocals from YouTube videos",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={24} />,
      description: "Process Instagram reels and videos",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <Music size={24} />,
      description: "Extract audio from TikTok videos",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={24} />,
      description: "Process Facebook videos and reels",
    },
  ];

  return (
    <div className="w-full bg-background p-4">
      <h2 className="text-2xl font-semibold mb-4">Select Platform</h2>
      <p className="text-muted-foreground mb-6">
        Choose a social media platform to extract vocals-only audio
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <TooltipProvider key={platform.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedPlatform === platform.id ? "border-primary ring-2 ring-primary/20" : ""}`}
                  onClick={() => onSelectPlatform(platform.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <div className="text-primary">{platform.icon}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{platform.description}</CardDescription>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select {platform.name} to process videos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          variant="default"
          disabled={!selectedPlatform}
          onClick={() => selectedPlatform && onSelectPlatform(selectedPlatform)}
        >
          Continue with{" "}
          {selectedPlatform
            ? platforms.find((p) => p.id === selectedPlatform)?.name
            : "selected platform"}
        </Button>
      </div>
    </div>
  );
};

export default PlatformSelector;
