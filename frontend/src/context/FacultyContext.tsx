import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { courseData } from '../data';

// 🛡️ Whitelist of valid faculties to prevent injection attacks
const VALID_FACULTIES = Object.keys(courseData);

interface FacultyContextType {
  activeFaculty: string;
  setActiveFaculty: (faculty: string) => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider = ({ children }: { children: ReactNode }) => {
  const [activeFaculty, setActiveFaculty] = useState<string>(() => {
    const saved = localStorage.getItem('activeFaculty');
    // Validate saved faculty against whitelist, fallback to default if invalid
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      const trimmed = saved.trim();
      if (VALID_FACULTIES.includes(trimmed)) {
        return trimmed;
      }
      console.warn(`[FacultyContext] Invalid faculty in localStorage: "${trimmed}". Defaulting to Agricultural Economics.`);
    }
    return 'Agricultural Economics';
  });

  useEffect(() => {
    // Only save to localStorage if it's a validated faculty
    if (VALID_FACULTIES.includes(activeFaculty)) {
      localStorage.setItem('activeFaculty', activeFaculty);
    }
  }, [activeFaculty]);

  // 🛡️ Sanitize and validate incoming faculty strings against whitelist
  const handleSetFaculty = (faculty: string) => {
    if (typeof faculty === 'string') {
      const trimmed = faculty.trim();
      if (VALID_FACULTIES.includes(trimmed)) {
        setActiveFaculty(trimmed);
      } else {
        console.error(`[FacultyContext] Invalid faculty attempted: "${trimmed}". Must be one of: ${VALID_FACULTIES.join(', ')}`);
      }
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
