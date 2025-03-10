import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Heart,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

interface FeaturedTrack {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: string;
  isFeatured?: boolean;
}

interface FeaturedContentProps {
  tracks?: FeaturedTrack[];
  title?: string;
  subtitle?: string;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({
  tracks = [
    {
      id: "1",
      title: "Beautiful Recitation",
      artist: "Mishary Rashid Alafasy",
      coverImage:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
      duration: "4:32",
      isFeatured: true,
    },
    {
      id: "2",
      title: "Peaceful Nasheed",
      artist: "Sami Yusuf",
      coverImage:
        "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?w=800&q=80",
      duration: "3:45",
    },
    {
      id: "3",
      title: "Morning Dhikr",
      artist: "Ahmed Bukhatir",
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      duration: "5:21",
    },
    {
      id: "4",
      title: "Ramadan Special",
      artist: "Maher Zain",
      coverImage:
        "https://images.unsplash.com/photo-1542816417-0983674e29d0?w=800&q=80",
      duration: "4:15",
    },
    {
      id: "5",
      title: "Evening Reflection",
      artist: "Yusuf Islam",
      coverImage:
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
      duration: "3:58",
    },
  ],
  title = "Featured Content",
  subtitle = "Discover the best Islamic vocals and recitations",
}) => {
  const [featuredTrack, setFeaturedTrack] = useState<FeaturedTrack | null>(
    null,
  );

  useEffect(() => {
    // Set the first featured track or the first track as featured
    const featured = tracks.find((track) => track.isFeatured) || tracks[0];
    setFeaturedTrack(featured);
  }, []); // Empty dependency array to run only once

  const handleTrackSelect = (track: FeaturedTrack) => {
    setFeaturedTrack(track);
  };

  return (
    <div className="w-full bg-background p-4 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {featuredTrack && (
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-r from-primary/10 to-secondary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <img
              src={featuredTrack.coverImage}
              alt={featuredTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {featuredTrack.title}
              </h3>
              <p className="text-white/80 mb-4">{featuredTrack.artist}</p>
              <div className="flex space-x-3">
                <Button className="rounded-full" size="sm">
                  <Play className="mr-2 h-4 w-4" /> Play Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-none hover:bg-white/20"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-none hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-none hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Popular Tracks</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {tracks.map((track) => (
              <CarouselItem
                key={track.id}
                className="md:basis-1/3 lg:basis-1/4"
              >
                <Card
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleTrackSelect(track)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full"
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {track.title}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {track.artist}
                    </p>
                    <p className="text-xs text-muted-foreground ml-auto">
                      {track.duration}
                    </p>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 lg:-left-6" />
          <CarouselNext className="-right-4 lg:-right-6" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedContent;
