import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FacultyContextType {
  activeFaculty: string;
  setActiveFaculty: (faculty: string) => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider = ({ children }: { children: ReactNode }) => {
  const [activeFaculty, setActiveFaculty] = useState<string>(() => {
    const saved = localStorage.getItem('activeFaculty');
    return saved || 'Agricultural Economics';
  });

  useEffect(() => {
    localStorage.setItem('activeFaculty', activeFaculty);
  }, [activeFaculty]);

  return (
    <FacultyContext.Provider value={{ activeFaculty, setActiveFaculty }}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error('useFaculty must be used within a FacultyProvider');
  }
  return context;
};
