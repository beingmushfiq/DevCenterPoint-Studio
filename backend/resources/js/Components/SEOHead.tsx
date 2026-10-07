import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useCms, CmsContextValue } from '../Context/CmsContext';

export interface SectionSEOMetadata {
  title: string;
  description: string;
  sectionName: string;
  hash: string;
}

export const SECTION_METADATA: Record<string, SectionSEOMetadata> = {
  hero: {
    title: 'Custom Software Development Company in Bangladesh — DevCenterPoint',
    description: 'DevCenterPoint is a custom software development studio in Dhaka, Bangladesh. We build SaaS platforms, web applications, ERP systems and AI-powered software for startups and enterprises worldwide.',
    sectionName: 'Home',
    hash: '',
  },
  positioning: {
    title: 'Product Engineering Philosophy — DevCenterPoint Systems',
    description: 'We build systems, not just screens. Explore our engineering doctrine: product strategy, high-density UI/UX, resilient full-stack backends, and explainable AI.',
    sectionName: 'Positioning',
    hash: '#positioning',
  },
  capabilities: {
    title: 'Engineering Capabilities & Technical Architecture — DevCenterPoint',
    description: 'Full-stack SaaS, AI/ML intelligent agents, real-time IoT architecture, and high-throughput data pipelines engineered with zero-downtime reliability.',
    sectionName: 'Capabilities',
    hash: '#capabilities',
  },
  work: {
    title: 'Engineered Products & Selected Work Archives — DevCenterPoint',
    description: 'Explore verified software case studies delivered by DevCenterPoint, including SaaS platforms, healthcare systems, retail commerce, and automated analytics.',
    sectionName: 'Selected Work',
    hash: '#work',
  },
  testimonials: {
    title: 'Verified Client Proof & Testimonials — DevCenterPoint',
    description: 'Read verified endorsements and measurable outcomes from the CTOs and product leaders whose platforms DevCenterPoint has engineered.',
    sectionName: 'Proof',
    hash: '#testimonials',
  },
  architecture: {
    title: '5-Layer System Architecture & Engineering Philosophy — DevCenterPoint',
    description: 'Deep dive into our 5-layer engineering model: UX/UI delivery, API gateway, domain core services, streaming data persistence, and cloud infrastructure.',
    sectionName: 'Architecture',
    hash: '#architecture',
  },
  tech: {
    title: 'Technology Stack & Engineering Ecosystem — DevCenterPoint',
    description: 'TypeScript, React 19, Python, Node.js, Go, PostgreSQL, Redis, Docker, and AWS: our precision toolkit for resilient, scalable digital systems.',
    sectionName: 'Tech Stack',
    hash: '#tech',
  },
  process: {
    title: 'Product Lifecycle & 5-Stage Engineering Process — DevCenterPoint',
    description: 'From requirements interrogation and architecture blueprinting to sprint cycles, load testing, and zero-downtime deployment pipelines.',
    sectionName: 'Process',
    hash: '#process',
  },
  metrics: {
    title: 'Production Efficiency & Lifecycle Verification Metrics — DevCenterPoint',
    description: 'Quantifiable operational impact: 99.98% uptime, sub-50ms API latency, 65% faster feature velocity, and battle-tested code quality metrics.',
    sectionName: 'Metrics',
    hash: '#metrics',
  },
  about: {
    title: 'About DevCenterPoint — Engineering Principles & Ethos',
    description: 'Founded on craftsmanship and software discipline. Learn how DevCenterPoint partners with ambitious teams to build enduring, high-impact systems.',
    sectionName: 'About',
    hash: '#about',
  },
  contact: {
    title: 'Start a Project — DevCenterPoint Scope Estimator & Inquiry',
    description: 'Build your project scope, calculate timelines, and connect with DevCenterPoint engineers to architect your next digital product or enterprise system.',
    sectionName: 'Contact',
    hash: '#contact',
  },
  faq: {
    title: 'Engagements, SLAs & Terms — DevCenterPoint FAQ',
    description: 'Answers on engagement models, delivery guarantees, service-level agreements, and how DevCenterPoint scopes and runs engineering partnerships.',
    sectionName: 'FAQ',
    hash: '#faq',
  },
  newsletter: {
    title: 'Engineering Dispatch Newsletter — DevCenterPoint',
    description: 'Join the DevCenterPoint dispatch for systems architecture notes, applied AI patterns, and lessons from production software delivery.',
    sectionName: 'Newsletter',
    hash: '#newsletter',
  },
};

