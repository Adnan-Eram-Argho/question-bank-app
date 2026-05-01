import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface RelatedPage {
    title: string;
    description: string;
    href: string;
    icon?: string;
}

interface RelatedPagesProps {
    pages: RelatedPage[];
    title?: string;
}

const RelatedPages: React.FC<RelatedPagesProps> = ({ 
    pages, 
    title = "Related Resources" 
}) => {
    // Ensure AI Tutor is always included and visually distinct
    const enhancedPages = pages.map(page => {
        if (page.href.includes('ai-tutor')) {
            return {
                ...page,
                label: "Get instant help",
                isPrimary: true
            };
        }
        return page;
    });

    return (
        <ScrollReveal direction="up">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Section Title */}
                {title && (
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        {title}
                    </h2>
                )}

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {enhancedPages.map((page, index) => {
                        const isPrimary = (page as any).isPrimary;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className={`group block p-6 rounded-xl border transition-all duration-200 ${
                                    isPrimary
                                        ? 'bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-900/20 dark:to-amber-900/20 border-green-200 dark:border-green-800 shadow-md hover:shadow-lg'
                                        : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 hover:shadow-lg'
                                }`}
                            >
                                <Link to={page.href} className="block h-full">
                                    {/* Icon (if provided) */}
                                    {page.icon && (
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                                            isPrimary
                                                ? 'bg-gradient-to-br from-green-500 to-amber-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                        } transition-colors`}>
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d={page.icon}
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className={`text-lg font-semibold mb-2 ${
                                        isPrimary
                                            ? 'text-green-900 dark:text-green-100'
                                            : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                    } transition-colors`}>
                                        {page.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm mb-4 ${
                                        isPrimary
                                            ? 'text-green-800 dark:text-green-200'
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {page.description}
                                    </p>

                                    {/* CTA Link */}
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span className={
                                            isPrimary
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-primary-600 dark:text-primary-400'
                                        }>
                                            {(page as any).label || "Go →"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${
                                                isPrimary
                                                    ? 'text-green-700 dark:text-green-300'
                                                    : 'text-primary-600 dark:text-primary-400'
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </ScrollReveal>
    );
};

export default RelatedPages;
