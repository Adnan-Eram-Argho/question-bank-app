import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    // Generate JSON-LD BreadcrumbList schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `https://sau-eco-qstns.vercel.app${item.href}` })
        }))
    };

    if (items.length === 0) return null;

    return (
        <>
            {/* Inject structured data for SEO */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={index} className="flex items-center">
                                {/* Separator (except for first item) */}
                                {index > 0 && (
                                    <svg
                                        className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-600"
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
                                )}

                                {/* Breadcrumb Item */}
                                {isLast ? (
                                    <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        to={item.href || '/'}
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumb;
