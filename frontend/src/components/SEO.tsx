import { Helmet } from 'react-helmet-async';

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonicalPath?: string;
    ogImage?: string;
    ogType?: string;
}

const BASE_URL = 'https://sau-eco-qstns.vercel.app';
const DEFAULT_OG_IMAGE = '/og-image.png'; // Place this in frontend/public/

/**
 * Reusable SEO component for consistent meta tag management across all routes.
 * Implements Open Graph protocol, Twitter Cards, and canonical URLs.
 * 
 * @param props.title - Page title (appears in browser tab and search results)
 * @param props.description - Meta description for search engines (150-160 chars recommended)
 * @param props.keywords - Comma-separated keywords (optional, less impactful for modern SEO)
 * @param props.canonicalPath - URL path for canonical link (e.g., "/questions")
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
}) => {
    const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
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
        </Helmet>
    );
};

export default SEO;
