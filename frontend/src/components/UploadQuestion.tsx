import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseData } from '../data'; // Import the data from Step 1

const UploadQuestion = () => {
    const { user } = useAuth();

    // Form State
    const [files, setFiles] = useState<File[]>([]);
    const [level, setLevel] = useState('');
    const [semester, setSemester] = useState('');
    const [courseName, setCourseName] = useState('');
    const [questionType, setQuestionType] = useState('Theory');

    // Dynamic Options State
    const [semesters, setSemesters] = useState<string[]>([]);
    const [courses, setCourses] = useState<string[]>([]);

    // Feedback State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef(0);

    // 1. Update Semesters when Level changes
    useEffect(() => {
        if (level && courseData[level as keyof typeof courseData]) {
            const semesterKeys = Object.keys(courseData[level as keyof typeof courseData]);
            setSemesters(semesterKeys);
            setSemester(''); // Reset dependent dropdowns
            setCourseName('');
            setCourses([]);
        } else {
            setSemesters([]);
            setCourses([]);
        }
    }, [level]);

    // 2. Update Courses when Semester changes
    useEffect(() => {
        if (level && semester && courseData[level as keyof typeof courseData]) {
            const semesterData = courseData[level as keyof typeof courseData];
            if (semesterData[semester as keyof typeof semesterData]) {
                setCourses(semesterData[semester as keyof typeof semesterData]);
                setCourseName(''); // Reset course
            }
        } else {
            setCourses([]);
        }
    }, [level, semester]);

    // Shared validation and file setter
    const processFiles = useCallback((incoming: File[]) => {
        const imageFiles = incoming.filter(f => ['image/jpeg', 'image/png'].includes(f.type));
        const invalid = incoming.filter(f => !['image/jpeg', 'image/png'].includes(f.type));

        if (invalid.length > 0) {
            setMessage('Only JPG and PNG files are allowed.');
            return;
        }

        setFiles(prev => {
            const merged = [...prev, ...imageFiles];
            if (merged.length > 2) {
                setMessage('You can upload a maximum of 2 images at once.');
                return prev;
            }
            setMessage('');
            return merged;
        });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    // --- Drag & Drop handlers ---
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current -= 1;
        if (dragCounterRef.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounterRef.current = 0;
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            processFiles(droppedFiles);
        }
    };

    // --- Ctrl+V Paste handler ---
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            const pastedFiles: File[] = [];
            for (const item of Array.from(items)) {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) pastedFiles.push(file);
                }
            }
            if (pastedFiles.length > 0) {
                processFiles(pastedFiles);
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [processFiles]);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0 || !level || !semester || !courseName || !questionType) {
            setMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setMessage('');

        // Prepare FormData for Multer
        const formData = new FormData();
        files.forEach(f => formData.append('images', f));
        formData.append('level', level);
        formData.append('semester', semester);
        formData.append('course_name', courseName);
        formData.append('question_type', questionType);
        formData.append('uploaded_by', user?.email || 'Unknown');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setMessage('Question uploaded successfully!');
            // Reset form
            setFiles([]);
            setLevel('');
            setSemester('');
            setCourseName('');
            setQuestionType('Theory');

            // Reset file input manually
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 animate-fade-in">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-10 transition-all">
                
                <div className="mb-8 text-center sm:text-left border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-2">
                        Upload Question
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Contribute to the repository by uploading past questions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* File Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                            Question Image (JPG/PNG)
                        </label>
                        {/* Drop Zone */}
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-xl transition-all duration-200 ${
                                isDragging
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-400/30'
                                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'
                            }`}
                        >
                            <div className="space-y-2 text-center flex flex-col items-center w-full">
                                {isDragging ? (
                                    <svg className="mx-auto h-12 w-12 text-primary-500 mb-2 animate-bounce" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}

                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-primary-500 dark:focus-within:ring-offset-gray-900">
                                        <span>Click to browse</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">, drag & drop, or <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono">Ctrl+V</kbd> to paste</p>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {isDragging ? 'Release to drop your images here' : 'PNG, JPG up to 5MB — max 2 files'}
                                </p>

                                {/* Thumbnail Previews */}
                                {files.length > 0 && (
                                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 w-full justify-center">
                                        {files.map((file, index) => {
                                            const url = URL.createObjectURL(file);
                                            return (
                                                <div key={index} className="relative group/thumb flex-shrink-0">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-20 w-20 object-cover rounded-lg border-2 border-primary-400 dark:border-primary-600 shadow-md"
                                                        onLoad={() => URL.revokeObjectURL(url)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 z-10"
                                                        title="Remove image"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] text-white bg-black/50 rounded-b-lg py-0.5 px-1 truncate">
                                                        Page {index + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {files.length < 2 && (
                                            <label htmlFor="file-upload" className="h-20 w-20 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-primary-400 hover:text-primary-500 cursor-pointer transition-colors flex-shrink-0" title="Add another image">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Level Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Level</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="" disabled>Select Level...</option>
                                {Object.keys(courseData).map((lvl) => (
                                    <option key={lvl} value={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Semester</label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!level}
                                required
                            >
                                <option value="" disabled>Select Semester...</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Course Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Course</label>
                        <select
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!semester}
                            required
                        >
                            <option value="" disabled>Select Course...</option>
                            {courses.map((course) => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    {/* Question Type Radio */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ml-1">Question Type</label>
                        <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                            <label className="flex items-center p-3 sm:p-0 bg-white sm:bg-transparent dark:bg-gray-900 sm:dark:bg-transparent border sm:border-transparent border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 sm:hover:bg-transparent transition-colors">
                                <input
                                    type="radio"
                                    value="Theory"
                                    checked={questionType === 'Theory'}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Theory Question</span>
                            </label>
                            <label className="flex items-center p-3 sm:p-0 bg-white sm:bg-transparent dark:bg-gray-900 sm:dark:bg-transparent border sm:border-transparent border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 sm:hover:bg-transparent transition-colors">
                                <input
                                    type="radio"
                                    value="Practical"
                                    checked={questionType === 'Practical'}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Practical Assessment</span>
                            </label>
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${
                            message.includes('success') 
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50' 
                                : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50'
                        }`}>
                            {message.includes('success') ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            <p className={`text-sm font-medium ${
                                message.includes('success') 
                                    ? 'text-emerald-700 dark:text-emerald-400' 
                                    : 'text-amber-700 dark:text-amber-400'
                            }`}>
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium shadow-md shadow-primary-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Question'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default UploadQuestion;