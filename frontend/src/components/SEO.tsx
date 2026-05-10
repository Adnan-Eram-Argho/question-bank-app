import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonicalPath?: string; // Optional override for custom canonical URLs
    ogImage?: string;
    ogType?: string;
    schema?: string | object; // Optional JSON-LD schema
}

const BASE_URL = 'https://sau-eco-qstns.vercel.app';
const DEFAULT_OG_IMAGE = '/og-image.png'; // Place this in frontend/public/

/**
 * Reusable SEO component for consistent meta tag management across all routes.
 * Implements Open Graph protocol, Twitter Cards, and dynamic canonical URLs.
 * 
 * Automatically generates canonical URLs from the current route using useLocation,
 * but allows manual override via canonicalPath prop when needed.
 * 
 * @param props.title - Page title (appears in browser tab and search results)
 * @param props.description - Meta description for search engines (150-160 chars recommended)
 * @param props.keywords - Comma-separated keywords (optional, less impactful for modern SEO)
 * @param props.canonicalPath - Optional manual override for canonical URL path (e.g., "/questions")
 * @param props.ogImage - Open Graph image URL (absolute or relative to BASE_URL)
 * @param props.ogType - Open Graph type (default: "website", use "article" for blog posts)
 */
const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    canonicalPath,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    schema,
}) => {
    const location = useLocation();
    
    // Use provided canonicalPath or generate from current location
    // Handles trailing slash: "/" becomes "" to avoid double slashes
    const pathToUse = canonicalPath || (location.pathname === '/' ? '' : location.pathname);
    const canonicalUrl = `${BASE_URL}${pathToUse}`;
    
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:site_name" content="SAU Question Bank" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullOgImage} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {typeof schema === 'string' ? schema : JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
