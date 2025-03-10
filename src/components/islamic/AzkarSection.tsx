import React, { useState } from "react";
import { Play, Pause, Download, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AzkarCategory {
  id: string;
  name: string;
  description: string;
  items: AzkarItem[];
}

interface AzkarItem {
  id: string;
  text: string;
  translation: string;
  audioUrl: string;
  repetitions: number;
}

interface AzkarSectionProps {
  categories?: AzkarCategory[];
}

const defaultCategories: AzkarCategory[] = [
  {
    id: "morning",
    name: "Morning Azkar",
    description: "Azkar to recite in the morning after Fajr prayer",
    items: [
      {
        id: "morning-1",
        text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        translation: "I seek refuge in Allah from the accursed Satan",
        audioUrl: "/azkar/morning-1.mp3",
        repetitions: 1,
      },
      {
        id: "morning-2",
        text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",
        translation:
          "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant",
        audioUrl: "/azkar/morning-2.mp3",
        repetitions: 1,
      },
      {
        id: "morning-3",
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        translation: "Glory and praise be to Allah",
        audioUrl: "/azkar/morning-3.mp3",
        repetitions: 3,
      },
    ],
  },
  {
    id: "evening",
    name: "Evening Azkar",
    description: "Azkar to recite in the evening after Asr prayer",
    items: [
      {
        id: "evening-1",
        text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        translation:
          "I seek refuge in the perfect words of Allah from the evil of what He has created",
        audioUrl: "/azkar/evening-1.mp3",
        repetitions: 3,
      },
      {
        id: "evening-2",
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        translation:
          "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return",
        audioUrl: "/azkar/evening-2.mp3",
        repetitions: 1,
      },
    ],
  },
  {
    id: "sleep",
    name: "Sleep Azkar",
    description: "Azkar to recite before sleeping",
    items: [
      {
        id: "sleep-1",
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        translation: "In Your name, O Allah, I die and I live",
        audioUrl: "/azkar/sleep-1.mp3",
        repetitions: 1,
      },
      {
        id: "sleep-2",
        text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        translation:
          "O Allah, protect me from Your punishment on the day You resurrect Your servants",
        audioUrl: "/azkar/sleep-2.mp3",
        repetitions: 3,
      },
    ],
  },
];

const AzkarSection: React.FC<AzkarSectionProps> = ({
  categories = defaultCategories,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || "",
  );
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements] = useState<Record<string, HTMLAudioElement>>({});

  const handlePlayPause = (itemId: string, audioUrl: string) => {
    if (playingAudio === itemId) {
      // Pause current audio
      audioElements[itemId]?.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      if (playingAudio && audioElements[playingAudio]) {
        audioElements[playingAudio].pause();
      }

      // Play new audio
      if (!audioElements[itemId]) {
        // Create audio element if it doesn't exist
        audioElements[itemId] = new Audio(audioUrl);
        audioElements[itemId].addEventListener("ended", () => {
          setPlayingAudio(null);
        });
      }

      audioElements[itemId].play();
      setPlayingAudio(itemId);
    }
  };

  const handleDownload = (audioUrl: string, name: string) => {
    // Create a temporary link to download the audio file
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToPlaylist = (itemId: string) => {
    // Placeholder for adding to playlist functionality
    console.log(`Added ${itemId} to playlist`);
  };

  return (
    <div className="w-full h-full bg-background rounded-lg p-4">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Azkar Collection</CardTitle>
          <CardDescription>
            Browse and listen to daily Islamic remembrances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="w-full flex justify-start mb-4 overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-card hover:bg-accent/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-2">
                            <div className="text-lg font-medium text-right leading-relaxed">
                              {item.text}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.translation}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Repeat {item.repetitions} time
                              {item.repetitions > 1 ? "s" : ""}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePlayPause(item.id, item.audioUrl)
                            }
                            className="flex items-center gap-1"
                          >
                            {playingAudio === item.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            {playingAudio === item.id ? "Pause" : "Play"}
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownload(item.audioUrl, item.id)
                              }
                              title="Download audio"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddToPlaylist(item.id)}
                              title="Add to playlist"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AzkarSection;
