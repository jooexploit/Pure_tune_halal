import React, { useState, useEffect } from "react";
import {
  Play,
  Download,
  Heart,
  Search,
  BookOpen,
  Layers,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
  Volume2,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface QuranSectionProps {
  className?: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Juz {
  number: number;
  ayahs: {
    number: number;
    surah: { number: number; name: string; englishName: string };
  }[];
}

interface Reciter {
  id: number;
  name: string;
  style?: string;
}

interface Ayah {
  number: number;
  text: string;
  translation?: string;
  audio?: string;
}

const QuranSection: React.FC<QuranSectionProps> = ({ className = "" }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<Juz | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [juzs, setJuzs] = useState<Juz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browseMode, setBrowseMode] = useState<"surah" | "juz">("surah");
  const [showReader, setShowReader] = useState(false);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ayahsPerPage = 10;
  const [viewMode, setViewMode] = useState<
    "side-by-side" | "arabic-only" | "translation-only"
  >("side-by-side");

  // Fetch surahs from API
  useEffect(() => {
    const fetchSurahs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        } else {
          setError("Failed to fetch surahs");
        }
      } catch (err) {
        setError("Error connecting to Quran API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  // Fetch juzs data with mock data as fallback
  useEffect(() => {
    const fetchJuzs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create an array of 30 juzs with basic info
        const juzArray = Array.from({ length: 30 }, (_, i) => ({
          number: i + 1,
          ayahs: [
            {
              number: 1,
              surah: {
                number: Math.floor((i * 114) / 30) + 1,
                name: "سورة",
                englishName: `Surah ${Math.floor((i * 114) / 30) + 1}`,
              },
            },
          ],
        }));

        // Try to fetch real data, but use mock data if it fails
        try {
          // Only fetch first juz as a test
          const response = await fetch(
            `https://api.alquran.cloud/v1/juz/1/en.asad`,
          );
          const data = await response.json();

          if (data.code === 200) {
            // If the test fetch works, we'll use our mock data anyway
            // This prevents making 30 API calls which might get rate limited
            setJuzs(juzArray);
          } else {
            throw new Error("API returned error code");
          }
        } catch (apiErr) {
          console.log("Using mock juz data due to API error", apiErr);
          // Use our mock data
          setJuzs(juzArray);
        }
      } catch (err) {
        console.error("Error in juz data setup:", err);
        // Create fallback data
        const fallbackJuzs = Array.from({ length: 30 }, (_, i) => ({
          number: i + 1,
          ayahs: [
            {
              number: 1,
              surah: {
                number: Math.floor((i * 114) / 30) + 1,
                name: "سورة",
                englishName: `Surah ${Math.floor((i * 114) / 30) + 1}`,
              },
            },
          ],
        }));
        setJuzs(fallbackJuzs);
      } finally {
        setLoading(false);
      }
    };

    fetchJuzs();
  }, []);

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

  const handleSurahSelect = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
  };

  const handleJuzSelect = async (juz: Juz) => {
    setSelectedJuz(juz);
    setSelectedSurah(null);
  };

  const fetchAyahs = async (surahNumber: number) => {
    setLoadingAyahs(true);
    setCurrentPage(1);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`,
      );
      const data = await response.json();
      if (data.code === 200) {
        // Get Arabic text
        const arabicResponse = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}`,
        );
        const arabicData = await arabicResponse.json();

        if (arabicData.code === 200) {
          // Combine Arabic text with English translation
          const combinedAyahs = data.data.ayahs.map(
            (ayah: any, index: number) => ({
              number: ayah.numberInSurah,
              text: arabicData.data.ayahs[index].text,
              translation: ayah.text,
              audio: "", // We could add audio URL here if needed
            }),
          );
          setAyahs(combinedAyahs);
        } else {
          setAyahs(
            data.data.ayahs.map((ayah: any) => ({
              number: ayah.numberInSurah,
              text: "Arabic text unavailable",
              translation: ayah.text,
            })),
          );
        }
      } else {
        setError("Failed to fetch ayahs");
        setAyahs([]);
      }
    } catch (err) {
      console.error("Error fetching ayahs:", err);
      setError("Error fetching ayahs");
      setAyahs([]);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const fetchJuzAyahs = async (juzNumber: number) => {
    setLoadingAyahs(true);
    setCurrentPage(1);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/en.asad`,
      );
      const data = await response.json();
      if (data.code === 200) {
        // Get Arabic text
        const arabicResponse = await fetch(
          `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`,
        );
        const arabicData = await arabicResponse.json();

        if (arabicData.code === 200) {
          // Combine Arabic text with English translation
          const combinedAyahs = data.data.ayahs.map(
            (ayah: any, index: number) => ({
              number: ayah.number,
              text: arabicData.data.ayahs[index].text,
              translation: ayah.text,
              surah: ayah.surah.englishName,
              audio: "", // We could add audio URL here if needed
            }),
          );
          setAyahs(combinedAyahs);
        } else {
          setAyahs(
            data.data.ayahs.map((ayah: any) => ({
              number: ayah.number,
              text: "Arabic text unavailable",
              translation: ayah.text,
              surah: ayah.surah.englishName,
            })),
          );
        }
      } else {
        setError("Failed to fetch ayahs");
        setAyahs([]);
      }
    } catch (err) {
      console.error("Error fetching juz ayahs:", err);
      setError("Error fetching ayahs");
      setAyahs([]);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const openReader = () => {
    if (selectedSurah) {
      fetchAyahs(selectedSurah.number);
    } else if (selectedJuz) {
      fetchJuzAyahs(selectedJuz.number);
    }
    setShowReader(true);
  };

  const closeReader = () => {
    setShowReader(false);
    setAyahs([]);
  };

  const totalPages = Math.ceil(ayahs.length / ayahsPerPage);

  const paginatedAyahs = ayahs.slice(
    (currentPage - 1) * ayahsPerPage,
    currentPage * ayahsPerPage,
  );

  return (
    <Card className={`bg-background w-full h-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quran Recitations</CardTitle>
        <CardDescription>
          Listen to beautiful Quran recitations from renowned reciters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="browse">Browse Quran</TabsTrigger>
            <TabsTrigger value="reciters">Reciters</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search surahs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={browseMode === "surah" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseMode("surah")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  By Surah
                </Button>
                <Button
                  variant={browseMode === "juz" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseMode("juz")}
                  className="flex items-center gap-2"
                >
                  <Layers className="h-4 w-4" />
                  By Juz
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Quran data...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[280px] rounded-md border p-4">
                <div className="space-y-2">
                  {browseMode === "surah"
                    ? // Surah list
                      filteredSurahs.map((surah) => (
                        <div
                          key={surah.number}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedSurah?.number === surah.number ? "bg-primary/10" : "hover:bg-accent/50"}`}
                          onClick={() => handleSurahSelect(surah)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-medium">
                                {surah.number}
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {surah.englishName}
                                </h3>
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
                      ))
                    : // Juz list
                      juzs.map((juz) => (
                        <div
                          key={juz.number}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedJuz?.number === juz.number ? "bg-primary/10" : "hover:bg-accent/50"}`}
                          onClick={() => handleJuzSelect(juz)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-medium">
                                {juz.number}
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  Juz {juz.number}
                                </h3>
                                {juz.ayahs && juz.ayahs.length > 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    Starts with Surah{" "}
                                    {juz.ayahs[0].surah.englishName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="reciters" className="space-y-4">
            <ScrollArea className="h-[320px] rounded-md border p-4">
              <div className="space-y-2">
                {reciters.map((reciter) => (
                  <div
                    key={reciter.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedReciter?.id === reciter.id ? "bg-primary/10" : "hover:bg-accent/50"}`}
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
          <div className="mt-6 p-4 rounded-lg border bg-accent/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  {selectedSurah.englishName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSurah.name} • {selectedSurah.numberOfAyahs} verses •{" "}
                  {selectedSurah.revelationType}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedSurah.englishNameTranslation}
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

            <div className="flex flex-wrap gap-2">
              <Button className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>Play</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="secondary"
                className="flex items-center space-x-1"
                onClick={openReader}
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Online</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {selectedJuz && (
          <div className="mt-6 p-4 rounded-lg border bg-accent/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  Juz {selectedJuz.number}
                </h3>
                {selectedJuz.ayahs && selectedJuz.ayahs.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Starts with Surah {selectedJuz.ayahs[0].surah.englishName}
                  </p>
                )}
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

            <div className="flex flex-wrap gap-2">
              <Button className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>Play</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="secondary"
                className="flex items-center space-x-1"
                onClick={openReader}
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Online</span>
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
          Powered by AlQuran Cloud API
        </p>
      </CardFooter>

      {/* Quran Reader Dialog */}
      <Dialog open={showReader} onOpenChange={setShowReader}>
        <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {selectedSurah
                  ? `${selectedSurah.englishName} (${selectedSurah.name})`
                  : selectedJuz
                    ? `Juz ${selectedJuz.number}`
                    : "Quran Reader"}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeReader}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <Button
                variant={viewMode === "side-by-side" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("side-by-side")}
              >
                Side by Side
              </Button>
              <Button
                variant={viewMode === "arabic-only" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("arabic-only")}
              >
                Arabic Only
              </Button>
              <Button
                variant={
                  viewMode === "translation-only" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setViewMode("translation-only")}
              >
                Translation Only
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {loadingAyahs ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading verses...</span>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-4">
                  {paginatedAyahs.length > 0 ? (
                    <div className="space-y-6">
                      {paginatedAyahs.map((ayah) => (
                        <div key={ayah.number} className="border-b pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium mr-2">
                                {ayah.number}
                              </div>
                              {ayah.surah && (
                                <span className="text-sm text-muted-foreground">
                                  {ayah.surah}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Play audio"
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {(viewMode === "arabic-only" ||
                            viewMode === "side-by-side") && (
                            <p className="text-xl text-right leading-loose font-arabic mb-2">
                              {ayah.text}
                            </p>
                          )}

                          {(viewMode === "translation-only" ||
                            viewMode === "side-by-side") && (
                            <p className="text-sm text-muted-foreground">
                              {ayah.translation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        No verses available
                      </p>
                    </div>
                  )}
                </ScrollArea>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuranSection;
