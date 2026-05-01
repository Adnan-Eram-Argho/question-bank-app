import { createContext, useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { courseData } from '../data';

// 🛡️ Whitelist of valid faculties to prevent injection attacks
const VALID_FACULTIES = Object.keys(courseData);

// Map short faculty codes to full names for URL convenience
const FACULTY_CODE_MAP: Record<string, string> = {
  'AEC': 'Agricultural Economics',
  'agri': 'Agriculture',
  'asvm': 'ASVM'
};

interface FacultyContextType {
  activeFaculty: string;
  setActiveFaculty: (faculty: string) => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  
  // Initialize faculty from localStorage or default (URL will be handled by useEffect)
  const [activeFaculty, setActiveFaculty] = useState<string>(() => {
    // Priority 1: localStorage
    const saved = localStorage.getItem('activeFaculty');
    if (saved && saved !== 'null' && saved !== 'undefined' && saved.trim() !== '') {
      const trimmed = saved.trim();
      if (VALID_FACULTIES.includes(trimmed)) {
        return trimmed;
      }
      console.warn(`[FacultyContext] Invalid faculty in localStorage: "${trimmed}". Defaulting to Agricultural Economics.`);
    }
    
    // Priority 2: Default
    return 'Agricultural Economics';
  });

  // Sync faculty from URL parameters (runs on mount AND when URL changes)
  useEffect(() => {
    const urlFaculty = searchParams.get('faculty');
    if (urlFaculty) {
      const trimmed = urlFaculty.trim();
      // Check if it's a short code first
      const mappedFaculty = FACULTY_CODE_MAP[trimmed];
      const newFaculty = mappedFaculty && VALID_FACULTIES.includes(mappedFaculty) 
        ? mappedFaculty 
        : VALID_FACULTIES.includes(trimmed) 
          ? trimmed 
          : null;
      
      // Only update if different from current faculty to prevent unnecessary re-renders
      if (newFaculty && newFaculty !== activeFaculty) {
        setActiveFaculty(newFaculty);
      } else if (!newFaculty) {
        console.warn(`[FacultyContext] Invalid faculty in URL: "${trimmed}". Keeping current faculty.`);
      }
    }
  }, [searchParams, activeFaculty]); // Re-run when URL params change

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
      // Support both short codes and full names
      const mappedFaculty = FACULTY_CODE_MAP[trimmed] || trimmed;
      if (VALID_FACULTIES.includes(mappedFaculty)) {
        // Only update if different from current faculty to prevent unnecessary re-renders
        if (mappedFaculty !== activeFaculty) {
          setActiveFaculty(mappedFaculty);
        }
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
