import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Share2, Plus, MoreHorizontal } from "lucide-react";

interface AudioOptionsProps {
  audioTitle?: string;
  audioArtist?: string;
  audioUrl?: string;
  onSaveToLibrary?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onAddToPlaylist?: (playlistId: string) => void;
}

const AudioOptions = ({
  audioTitle = "Extracted Vocals",
  audioArtist = "Unknown Artist",
  audioUrl = "",
  onSaveToLibrary = () => {},
  onDownload = () => {},
  onShare = () => {},
  onAddToPlaylist = () => {},
}: AudioOptionsProps) => {
  // Mock playlists for the dropdown
  const playlists = [
    { id: "1", name: "Favorite Nasheeds" },
    { id: "2", name: "Relaxing Recitations" },
    { id: "3", name: "Daily Azkar" },
  ];

  return (
    <div className="w-full p-6 rounded-lg bg-background border border-border shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{audioTitle}</h3>
            <p className="text-sm text-muted-foreground">{audioArtist}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSaveToLibrary}>
                Save to Library
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownload}>Download</DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>Share</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSaveToLibrary}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Save to Library</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save to your library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download audio file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add to Playlist</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to a playlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-56">
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={() => onAddToPlaylist(playlist.id)}
                >
                  {playlist.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>Create New Playlist</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            This audio has been processed and is ready for use. You can save it
            to your library, download it, or add it to a playlist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioOptions;
