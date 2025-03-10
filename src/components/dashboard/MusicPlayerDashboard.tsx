import React, { useState } from "react";
import FeaturedContent from "./FeaturedContent";
import RecentlyPlayed from "./RecentlyPlayed";
import PlaylistSection from "./PlaylistSection";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
}

interface MusicPlayerDashboardProps {
  featuredTitle?: string;
  featuredSubtitle?: string;
  onTrackSelect?: (track: Track) => void;
  onPlaylistSelect?: (playlistId: string) => void;
  onCreatePlaylist?: (name: string) => void;
}

const MusicPlayerDashboard: React.FC<MusicPlayerDashboardProps> = ({
  featuredTitle = "Featured Content",
  featuredSubtitle = "Discover the best Islamic vocals and recitations",
  onTrackSelect = () => {},
  onPlaylistSelect = () => {},
  onCreatePlaylist = () => {},
}) => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    onTrackSelect(track);
  };

  return (
    <div className="w-full h-full bg-background overflow-y-auto pb-24">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Featured Content Section */}
        <section>
          <FeaturedContent title={featuredTitle} subtitle={featuredSubtitle} />
        </section>

        {/* Recently Played and Playlists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recently Played Section */}
          <section className="lg:col-span-1">
            <RecentlyPlayed onTrackSelect={handleTrackSelect} />
          </section>

          {/* Playlists Section */}
          <section className="lg:col-span-2">
            <PlaylistSection
              onPlayPlaylist={onPlaylistSelect}
              onCreatePlaylist={onCreatePlaylist}
            />
          </section>
        </div>

        {/* Recommendations Section */}
        <section className="mt-8">
          <div className="bg-background p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
            <p className="text-muted-foreground mb-6">
              Based on your listening history and preferences
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Recommendation Cards */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    handleTrackSelect({
                      id: `rec-${index}`,
                      title: `Recommended Track ${index + 1}`,
                      artist: `Artist ${index + 1}`,
                      duration: "3:45",
                      coverArt: `https://images.unsplash.com/photo-${1500000000 + index * 1000}?w=300&q=80`,
                    })
                  }
                >
                  <div className="aspect-square relative">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000 + index * 10000}?w=300&q=80`}
                      alt={`Recommendation ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-white"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">
                      Recommended Track {index + 1}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Artist {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Categories */}
        <section className="mt-8">
          <div className="bg-background p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                "Nasheeds",
                "Quran Recitations",
                "Azkar",
                "Lectures",
                "Dua",
                "Instrumental",
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-accent/50 hover:bg-accent rounded-lg p-4 text-center cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-primary"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">{category}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MusicPlayerDashboard;
