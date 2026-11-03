import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { ArrowRightIcon, DocumentTextIcon } from './icons';

interface RelatedPage {
    title: string;
    description: string;
    href: string;
    icon?: string;
    label?: string;
    isPrimary?: boolean;
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
                    <h2 className="text-2xl lg:text-3xl font-semibold text-text-primary mb-8 text-center">
                        {title}
                    </h2>
                )}

                {/* Cards Grid */}
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
                    {enhancedPages.map((page, index) => {
                        const isPrimary = page.isPrimary === true;

                        return (
                            <div
                                key={index}
                                className={`group block p-6 rounded-lg border transition-colors duration-150 ${
                                    isPrimary
                                        ? 'bg-surface-canvas border-brand-primary/50 hover:border-brand-primary'
                                        : 'bg-surface-card border-border-subtle hover:border-brand-primary/50'
                                }`}
                            >
                                <Link to={page.href} className="block h-full">
                                    {/* Icon (if provided) */}
                                    {page.icon && (
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-md mb-4 bg-surface-card border border-border-subtle text-brand-primary">
                                            <DocumentTextIcon className="w-6 h-6" />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className={`text-lg font-semibold mb-2 ${
                                        isPrimary
                                            ? 'text-green-900 dark:text-green-100'
                                            : 'text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                    } transition-colors`}>
                                        {page.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm mb-4 ${
                                        isPrimary
                                            ? 'text-green-800 dark:text-green-200'
                                            : 'text-text-muted'
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
                                            {page.label || 'Go'}
                                        </span>
                                        <ArrowRightIcon className="h-4 w-4 text-brand-primary" />
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ScrollReveal>
    );
};

export default RelatedPages;
