import React, { useState } from "react";
import { Play, Download, Heart, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuranSectionProps {
  className?: string;
}

interface Surah {
  id: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Reciter {
  id: number;
  name: string;
  style?: string;
}

const QuranSection: React.FC<QuranSectionProps> = ({ className = "" }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for surahs
  const surahs: Surah[] = [
    {
      id: 1,
      name: "الفاتحة",
      englishName: "Al-Fatihah",
      numberOfAyahs: 7,
      revelationType: "Meccan",
    },
    {
      id: 2,
      name: "البقرة",
      englishName: "Al-Baqarah",
      numberOfAyahs: 286,
      revelationType: "Medinan",
    },
    {
      id: 3,
      name: "آل عمران",
      englishName: "Ali 'Imran",
      numberOfAyahs: 200,
      revelationType: "Medinan",
    },
    {
      id: 4,
      name: "النساء",
      englishName: "An-Nisa",
      numberOfAyahs: 176,
      revelationType: "Medinan",
    },
    {
      id: 5,
      name: "المائدة",
      englishName: "Al-Ma'idah",
      numberOfAyahs: 120,
      revelationType: "Medinan",
    },
  ];

  // Mock data for reciters
  const reciters: Reciter[] = [
    { id: 1, name: "Mishary Rashid Alafasy" },
    { id: 2, name: "Abdul Rahman Al-Sudais" },
    { id: 3, name: "Saud Al-Shuraim" },
    { id: 4, name: "Abu Bakr Al-Shatri" },
    { id: 5, name: "Hani Ar-Rifai" },
  ];

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.includes(searchQuery),
  );

  return (
    <Card className={`bg-white w-full h-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quran Recitations</CardTitle>
        <CardDescription>
          Listen to beautiful Quran recitations from renowned reciters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="surahs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="surahs">Surahs</TabsTrigger>
            <TabsTrigger value="reciters">Reciters</TabsTrigger>
          </TabsList>

          <TabsContent value="surahs" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search surahs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <ScrollArea className="h-[280px] rounded-md border p-4">
              <div className="space-y-2">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedSurah?.id === surah.id ? "bg-primary/10" : "hover:bg-secondary/50"}`}
                    onClick={() => setSelectedSurah(surah)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-medium">
                          {surah.id}
                        </div>
                        <div>
                          <h3 className="font-medium">{surah.englishName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {surah.name} • {surah.numberOfAyahs} verses
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {surah.revelationType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reciters" className="space-y-4">
            <ScrollArea className="h-[320px] rounded-md border p-4">
              <div className="space-y-2">
                {reciters.map((reciter) => (
                  <div
                    key={reciter.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedReciter?.id === reciter.id ? "bg-primary/10" : "hover:bg-secondary/50"}`}
                    onClick={() => setSelectedReciter(reciter)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {reciter.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{reciter.name}</h3>
                        {reciter.style && (
                          <p className="text-sm text-muted-foreground">
                            {reciter.style}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedSurah && (
          <div className="mt-6 p-4 rounded-lg border bg-secondary/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  {selectedSurah.englishName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSurah.name} • {selectedSurah.numberOfAyahs} verses
                </p>
              </div>

              <Select defaultValue="1">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select reciter" />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id.toString()}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>Play</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Powered by Islamic Audio Platform
        </p>
      </CardFooter>
    </Card>
  );
};

export default QuranSection;
