import React, { createContext, useContext, useState, useCallback } from 'react';

interface ScannerContextType {
  pages: string[];
  addPage: (uri: string) => void;
  removePage: (index: number) => void;
  clearPages: () => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const ScannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addPage = useCallback((uri: string) => {
    setPages((prev) => [...prev, uri]);
  }, []);

  const removePage = useCallback((index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearPages = useCallback(() => {
    setPages([]);
  }, []);

  return (
    <ScannerContext.Provider
      value={{
        pages,
        addPage,
        removePage,
        clearPages,
        isUploading,
        setIsUploading,
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
};

export const useScanner = () => {
  const context = useContext(ScannerContext);
  if (context === undefined) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
};
