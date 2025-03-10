import React, { useState } from "react";
import { PlusCircle, MoreVertical, Play } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  coverImage: string;
}

interface PlaylistSectionProps {
  playlists?: Playlist[];
  onCreatePlaylist?: (name: string) => void;
  onPlayPlaylist?: (id: string) => void;
}

const PlaylistSection = ({
  playlists = [
    {
      id: "1",
      name: "Favorite Nasheeds",
      trackCount: 12,
      coverImage:
        "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80",
    },
    {
      id: "2",
      name: "Peaceful Recitations",
      trackCount: 8,
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    },
    {
      id: "3",
      name: "Morning Azkar",
      trackCount: 5,
      coverImage:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    },
    {
      id: "4",
      name: "Evening Reflections",
      trackCount: 7,
      coverImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    },
  ],
  onCreatePlaylist = () => {},
  onPlayPlaylist = () => {},
}: PlaylistSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName);
      setNewPlaylistName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Create Playlist</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="playlist-name" className="text-sm font-medium">
                  Playlist Name
                </label>
                <Input
                  id="playlist-name"
                  placeholder="Enter playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreatePlaylist}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden h-full">
              <div className="relative group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={playlist.coverImage}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    onClick={() => onPlayPlaylist(playlist.id)}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {playlist.trackCount} tracks
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
