import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CalendarIcon, InfoIcon } from "lucide-react";

interface HijriCalendarProps {
  currentDate?: Date;
  importantDates?: ImportantDate[];
}

interface ImportantDate {
  date: Date;
  title: string;
  description: string;
  type: "holiday" | "event" | "religious";
}

const HijriCalendar = ({
  currentDate = new Date(),
  importantDates = [
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      title: "Ramadan Start",
      description: "Beginning of the holy month of Ramadan",
      type: "religious",
    },
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
      title: "Eid al-Fitr",
      description: "Celebration marking the end of Ramadan",
      type: "holiday",
    },
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 10),
      title: "Hajj",
      description: "Annual Islamic pilgrimage to Mecca",
      type: "religious",
    },
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 15),
      title: "Eid al-Adha",
      description: "Festival of Sacrifice",
      type: "holiday",
    },
  ],
}: HijriCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentDate,
  );
  const [selectedEvent, setSelectedEvent] = useState<ImportantDate | null>(
    null,
  );

  // Function to convert Gregorian to Hijri date (simplified version)
  const getHijriDate = (date: Date): string => {
    // This is a placeholder - in a real app, you would use a proper Hijri calendar library
    const months = [
      "Muharram",
      "Safar",
      "Rabi al-Awwal",
      "Rabi al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Shaban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qadah",
      "Dhu al-Hijjah",
    ];

    // Simple offset calculation (not accurate, just for demonstration)
    const day = date.getDate();
    const monthIndex = (date.getMonth() + 10) % 12; // Offset by ~10 months
    const year = date.getFullYear() - 579; // Approximate Hijri year

    return `${day} ${months[monthIndex]}, ${year} AH`;
  };

  // Find if a date has any important events
  const getEventForDate = (date: Date): ImportantDate | undefined => {
    return importantDates.find(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  // Custom day rendering to highlight important dates
  const renderDay = (day: Date) => {
    const event = getEventForDate(day);
    if (!event) return null;

    let badgeVariant: "default" | "secondary" | "destructive" = "default";

    if (event.type === "holiday") badgeVariant = "destructive";
    if (event.type === "event") badgeVariant = "secondary";

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="h-1 w-1 rounded-full bg-primary" />
      </div>
    );
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const event = getEventForDate(date);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Hijri Calendar</CardTitle>
          <Button variant="ghost" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
        <CardDescription>
          {selectedDate
            ? getHijriDate(selectedDate)
            : "Select a date to view Hijri calendar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const event = getEventForDate(date);
              return (
                <div className="relative h-full w-full p-0">
                  <div>{date.getDate()}</div>
                  {event && renderDay(date)}
                </div>
              );
            },
          }}
        />
      </CardContent>
      {selectedEvent && (
        <CardFooter className="flex flex-col items-start border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={
                selectedEvent.type === "holiday"
                  ? "destructive"
                  : selectedEvent.type === "event"
                    ? "secondary"
                    : "default"
              }
            >
              {selectedEvent.type}
            </Badge>
            <h4 className="font-semibold">{selectedEvent.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            {selectedEvent.description}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default HijriCalendar;
