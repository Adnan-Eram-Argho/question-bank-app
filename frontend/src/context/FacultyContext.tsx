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
    // Fallback to Agri-Econ if the saved value is invalid, "null", or missing
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      return saved.trim();
    }
    return 'Agricultural Economics';
  });

  useEffect(() => {
    // Only save to localStorage if it's a real faculty to prevent poisoning
    if (activeFaculty && activeFaculty !== 'undefined') {
      localStorage.setItem('activeFaculty', activeFaculty);
    }
  }, [activeFaculty]);

  // Sanitize incoming faculty strings to prevent crashes in data.ts lookups
  const handleSetFaculty = (faculty: string) => {
    if (typeof faculty === 'string' && faculty.trim() !== '' && faculty !== 'undefined') {
      setActiveFaculty(faculty.trim());
    }
  };

  return (
    <FacultyContext.Provider value={{ activeFaculty, setActiveFaculty: handleSetFaculty }}>
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
