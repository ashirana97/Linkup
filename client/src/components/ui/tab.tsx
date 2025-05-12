import React from "react";

interface TabContentProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  id, 
  active, 
  children 
}) => {
  return (
    <div 
      id={id} 
      className={`${active ? 'block' : 'hidden'} px-4 pt-2 overflow-y-auto max-h-[calc(100vh-5rem)]`}
      style={{ scrollbarWidth: 'thin' }}
    >
      {children}
    </div>
  );
};
