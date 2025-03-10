import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import MusicPlayerDashboard from "./dashboard/MusicPlayerDashboard";
import SocialMediaProcessor from "./social/SocialMediaProcessor";
import IslamicFeatures from "./islamic/IslamicFeatures";
import AudioPlayer from "./player/AudioPlayer";

interface HomeProps {
  defaultTab?: string;
}

const Home: React.FC<HomeProps> = ({ defaultTab = "music" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  // Update active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/music") setActiveTab("music");
    else if (path === "/social") setActiveTab("social");
    else if (path === "/islamic") setActiveTab("islamic");
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          onSearch={handleSearch}
          onToggleDarkMode={handleToggleDarkMode}
          isDarkMode={isDarkMode}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="h-full flex flex-col"
          >
            <div className="px-4 pt-2 md:hidden">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="islamic">Islamic</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent
                value="music"
                className="h-full m-0 p-0 data-[state=active]:flex-1"
              >
                <MusicPlayerDashboard />
              </TabsContent>

              <TabsContent
                value="social"
                className="h-full m-0 p-0 data-[state=active]:flex-1"
              >
                <SocialMediaProcessor />
              </TabsContent>

              <TabsContent
                value="islamic"
                className="h-full m-0 p-0 data-[state=active]:flex-1"
              >
                <IslamicFeatures />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Audio Player */}
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Home;
