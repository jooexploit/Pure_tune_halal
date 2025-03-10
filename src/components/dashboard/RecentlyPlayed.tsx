import React from "react";
import { Play, Clock, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
}

interface RecentlyPlayedProps {
  tracks?: Track[];
  onTrackSelect?: (track: Track) => void;
  className?: string;
}

const RecentlyPlayed = ({
  tracks = [
    {
      id: "1",
      title: "Ya Nabi Salam Alayka",
      artist: "Maher Zain",
      duration: "4:25",
      coverArt:
        "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&q=80",
    },
    {
      id: "2",
      title: "Asma Allah Al Husna",
      artist: "Sami Yusuf",
      duration: "5:10",
      coverArt:
        "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=300&q=80",
    },
    {
      id: "3",
      title: "Tala Al Badru Alayna",
      artist: "Mishary Rashid Alafasy",
      duration: "3:45",
      coverArt:
        "https://images.unsplash.com/photo-1611516491426-03025e6043c8?w=300&q=80",
    },
    {
      id: "4",
      title: "Hasbi Rabbi",
      artist: "Ahmed Bukhatir",
      duration: "4:05",
      coverArt:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    },
    {
      id: "5",
      title: "Rahman Ya Rahman",
      artist: "Raef",
      duration: "3:55",
      coverArt:
        "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=300&q=80",
    },
    {
      id: "6",
      title: "Mawlaya",
      artist: "Ibrahim Hamad",
      duration: "4:30",
      coverArt:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80",
    },
  ],
  onTrackSelect = () => {},
  className = "",
}: RecentlyPlayedProps) => {
  return (
    <div className={cn("w-full bg-background p-6 rounded-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recently Played</h2>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>

      <ScrollArea className="h-[200px] w-full">
        <div className="space-y-2">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onTrackSelect(track)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play size={18} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {track.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Heart size={16} />
                    </button>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {track.duration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentlyPlayed;
