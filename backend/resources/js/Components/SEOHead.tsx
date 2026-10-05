import React, { createContext, useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCms } from '../Context/CmsContext';

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
};

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
    const sectionIds = [
      'hero',
      'positioning',
      'capabilities',
      'work',
      'architecture',
      'tech',
      'process',
      'metrics',
      'about',
      'contact',
    ];

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 240;

          // Determine current section in viewport
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const id = sectionIds[i];
            const el = document.getElementById(id);
            if (el) {
              const top = el.offsetTop;
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
}> = ({ meta, siteName = 'DevCenterPoint', ogImage = '/og-image.png', canonicalBase = '' }) => {
  const origin =
    canonicalBase || (typeof window !== 'undefined' ? window.location.origin : 'https://devcenterpoint.com');
  const canonicalUrl = `${origin}/${meta.hash}`;
  // Scrapers cannot resolve relative image paths, so always emit an absolute URL.
  const ogImageUrl = /^https?:\/\//.test(ogImage) ? ogImage : `${origin}/${ogImage.replace(/^\//, '')}`;

  // Schema.org structured data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: siteName,
        url: origin,
        logo: `${origin}/logo-mark.svg`,
        description:
          'DevCenterPoint designs and engineers software products, SaaS platforms, AI-powered systems, and digital experiences.',
        knowsAbout: [
          'Software Engineering',
          'Full-Stack SaaS',
          'Intelligent AI Systems',
          'Cloud Infrastructure',
          'Real-Time Distributed Architecture',
          'Explainable AI',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: siteName,
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
      },
    ],
  };

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
