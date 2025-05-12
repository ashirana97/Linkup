import { useState } from "react";
import { useInterests } from "@/hooks/use-locations";
import { Interest } from "@shared/schema";

interface InterestsFilterProps {
  selectedInterest: string | null;
  onSelectInterest: (interest: string | null) => void;
}

const InterestsFilter = ({
  selectedInterest,
  onSelectInterest
}: InterestsFilterProps) => {
  const { data: interests, isLoading } = useInterests();
  
  if (isLoading) {
    return (
      <div className="flex overflow-x-auto pb-2 mb-4 hide-scrollbar">
        <div className="flex-shrink-0 bg-gray-200 animate-pulse h-10 w-20 rounded-full mr-2"></div>
        <div className="flex-shrink-0 bg-gray-200 animate-pulse h-10 w-28 rounded-full mr-2"></div>
        <div className="flex-shrink-0 bg-gray-200 animate-pulse h-10 w-24 rounded-full mr-2"></div>
      </div>
    );
  }
  
  return (
    <div className="flex overflow-x-auto pb-2 mb-4 hide-scrollbar">
      <button 
        className={`flex-shrink-0 ${selectedInterest === null ? 'bg-primary text-white' : 'bg-white text-gray-700'} rounded-full px-4 py-2 mr-2 text-sm font-medium`}
        onClick={() => onSelectInterest(null)}
      >
        All
      </button>
      
      {interests && interests.map(interest => (
        <button 
          key={interest.id}
          className={`flex-shrink-0 ${selectedInterest === interest.name ? 'bg-primary text-white' : 'bg-white text-gray-700'} rounded-full px-4 py-2 mr-2 text-sm font-medium`}
          onClick={() => onSelectInterest(interest.name)}
        >
          {interest.name}
        </button>
      ))}
    </div>
  );
};

export default InterestsFilter;
