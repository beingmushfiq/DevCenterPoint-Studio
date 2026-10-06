import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCms, CmsContextValue } from '../Context/CmsContext';

export interface SectionSEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  sectionName: string;
  hash: string;
}

export const SECTION_METADATA: Record<string, SectionSEOMetadata> = {
  hero: {
    title: 'DevCenterPoint — Digital Products, Software & Intelligent Systems',
    description: 'DevCenterPoint designs and engineers software products, SaaS platforms, AI-powered systems, and high-performance digital architectures for real-world impact.',
    keywords: [
      'software engineering',
      'digital products',
      'intelligent systems',
      'SaaS platform development',
      'DevCenterPoint',
      'cloud architecture',
      'full stack engineering'
    ],
    sectionName: 'Home',
    hash: '',
  },
  positioning: {
    title: 'Product Engineering Philosophy — DevCenterPoint Systems',
    description: 'We build systems, not just screens. Explore our engineering doctrine: product strategy, high-density UI/UX, resilient full-stack backends, and explainable AI.',
    keywords: [
      'product engineering',
      'systems architecture',
      'high-density UI',
      'full stack core',
      'engineering doctrine',
      'DevCenterPoint'
    ],
    sectionName: 'Positioning',
    hash: '#positioning',
  },
  capabilities: {
    title: 'Engineering Capabilities & Technical Architecture — DevCenterPoint',
    description: 'Full-stack SaaS, AI/ML intelligent agents, real-time IoT architecture, and high-throughput data pipelines engineered with zero-downtime reliability.',
    keywords: [
      'SaaS architecture',
      'AI systems',
      'realtime distributed systems',
      'cloud infrastructure',
      'data pipelines',
      'Docker Kubernetes'
    ],
    sectionName: 'Capabilities',
    hash: '#capabilities',
  },
  work: {
    title: 'Engineered Products & Selected Work Archives — DevCenterPoint',
    description: 'Explore verified software case studies delivered by DevCenterPoint, including SaaS platforms, healthcare systems, retail commerce, and automated analytics.',
    keywords: [
      'case studies',
      'engineered software',
      'production software archives',
      'SaaS applications',
      'healthcare technology',
      'enterprise software'
    ],
    sectionName: 'Selected Work',
    hash: '#work',
  },
  testimonials: {
    title: 'Verified Client Proof & Testimonials — DevCenterPoint',
    description: 'Read verified endorsements and measurable outcomes from the CTOs and product leaders whose platforms DevCenterPoint has engineered.',
    keywords: [
      'client testimonials',
      'software case study proof',
      'enterprise endorsements',
      'verified engineering outcomes',
      'DevCenterPoint clients'
    ],
    sectionName: 'Proof',
    hash: '#testimonials',
  },
  architecture: {
    title: '5-Layer System Architecture & Engineering Philosophy — DevCenterPoint',
    description: 'Deep dive into our 5-layer engineering model: UX/UI delivery, API gateway, domain core services, streaming data persistence, and cloud infrastructure.',
    keywords: [
      '5-layer architecture',
      'domain driven design',
      'API gateway',
      'distributed data persistence',
      'cloud engineering'
    ],
    sectionName: 'Architecture',
    hash: '#architecture',
  },
  tech: {
    title: 'Technology Stack & Engineering Ecosystem — DevCenterPoint',
    description: 'TypeScript, React 19, Python, Node.js, Go, PostgreSQL, Redis, Docker, and AWS: our precision toolkit for resilient, scalable digital systems.',
    keywords: [
      'tech stack',
      'React 19',
      'TypeScript',
      'Node.js',
      'Python AI',
      'PostgreSQL',
      'Docker infrastructure'
    ],
    sectionName: 'Tech Stack',
    hash: '#tech',
  },
  process: {
    title: 'Product Lifecycle & 5-Stage Engineering Process — DevCenterPoint',
    description: 'From requirements interrogation and architecture blueprinting to sprint cycles, load testing, and zero-downtime deployment pipelines.',
    keywords: [
      'agile product development',
      'engineering lifecycle',
      'CI/CD deployment',
      'architecture blueprint',
      'software testing'
    ],
    sectionName: 'Process',
    hash: '#process',
  },
  metrics: {
    title: 'Production Efficiency & Lifecycle Verification Metrics — DevCenterPoint',
    description: 'Quantifiable operational impact: 99.98% uptime, sub-50ms API latency, 65% faster feature velocity, and battle-tested code quality metrics.',
    keywords: [
      'engineering metrics',
      'system latency',
      'reliability uptime',
      'performance benchmarks',
      'software efficiency'
    ],
    sectionName: 'Metrics',
    hash: '#metrics',
  },
  about: {
    title: 'About DevCenterPoint — Engineering Principles & Ethos',
    description: 'Founded on craftsmanship and software discipline. Learn how DevCenterPoint partners with ambitious teams to build enduring, high-impact systems.',
    keywords: [
      'about DevCenterPoint',
      'software consultancy',
      'engineering principles',
      'systems engineers',
      'digital product studio'
    ],
    sectionName: 'About',
    hash: '#about',
  },
  contact: {
    title: 'Start a Project — DevCenterPoint Scope Estimator & Inquiry',
    description: 'Build your project scope, calculate timelines, and connect with DevCenterPoint engineers to architect your next digital product or enterprise system.',
    keywords: [
      'project inquiry',
      'software estimate',
      'hire engineers',
      'DevCenterPoint contact',
      'software scope estimator'
    ],
    sectionName: 'Contact',
    hash: '#contact',
  },
  faq: {
    title: 'Engagements, SLAs & Terms — DevCenterPoint FAQ',
    description: 'Answers on engagement models, delivery guarantees, service-level agreements, and how DevCenterPoint scopes and runs engineering partnerships.',
    keywords: [
      'software engagement models',
      'development SLA',
      'engineering terms',
      'DevCenterPoint FAQ',
      'project delivery guarantees'
    ],
    sectionName: 'FAQ',
    hash: '#faq',
  },
  newsletter: {
    title: 'Engineering Dispatch Newsletter — DevCenterPoint',
    description: 'Join the DevCenterPoint dispatch for systems architecture notes, applied AI patterns, and lessons from production software delivery.',
    keywords: [
      'engineering newsletter',
      'software architecture insights',
      'applied AI newsletter',
      'DevCenterPoint dispatch',
      'developer updates'
    ],
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
  keywords?: string[];
  canonicalPath?: string;
}

interface SEOContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setCustomSEO: (override: SEOOverride | null) => void;
  currentMeta: SectionSEOMetadata;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // The hero (top-of-page) metadata is owned by the CMS so the configured site
  // title/description actually win over the built-in section defaults.
  const isHero = activeSection === 'hero' && !customSEO;
  const cmsKeywords = cms.getSetting('seo_meta_keywords', '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const currentMeta: SectionSEOMetadata = {
    title: customSEO?.title || (isHero ? cms.getSetting('seo_meta_title', baseMeta.title) : baseMeta.title),
    description:
      customSEO?.description ||
      (isHero ? cms.getSetting('seo_meta_description', baseMeta.description) : baseMeta.description),
    keywords: customSEO?.keywords || (isHero && cmsKeywords.length ? cmsKeywords : baseMeta.keywords),
    sectionName: baseMeta.sectionName,
    hash: customSEO?.canonicalPath || (isHero ? '' : baseMeta.hash),
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
 * React Helmet Component to dynamically manage HTML head elements
 * for SEO, OpenGraph cards, Twitter cards, and Schema.org JSON-LD.
 */
export const SEOHead: React.FC<{
  meta: SectionSEOMetadata;
  siteName?: string;
  ogImage?: string;
  canonicalBase?: string;
  cms?: CmsContextValue;
}> = ({ meta, siteName = 'DevCenterPoint', ogImage = '/og-image.png', canonicalBase = '', cms }) => {
  const origin =
    canonicalBase || (typeof window !== 'undefined' ? window.location.origin : 'https://devcenterpoint.com');
  const canonicalUrl = `${origin}/${meta.hash}`;
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
            'DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt.',
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
      ],
    };
  }, [cms, origin, canonicalUrl, ogImageUrl, siteName, meta.title, meta.description, meta.hash, meta.sectionName]);

  return (
    <Helmet>
      {/* Primary HTML Title */}
      <title>{meta.title}</title>

      {/* Primary Meta Tags */}
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@devcenterpoint" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