/**
 * Canonical order of on-page segments. Navigation targets, the scroll spy, and
 * section SEO metadata all derive from this list so they cannot drift apart.
 */
export const SECTION_ORDER: Array<keyof typeof SECTION_METADATA> = [
  'hero',
  'positioning',
  'capabilities',
  'work',
  'testimonials',
  'architecture',
  'tech',
  'process',
  'metrics',
  'about',
  'faq',
  'contact',
  'newsletter',
];

interface SEOOverride {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

interface SEOContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setCustomSEO: (override: SEOOverride | null) => void;
  currentMeta: SectionSEOMetadata;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{
  children: React.ReactNode;
  /**
   * Page-level metadata for standalone routes (services, work, blog). These
   * pages have no `#hero` anchor for the scroll spy to lock onto, so the
   * override has to beat the section defaults outright.
   */
  override?: SEOOverride | null;
  /** `website` for hub pages, `article` for blog posts. */
  ogType?: string;
  /** Route-specific JSON-LD entities, forwarded to SEOHead. */
  extraJsonLd?: (ctx: { origin: string; canonicalUrl: string; ogImageUrl: string }) => Array<Record<string, unknown>>;
}> = ({ children, override = null, ogType = 'website', extraJsonLd }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [customSEO, setCustomSEO] = useState<SEOOverride | null>(null);
  const cms = useCms();

  // Scroll detection to update active section metadata dynamically
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 240;

          // Determine current section in viewport. Sections are wrapped in
          // scroll-reveal motion containers whose transforms make offsetTop
          // unreliable, so measure against the document instead.
          for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
            const id = SECTION_ORDER[i];
            const el = document.getElementById(id);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY;
              if (scrollPos >= top) {
                setActiveSection(id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check on mount
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseMeta = SECTION_METADATA[activeSection] || SECTION_METADATA.hero;

  // A page-level override (a standalone route) wins over both the modal
  // override and the scroll-spy section defaults.
  const effective = override ?? customSEO;

  // The hero (top-of-page) metadata is owned by the CMS so the configured site
  // title/description actually win over the built-in section defaults.
  const isHero = activeSection === 'hero' && !effective;

  const currentMeta: SectionSEOMetadata = {
    title: effective?.title || (isHero ? cms.getSetting('seo_meta_title', baseMeta.title) : baseMeta.title),
    description:
      effective?.description ||
      (isHero ? cms.getSetting('seo_meta_description', baseMeta.description) : baseMeta.description),
    sectionName: baseMeta.sectionName,
    hash: effective?.canonicalPath || (isHero ? '' : baseMeta.hash),
  };

  return (
    <SEOContext.Provider
      value={{
        activeSection,
        setActiveSection,
        setCustomSEO,
        currentMeta,
      }}
    >
      <SEOHead
        meta={currentMeta}
        siteName={cms.getSetting('site_name', 'DevCenterPoint')}
        ogImage={cms.getSetting('seo_og_image', '/og-image.png')}
        canonicalBase={cms.getSetting('seo_canonical_url', '')}
        cms={cms}
        ogType={ogType}
        extraJsonLd={extraJsonLd}
      />
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within an SEOProvider');
  }
  return context;
};

/**
 * Inertia <Head> component that manages the document title, meta description,
 * canonical link, Open Graph / Twitter cards and Schema.org JSON-LD.
 *
 * It must use Inertia's <Head> (not react-helmet-async): only Inertia's head
 * manager is collected during SSR and echoed into the Blade @inertiaHead
 * directive, which is what makes these tags visible to crawlers.
 */
export const SEOHead: React.FC<{
  meta: SectionSEOMetadata;
  siteName?: string;
  ogImage?: string;
  canonicalBase?: string;
  cms?: CmsContextValue;
  /** `website` for landing pages, `article` for blog posts. */
  ogType?: string;
  /**
   * Extra Schema.org entities appended to the JSON-LD `@graph`. Receives the
   * resolved URLs so pages can build Article / Service nodes without having to
   * re-derive the canonical origin themselves.
   */
  extraJsonLd?: (ctx: { origin: string; canonicalUrl: string; ogImageUrl: string }) => Array<Record<string, unknown>>;
}> = ({
  meta,
  siteName = 'DevCenterPoint',
  ogImage = '/og-image.png',
  canonicalBase = '',
  cms,
  ogType = 'website',
  extraJsonLd,
}) => {
  const origin =
    canonicalBase || (typeof window !== 'undefined' ? window.location.origin : 'https://devcenterpoint.com');
  // `meta.hash` carries either a homepage anchor ("#work") or a real path
  // ("/services/product-engineering"), so the leading slash is normalised to
  // avoid emitting a double slash that would break the canonical URL.
  const canonicalUrl = /^https?:\/\//.test(meta.hash)
    ? meta.hash
    : `${origin}/${meta.hash.replace(/^\/+/, '')}`;
  // Scrapers cannot resolve relative image paths, so always emit an absolute URL.
  const ogImageUrl = /^https?:\/\//.test(ogImage) ? ogImage : `${origin}/${ogImage.replace(/^\//, '')}`;

  // Schema.org structured data (JSON-LD). Rebuilt only when the CMS payload or
  // the active section changes, since stringifying the whole graph on every
  // scroll tick would be wasteful.
  const jsonLd = useMemo(() => {
    const setting = (key: string, fallback = '') => cms?.getSetting(key, fallback) ?? fallback;

    // `sameAs` must not contain empty or placeholder values — an invalid URL
    // degrades the whole Organization entity.
    const sameAs = [setting('social_linkedin'), setting('social_github'), setting('social_x')]
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\/\S+\.\S+/.test(u));

    const contactEmail = setting('contact_email');
    const brand = setting('site_name', siteName) || siteName;

    // OfferCatalog is derived from the CMS capabilities rather than a hardcoded
    // list, so editing a capability updates the structured data automatically.
    const capabilities = (cms?.capabilities ?? []) as Array<{
      title?: string;
      tagline?: string;
      description?: string;
    }>;
    const offers = capabilities
      .filter((c) => c.title)
      .map((c) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: c.title,
          description: (c.tagline || c.description || '').slice(0, 300),
        },
      }));

    const faqs = (cms?.faqs ?? []) as Array<{ question?: string; answer?: string }>;

    const projects = (cms?.projects ?? []) as Array<{
      title?: string;
      category?: string;
      tagline?: string;
      overview?: string;
      live_url?: string;
    }>;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'Corporation'],
          '@id': `${origin}/#organization`,
          name: brand,
          alternateName: `${brand} Studio`,
          url: origin,
          logo: `${origin}/logo-mark.svg`,
          image: ogImageUrl,
          description:
            'DevCenterPoint is a custom software development studio based in Dhaka, Bangladesh, building SaaS platforms, enterprise web applications, ERP systems and AI-powered software for clients worldwide.',
          ...(contactEmail ? { email: contactEmail } : {}),
          ...(sameAs.length ? { sameAs } : {}),
          knowsAbout: [
            'Software Engineering',
            'Full-Stack SaaS Development',
            'Explainable AI Systems',
            'Cloud Infrastructure and DevOps',
            'Docker and Kubernetes Orchestration',
            'Real-Time Distributed Architecture',
            'Enterprise ERP and POS Systems',
            'Headless Commerce Infrastructure',
            'TypeScript and React Architecture',
          ],
          areaServed: ['Worldwide', 'United States', 'Europe', 'Asia-Pacific'],
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${origin}/#service-studio`,
          name: `${brand} Software Engineering Studio`,
          url: origin,
          image: ogImageUrl,
          ...(contactEmail ? { email: contactEmail } : {}),
          priceRange: '$$$',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dhaka',
            addressCountry: 'BD',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 23.8103,
            longitude: 90.4125,
          },
          areaServed: ['Worldwide', 'United States', 'Europe', 'Asia-Pacific'],
          ...(offers.length
            ? {
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: `${brand} Engineering Capabilities`,
                  itemListElement: offers,
                },
              }
            : {}),
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: brand,
          publisher: {
            '@id': `${origin}/#organization`,
          },
          description:
            'Digital products, software & intelligent systems engineered for real-world impact.',
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: meta.title,
          description: meta.description,
          isPartOf: {
            '@id': `${origin}/#website`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumbs`,
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumbs`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: origin,
            },
            ...(meta.hash
              ? [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: meta.sectionName,
                    item: canonicalUrl,
                  },
                ]
              : []),
          ],
        },
        // Answer-engine (AEO) markup. Emitted only when the CMS actually has
        // published FAQs — an empty FAQPage is worse than none.
        ...(faqs.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${origin}/#faqpage`,
                mainEntity: faqs
                  .filter((f) => f.question && f.answer)
                  .map((f) => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: f.answer,
                    },
                  })),
              },
            ]
          : []),
        // Selected work as SoftwareApplication entities.
        ...(projects.length
          ? [
              {
                '@type': 'ItemList',
                '@id': `${origin}/#case-studies`,
                name: `${brand} Production Case Studies & Applications`,
                itemListElement: projects
                  .filter((p) => p.title)
                  .map((p, idx) => ({
                    '@type': 'SoftwareApplication',
                    position: idx + 1,
                    name: p.title,
                    applicationCategory: p.category || 'BusinessApplication',
                    operatingSystem: 'Cloud / Web Browser / Mobile',
                    description: (p.tagline || p.overview || '').slice(0, 300),
                    url: p.live_url || `${origin}/#work`,
                  })),
              },
            ]
          : []),
        // Route-specific entities (Article for blog posts, Service for a single
        // capability, SoftwareApplication for a case study) supplied by the page.
        ...(extraJsonLd ? extraJsonLd({ origin, canonicalUrl, ogImageUrl }) : []),
      ],
    };
  }, [
    cms,
    origin,
    canonicalUrl,
    ogImageUrl,
    siteName,
    meta.title,
    meta.description,
    meta.hash,
    meta.sectionName,
    extraJsonLd,
  ]);

  return (
    <Head>
      {/* Primary HTML Title */}
      <title>{meta.title}</title>

      {/* Primary Meta Tags */}
      <meta name="description" content={meta.description} head-key="description" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" head-key="robots" />
      <link rel="canonical" href={canonicalUrl} head-key="canonical" />

      {/* Language alternates. The site is English-only today, so hreflang points
           every locale at the same URL and `x-default` covers unmatched users.
           When a /bn locale ships, add its <link> here and in the sitemap. */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} head-key="hreflang-en" />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} head-key="hreflang-x-default" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} head-key="og:type" />
      <meta property="og:site_name" content={siteName} head-key="og:site_name" />
      <meta property="og:locale" content="en_US" head-key="og:locale" />
      <meta property="og:title" content={meta.title} head-key="og:title" />
      <meta property="og:description" content={meta.description} head-key="og:description" />
      <meta property="og:url" content={canonicalUrl} head-key="og:url" />
      <meta property="og:image" content={ogImageUrl} head-key="og:image" />
      <meta property="og:image:width" content="1200" head-key="og:image:width" />
      <meta property="og:image:height" content="630" head-key="og:image:height" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" head-key="twitter:card" />
      <meta name="twitter:site" content="@devcenterpoint" head-key="twitter:site" />
      <meta name="twitter:title" content={meta.title} head-key="twitter:title" />
      <meta name="twitter:description" content={meta.description} head-key="twitter:description" />
      <meta name="twitter:image" content={ogImageUrl} head-key="twitter:image" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json" head-key="jsonld">
        {JSON.stringify(jsonLd)}
      </script>
    </Head>
  );
};
