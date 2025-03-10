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
import { Bell, MapPin, RefreshCw, Settings } from "lucide-react";

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
  location = "New York, USA",
  autoDetect = true,
  prayerTimes = [
    { name: "Fajr", time: "05:23 AM", notificationEnabled: true },
    { name: "Sunrise", time: "06:45 AM", notificationEnabled: false },
    { name: "Dhuhr", time: "12:30 PM", notificationEnabled: true },
    { name: "Asr", time: "03:45 PM", notificationEnabled: true },
    { name: "Maghrib", time: "06:55 PM", notificationEnabled: true },
    { name: "Isha", time: "08:15 PM", notificationEnabled: true },
  ],
}: PrayerTimesProps) => {
  const [currentLocation, setCurrentLocation] = useState(location);
  const [isAutoDetect, setIsAutoDetect] = useState(autoDetect);
  const [prayers, setPrayers] = useState<PrayerTime[]>(prayerTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const { toast } = useToast();

  // Calculate next prayer
  const getNextPrayer = () => {
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

  const nextPrayer = getNextPrayer();

  // Simulate fetching prayer times
  const fetchPrayerTimes = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Prayer times updated",
        description: `Prayer times for ${currentLocation} have been updated.`,
      });
    }, 1500);
  };

  // Handle location change
  const handleLocationChange = () => {
    if (locationInput.trim()) {
      setCurrentLocation(locationInput);
      setLocationInput("");
      fetchPrayerTimes();
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
      // Simulate geolocation detection
      setIsLoading(true);
      setTimeout(() => {
        setCurrentLocation("Detected: New York, USA");
        setIsLoading(false);
        fetchPrayerTimes();
      }, 1000);
    }
  }, [isAutoDetect]);

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
              <Select defaultValue="standard">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Calculation Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (ISNA)</SelectItem>
                  <SelectItem value="hanafi">Hanafi</SelectItem>
                  <SelectItem value="shafi">Shafi</SelectItem>
                  <SelectItem value="maliki">Maliki</SelectItem>
                  <SelectItem value="hanbali">Hanbali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prayer times list */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium">
                Next Prayer:{" "}
                <span className="font-bold text-primary">{nextPrayer}</span>
              </h3>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
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
