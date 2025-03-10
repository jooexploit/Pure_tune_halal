import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Book, Calendar, Clock, BookOpen } from "lucide-react";
import AzkarSection from "./AzkarSection";
import PrayerTimes from "./PrayerTimes";
import HijriCalendar from "./HijriCalendar";
import QuranSection from "./QuranSection";

interface IslamicFeaturesProps {
  defaultTab?: string;
}

const IslamicFeatures: React.FC<IslamicFeaturesProps> = ({
  defaultTab = "azkar",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    {
      id: "azkar",
      label: "Azkar",
      icon: <Book className="h-4 w-4 mr-2" />,
      description: "Daily Islamic remembrances and supplications",
    },
    {
      id: "quran",
      label: "Quran",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      description: "Listen to beautiful Quran recitations",
    },
    {
      id: "prayer-times",
      label: "Prayer Times",
      icon: <Clock className="h-4 w-4 mr-2" />,
      description: "Check accurate prayer times for your location",
    },
    {
      id: "hijri-calendar",
      label: "Hijri Calendar",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      description: "View the Islamic Hijri calendar and important dates",
    },
  ];

  return (
    <div className="w-full h-full bg-background p-4 md:p-6">
      <Card className="w-full h-full border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Islamic Features</CardTitle>
          <CardDescription>
            Spiritual tools to enhance your Islamic practice
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center justify-center py-2"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-2">
              {activeTab && (
                <p className="text-sm text-muted-foreground mb-4">
                  {tabs.find((tab) => tab.id === activeTab)?.description}
                </p>
              )}
            </div>

            <div className="h-[calc(100%-120px)] overflow-hidden">
              <TabsContent value="azkar" className="h-full mt-0">
                <AzkarSection />
              </TabsContent>

              <TabsContent value="quran" className="h-full mt-0">
                <QuranSection />
              </TabsContent>

              <TabsContent value="prayer-times" className="h-full mt-0">
                <PrayerTimes />
              </TabsContent>

              <TabsContent value="hijri-calendar" className="h-full mt-0">
                <div className="flex justify-center">
                  <HijriCalendar />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IslamicFeatures;
