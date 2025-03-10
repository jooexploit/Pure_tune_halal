import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bell, MapPin, RefreshCw, Settings, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PrayerTime {
  name: string;
  time: string;
  notificationEnabled: boolean;
}

interface PrayerTimesProps {
  location?: string;
  autoDetect?: boolean;
  prayerTimes?: PrayerTime[];
}

const PrayerTimes = ({
  location = "",
  autoDetect = true,
  prayerTimes = [],
}: PrayerTimesProps) => {
  const [currentLocation, setCurrentLocation] = useState(location);
  const [isAutoDetect, setIsAutoDetect] = useState(autoDetect);
  const [prayers, setPrayers] = useState<PrayerTime[]>([
    { name: "Fajr", time: "05:23 AM", notificationEnabled: true },
    { name: "Sunrise", time: "06:45 AM", notificationEnabled: false },
    { name: "Dhuhr", time: "12:30 PM", notificationEnabled: true },
    { name: "Asr", time: "03:45 PM", notificationEnabled: true },
    { name: "Maghrib", time: "06:55 PM", notificationEnabled: true },
    { name: "Isha", time: "08:15 PM", notificationEnabled: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [calculationMethod, setCalculationMethod] = useState("2"); // ISNA method by default
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate next prayer
  const getNextPrayer = () => {
    if (!prayers || prayers.length === 0) {
      return "Loading...";
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const [time, period] = prayer.time.split(" ");
      const [hourStr, minuteStr] = time.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      const prayerTime = hour * 60 + minute;

      if (prayerTime > currentTime) {
        return prayer.name;
      }
    }

    return prayers[0].name; // Return first prayer of next day if all prayers passed
  };

  const nextPrayer = prayers.length > 0 ? getNextPrayer() : "Loading...";

  // Fetch prayer times from API
  const fetchPrayerTimes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!latitude || !longitude) {
        throw new Error("Location coordinates are not available");
      }

      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Using the AlAdhan API to get prayer times - daily endpoint
      const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${calculationMethod}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.data && data.data.timings) {
        const timings = data.data.timings;

        const formattedPrayers: PrayerTime[] = [
          {
            name: "Fajr",
            time: formatTime(timings.Fajr),
            notificationEnabled: true,
          },
          {
            name: "Sunrise",
            time: formatTime(timings.Sunrise),
            notificationEnabled: false,
          },
          {
            name: "Dhuhr",
            time: formatTime(timings.Dhuhr),
            notificationEnabled: true,
          },
          {
            name: "Asr",
            time: formatTime(timings.Asr),
            notificationEnabled: true,
          },
          {
            name: "Maghrib",
            time: formatTime(timings.Maghrib),
            notificationEnabled: true,
          },
          {
            name: "Isha",
            time: formatTime(timings.Isha),
            notificationEnabled: true,
          },
        ];

        setPrayers(formattedPrayers);

        toast({
          title: "Prayer times updated",
          description: `Prayer times for ${currentLocation} have been updated.`,
        });
      } else {
        throw new Error("Failed to fetch prayer times");
      }
    } catch (err) {
      console.error("Error fetching prayer times:", err);
      setError("Unable to fetch prayer times. Please try again later.");

      // Set default prayer times as fallback
      const defaultPrayers = [
        { name: "Fajr", time: "05:23 AM", notificationEnabled: true },
        { name: "Sunrise", time: "06:45 AM", notificationEnabled: false },
        { name: "Dhuhr", time: "12:30 PM", notificationEnabled: true },
        { name: "Asr", time: "03:45 PM", notificationEnabled: true },
        { name: "Maghrib", time: "06:55 PM", notificationEnabled: true },
        { name: "Isha", time: "08:15 PM", notificationEnabled: true },
      ];

      setPrayers(defaultPrayers);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Could not fetch prayer times. Using default times instead.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format time from API (remove timezone info)
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    // Remove timezone part (e.g., "15:30 (GMT+1)" -> "15:30")
    const time = timeString.split(" ")[0];

    // Convert 24h to 12h format
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  };

  // Handle location change
  const handleLocationChange = async () => {
    if (locationInput.trim()) {
      setIsLoading(true);
      setError(null);

      try {
        // Use OpenStreetMap Nominatim API to geocode the location
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`,
        );

        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          setLatitude(parseFloat(lat));
          setLongitude(parseFloat(lon));
          setCurrentLocation(display_name);
          setLocationInput("");

          // After setting coordinates, fetch prayer times
          setTimeout(() => fetchPrayerTimes(), 100); // Small delay to ensure state is updated
        } else {
          throw new Error("Location not found");
        }
      } catch (err) {
        console.error("Error geocoding location:", err);
        setError("Could not find the specified location. Please try again.");
        toast({
          variant: "destructive",
          title: "Location Error",
          description:
            "Could not find the specified location. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle notification for a prayer
  const toggleNotification = (index: number) => {
    const updatedPrayers = [...prayers];
    updatedPrayers[index].notificationEnabled =
      !updatedPrayers[index].notificationEnabled;
    setPrayers(updatedPrayers);

    toast({
      title: updatedPrayers[index].notificationEnabled
        ? "Notification enabled"
        : "Notification disabled",
      description: `${updatedPrayers[index].name} prayer notifications ${updatedPrayers[index].notificationEnabled ? "enabled" : "disabled"}.`,
    });
  };

  // Auto-detect location effect
  useEffect(() => {
    if (isAutoDetect) {
      setIsLoading(true);
      setError(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);

            try {
              // Reverse geocode to get location name
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              );

              const data = await response.json();

              if (data && data.display_name) {
                setCurrentLocation(data.display_name);
              } else {
                setCurrentLocation(
                  `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                );
              }

              // Fetch prayer times with the detected coordinates
              fetchPrayerTimes();
            } catch (err) {
              console.error("Error reverse geocoding:", err);
              setCurrentLocation(
                `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
              );
              fetchPrayerTimes();
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError(
              "Could not detect your location. Please enter it manually.",
            );
            setIsLoading(false);
            setIsAutoDetect(false);

            toast({
              variant: "destructive",
              title: "Location Error",
              description:
                "Could not detect your location. Please enter it manually.",
            });
          },
        );
      } else {
        setError(
          "Geolocation is not supported by your browser. Please enter location manually.",
        );
        setIsLoading(false);
        setIsAutoDetect(false);

        toast({
          variant: "destructive",
          title: "Location Error",
          description:
            "Geolocation is not supported by your browser. Please enter location manually.",
        });
      }
    }
  }, [isAutoDetect]);

  // Update prayer times when calculation method changes
  useEffect(() => {
    if (latitude && longitude) {
      fetchPrayerTimes();
    }
  }, [calculationMethod]);

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Prayer Times
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchPrayerTimes()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Location settings */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Current Location</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Auto-detect
                </span>
                <Switch
                  checked={isAutoDetect}
                  onCheckedChange={setIsAutoDetect}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                disabled={isAutoDetect || isLoading}
              />
              <Button
                onClick={handleLocationChange}
                disabled={isAutoDetect || isLoading || !locationInput.trim()}
                size="sm"
              >
                Update
              </Button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{currentLocation}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={calculationMethod}
                onValueChange={setCalculationMethod}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Calculation Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">
                    Islamic Society of North America (ISNA)
                  </SelectItem>
                  <SelectItem value="1">
                    University of Islamic Sciences, Karachi
                  </SelectItem>
                  <SelectItem value="3">Muslim World League</SelectItem>
                  <SelectItem value="4">
                    Umm al-Qura University, Makkah
                  </SelectItem>
                  <SelectItem value="5">
                    Egyptian General Authority of Survey
                  </SelectItem>
                  <SelectItem value="7">
                    Institute of Geophysics, University of Tehran
                  </SelectItem>
                  <SelectItem value="12">
                    Union des Organisations Islamiques de France
                  </SelectItem>
                  <SelectItem value="13">
                    Diyanet İşleri Başkanlığı, Turkey
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Prayer times list */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium">
                Next Prayer:{" "}
                <span className="font-bold text-primary">{nextPrayer}</span>
              </h3>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {prayers.map((prayer, index) => (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between p-2 rounded-md ${nextPrayer === prayer.name ? "bg-primary/10" : "hover:bg-accent"}`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${nextPrayer === prayer.name ? "bg-primary" : "bg-muted"}`}
                    />
                    <span className="font-medium">{prayer.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">{prayer.time}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={
                        prayer.notificationEnabled
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                      onClick={() => toggleNotification(index)}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerTimes;
