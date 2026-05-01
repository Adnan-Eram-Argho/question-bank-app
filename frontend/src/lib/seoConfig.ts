/**
 * Centralized SEO configuration for all routes in SAU Question Bank.
 * Each route gets optimized title, description, and SAU-specific keywords.
 * 
 * Usage: Import config object and pass to <SEO /> component
 * Example: <SEO {...seoConfig.homepage} />
 */

export interface SEOConfig {
    title: string;
    description: string;
    keywords: string;
    canonicalPath: string;
    ogImage?: string;
}

export const seoConfig: Record<string, SEOConfig> = {
    // Homepage - Main landing page
    homepage: {
        title: 'SAU Question Bank 2026 | Questions, Notes & AI Tutor',
        description: 'Access SAU previous year questions, study notes and AI tutor for all subjects at Sher-e-Bangla Agricultural University. Browse 160+ courses across Agricultural Economics, Agriculture, and ASVM faculties.',
        keywords: 'SAU question bank, Sher-e-Bangla Agricultural University, SAU previous year questions, SAU AEC, SAU Agriculture, SAU ASVM, SAU exam papers, SAU study materials, SAU AI tutor, agricultural university Bangladesh',
        canonicalPath: '/',
    },

    // Questions page - Filterable question repository
    questions: {
        title: 'SAU Previous Year Questions | Browse by Faculty & Course',
        description: 'Browse and filter SAU previous year exam questions by faculty, level, semester, and course. Access question papers for Agricultural Economics, Agriculture, and ASVM with instant AI tutor support.',
        keywords: 'SAU question papers, SAU previous year questions, SAU exam questions, SAU AEC questions, SAU Agriculture questions, SAU ASVM questions, SAU theory questions, SAU practical questions, Sher-e-Bangla Agricultural University question bank',
        canonicalPath: '/questions',
    },

    // Study Materials - Books, notes, PDFs
    studyMaterials: {
        title: 'SAU Study Materials | Books, Notes & PDFs for All Courses',
        description: 'Download SAU study materials including textbooks, lecture notes, and PDFs. Organized by faculty, level, semester, and course for Agricultural Economics, Agriculture, and ASVM students.',
        keywords: 'SAU study materials, SAU books, SAU notes, SAU PDF downloads, SAU textbooks, SAU lecture notes, SAU AEC study materials, SAU Agriculture study materials, SAU ASVM study materials, Sher-e-Bangla Agricultural University resources',
        canonicalPath: '/study-materials',
    },

    // AI Tutor - Context-aware chat assistant
    aiTutor: {
        title: 'SAU AI Tutor | Instant Academic Help for All Courses',
        description: 'Get instant help from SAU AI Tutor powered by Llama 4. Ask questions about Agricultural Economics, Agriculture, or ASVM courses. Upload images for analysis and get faculty-specific answers.',
        keywords: 'SAU AI tutor, SAU chatbot, SAU academic help, SAU question solver, SAU exam preparation, SAU AEC AI tutor, SAU Agriculture AI tutor, SAU ASVM AI tutor, AI study assistant Sher-e-Bangla Agricultural University',
        canonicalPath: '/ai-tutor',
    },

    // SAU Question Bank PDF - Comprehensive download guide
    sauQuestionBankPdf: {
        title: 'SAU Question Bank PDF Download | Complete Collection 2026',
        description: 'Download complete SAU question bank PDF collection for 2026. Includes previous year questions for Agricultural Economics, Agriculture, and ASVM faculties. Free PDF download for SAU students.',
        keywords: 'SAU question bank PDF, SAU question paper PDF download, SAU previous year questions PDF, SAU AEC PDF, SAU Agriculture PDF, SAU ASVM PDF, Sher-e-Bangla Agricultural University PDF download, SAU exam papers PDF',
        canonicalPath: '/sau-question-bank-pdf',
    },

    // SAU Economics Questions - Agricultural Economics faculty
    sauEconomicsQuestion: {
        title: 'SAU Agricultural Economics Questions | AEC Question Bank 2026',
        description: 'Browse SAU Agricultural Economics (AEC) faculty questions. Access Level-1 to Level-4 exam papers covering Micro/Macro Economics, Econometrics, Agricultural Finance, and Agribusiness Management.',
        keywords: 'SAU AEC questions, SAU Agricultural Economics questions, SAU economics question bank, SAU AEC exam papers, SAU econometrics questions, SAU agribusiness questions, Sher-e-Bangla Agricultural University AEC, SAU economics previous year questions',
        canonicalPath: '/sau-economics-question',
    },

    // SAU Agriculture Questions - Agriculture faculty
    sauAgricultureQuestion: {
        title: 'SAU Agriculture Questions | Agronomy & Crop Science Question Bank',
        description: 'Access SAU Agriculture faculty questions covering agronomy, entomology, soil science, plant pathology, and crop production. Level-1 to Level-4 exam papers for agriculture students.',
        keywords: 'SAU Agriculture questions, SAU agronomy questions, SAU crop science questions, SAU agriculture exam papers, SAU plant pathology questions, SAU soil science questions, Sher-e-Bangla Agricultural University agriculture, SAU agriculture previous year questions',
        canonicalPath: '/sau-agriculture-question',
    },

    // SAU ASVM Questions - Animal Science & Veterinary Medicine
    sauAsvmQuestion: {
        title: 'SAU ASVM Questions | Animal Science & Veterinary Medicine Question Bank',
        description: 'Browse SAU ASVM (Animal Science & Veterinary Medicine) questions. Access Level-1 to Level-5 exam papers covering anatomy, physiology, pathology, surgery, and preventive veterinary medicine.',
        keywords: 'SAU ASVM questions, SAU veterinary medicine questions, SAU animal science questions, SAU ASVM exam papers, SAV theriogenology questions, SAU preventive veterinary medicine, Sher-e-Bangla Agricultural University ASVM, SAU veterinary previous year questions',
        canonicalPath: '/sau-asvm-question',
    },

    // SAU Notes - Lecture notes and study guides
    sauNotes: {
        title: 'SAU Lecture Notes & Study Guides | Download Free Notes',
        description: 'Download free SAU lecture notes and study guides for all faculties. Organized by course, level, and semester. Includes Agricultural Economics, Agriculture, and ASVM study materials.',
        keywords: 'SAU lecture notes, SAU study guides, SAU notes download, SAU class notes, SAU AEC notes, SAU Agriculture notes, SAU ASVM notes, Sher-e-Bangla Agricultural University notes, SAU handwritten notes',
        canonicalPath: '/sau-notes',
    },

    // SAU Admission Preparation - Entrance exam prep
    sauAdmissionPreparation: {
        title: 'SAU Admission Preparation 2026 | Entrance Exam Guide & Resources',
        description: 'Complete SAU admission preparation guide for 2026. Access previous year admission test questions, study materials, and preparation tips for Agricultural Economics, Agriculture, and ASVM programs.',
        keywords: 'SAU admission preparation, SAU entrance exam, SAU admission test questions, SAU admission guide 2026, SAU AEC admission, SAU Agriculture admission, SAU ASVM admission, Sher-e-Bangla Agricultural University admission, SAU admission syllabus',
        canonicalPath: '/sau-admission-preparation',
    },
};

// Helper function to get SEO config by route path
export const getSEOByPath = (path: string): SEOConfig => {
    const pathMap: Record<string, keyof typeof seoConfig> = {
        '/': 'homepage',
        '/questions': 'questions',
        '/study-materials': 'studyMaterials',
        '/ai-tutor': 'aiTutor',
        '/sau-question-bank-pdf': 'sauQuestionBankPdf',
        '/sau-economics-question': 'sauEconomicsQuestion',
        '/sau-agriculture-question': 'sauAgricultureQuestion',
        '/sau-asvm-question': 'sauAsvmQuestion',
        '/sau-notes': 'sauNotes',
        '/sau-admission-preparation': 'sauAdmissionPreparation',
    };

    const configKey = pathMap[path];
    return configKey ? seoConfig[configKey] : seoConfig.homepage;
};
