import React, { createContext, useContext, useState } from "react";

interface DemoContextType {
  isDemo: boolean;
  setIsDemo: (v: boolean) => void;
}

const DemoContext = createContext<DemoContextType>({ isDemo: false, setIsDemo: () => {} });

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemo, setIsDemo] = useState(
    () => sessionStorage.getItem("demo-mode") === "true"
  );

  const set = (v: boolean) => {
    setIsDemo(v);
    sessionStorage.setItem("demo-mode", String(v));
  };

  return <DemoContext.Provider value={{ isDemo, setIsDemo: set }}>{children}</DemoContext.Provider>;
};

export const useDemo = () => useContext(DemoContext);