import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import TabNavigation from "@/components/navigation/tab-navigation";
import DiscoverTab from "@/components/tabs/discover-tab";
import CheckInTab from "@/components/tabs/check-in-tab";
import MessagesTab from "@/components/tabs/messages-tab";
import ProfileTab from "@/components/tabs/profile-tab";
import { Layout } from "@/components/layout/layout";

export default function Home() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("discover");
  
  // Update active tab based on URL
  useEffect(() => {
    if (location === "/") {
      setActiveTab("discover");
    } else if (location === "/checkin") {
      setActiveTab("checkin");
    } else if (location === "/messages") {
      setActiveTab("messages");
    } else if (location === "/profile") {
      setActiveTab("profile");
    }
  }, [location]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <Layout>
      <div className="app-container flex flex-col">
        <div className="content-area flex-grow overflow-y-auto pb-20">
          <DiscoverTab active={activeTab === "discover"} />
          <CheckInTab active={activeTab === "checkin"} />
          <MessagesTab active={activeTab === "messages"} />
          <ProfileTab active={activeTab === "profile"} />
        </div>
        
        <TabNavigation active={activeTab} onChange={handleTabChange} />
      </div>
    </Layout>
  );
}
