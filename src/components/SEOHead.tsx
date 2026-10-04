import React, { createContext, useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FAQ_DATA } from '../data/faq';
import { PROJECTS_DATA } from '../data/projects';

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
    description: 'DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt.',
    keywords: [
      'software engineering studio',
      'custom SaaS development',
      'digital product studio',
      'hire SaaS engineers',
      'full stack engineering agency',
      'intelligent systems development',
      'cloud native architecture',
      'DevCenterPoint',
      'React TypeScript engineering',
      'Python AI backend'
    ],
    sectionName: 'Home',
    hash: '',
  },
  positioning: {
    title: 'Product Engineering Philosophy — DevCenterPoint Systems',
    description: 'We build systems, not just screens. Explore our engineering doctrine: product strategy, high-density UI/UX, resilient full-stack backends, and explainable AI.',
    keywords: [
      'product engineering doctrine',
      'systems architecture studio',
      'high-density UI UX',
      'full stack core development',
      'software craftsmanship',
      'explainable AI engineering',
      'DevCenterPoint'
    ],
    sectionName: 'Positioning',
    hash: '#positioning',
  },
  capabilities: {
    title: 'Engineering Capabilities & Technical Architecture — DevCenterPoint',
    description: 'Full-stack SaaS, AI/ML intelligent agents, real-time IoT architecture, and high-throughput data pipelines engineered with zero-downtime reliability.',
    keywords: [
      'SaaS architecture consulting',
      'enterprise AI systems development',
      'realtime distributed systems',
      'cloud infrastructure DevOps',
      'Docker Kubernetes deployment',
      'microservices architecture',
      'high throughput data pipelines'
    ],
    sectionName: 'Capabilities',
    hash: '#capabilities',
  },
  work: {
    title: 'Engineered Products & Selected Work Archives — DevCenterPoint',
    description: 'Explore verified production software delivered by DevCenterPoint: enterprise ERP, dynamic QR attendance, headless e-commerce, and SHAP explainable AI.',
    keywords: [
      'production software case studies',
      'enterprise ERP development',
      'headless ecommerce architecture',
      'dynamic QR attendance app',
      'SHAP career predictor AI',
      'LeadLayer CRM architecture',
      'custom software portfolio'
    ],
    sectionName: 'Selected Work',
    hash: '#work',
  },
  architecture: {
    title: '5-Layer System Architecture & Engineering Philosophy — DevCenterPoint',
    description: 'Deep dive into our 5-layer engineering model: UX/UI delivery, API gateway, domain core services, streaming data persistence, and cloud infrastructure.',
    keywords: [
      '5-layer software architecture',
      'domain driven design',
      'API gateway design',
      'distributed data persistence',
      'PostgreSQL Redis architecture',
      'cloud systems engineering'
    ],
    sectionName: 'Architecture',
    hash: '#architecture',
  },
  tech: {
    title: 'Technology Stack & Engineering Ecosystem — DevCenterPoint',
    description: 'TypeScript, React 19, Python, Node.js, Go, PostgreSQL, Redis, Docker, and AWS: our precision toolkit for resilient, scalable digital systems.',
    keywords: [
      'enterprise tech stack',
      'React 19 development',
      'TypeScript consulting',
      'Node.js microservices',
      'Python FastAPI machine learning',
      'PostgreSQL optimization',
      'Docker cloud infrastructure'
    ],
    sectionName: 'Tech Stack',
    hash: '#tech',
  },
  process: {
    title: 'Product Lifecycle & 5-Stage Engineering Process — DevCenterPoint',
    description: 'From requirements interrogation and architecture blueprinting to sprint cycles, Playwright automated testing, and zero-downtime deployment pipelines.',
    keywords: [
      'agile product engineering lifecycle',
      'zero downtime deployment',
      'automated testing Playwright CI CD',
      'architecture blueprint RFC',
      'enterprise software QA'
    ],
    sectionName: 'Process',
    hash: '#process',
  },
  metrics: {
    title: 'Production Efficiency & Lifecycle Verification Metrics — DevCenterPoint',
    description: 'Quantifiable operational impact: 99.98% uptime, sub-50ms API latency, 65% faster feature velocity, and battle-tested code quality gates.',
    keywords: [
      'software engineering benchmarks',
      'sub-50ms API latency',
      '99.98 uptime SLA',
      'software release velocity',
      'enterprise code quality standards'
    ],
    sectionName: 'Metrics',
    hash: '#metrics',
  },
  about: {
    title: 'About DevCenterPoint — Engineering Principles & Ethos',
    description: 'Founded on craftsmanship and software discipline. Learn how DevCenterPoint partners with ambitious teams to build enduring, high-impact systems.',
    keywords: [
      'about DevCenterPoint',
      'software engineering consultancy',
      'dedicated engineering squad',
      'systems engineering studio',
      'senior software architects'
    ],
    sectionName: 'About',
    hash: '#about',
  },
  contact: {
    title: 'Start a Project — DevCenterPoint Scope Estimator & Inquiry',
    description: 'Build your project scope, calculate timelines, and connect with DevCenterPoint engineers to architect your next digital product or enterprise system.',
    keywords: [
      'software development cost estimator',
      'hire software development agency',
      'SaaS project scope calculator',
      'hire dedicated engineering squad',
      'DevCenterPoint project inquiry'
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

  const currentMeta: SectionSEOMetadata = {
    title: customSEO?.title || baseMeta.title,
    description: customSEO?.description || baseMeta.description,
    keywords: customSEO?.keywords || baseMeta.keywords,
    sectionName: baseMeta.sectionName,
    hash: customSEO?.canonicalPath || baseMeta.hash,
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
      <SEOHead meta={currentMeta} />
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
export const SEOHead: React.FC<{ meta: SectionSEOMetadata }> = ({ meta }) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://devcenterpoint.com';
  const canonicalUrl = `${origin}/${meta.hash}`;

  // Schema.org structured data (JSON-LD) with AEO FAQPage, GEO ProfessionalService, and SoftwareApplication items
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Corporation'],
        '@id': `${origin}/#organization`,
        name: 'DevCenterPoint',
        alternateName: 'DevCenterPoint Studio',
        url: origin,
        logo: `${origin}/logo-mark.svg`,
        image: `${origin}/og-image.svg`,
        description:
          'DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt.',
        foundingLocation: {
          '@type': 'Place',
          name: 'Dhaka, Bangladesh',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dhaka',
          addressCountry: 'BD',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+8801988383323',
          contactType: 'sales',
          availableLanguage: ['English', 'Bengali'],
        },
        sameAs: [
          'https://github.com/beingmushfiq',
          'https://twitter.com/devcenterpoint',
          'https://www.linkedin.com/company/devcenterpoint',
        ],
        knowsAbout: [
          'Software Engineering',
          'Full-Stack SaaS Development',
          'Explainable AI Systems',
          'SHAP and Machine Learning',
          'Cloud Infrastructure and DevOps',
          'Docker and Kubernetes Orchestration',
          'Real-Time Distributed Architecture',
          'Enterprise ERP and POS Systems',
          'Headless Commerce Infrastructure',
          'TypeScript and React 19 Architecture',
        ],
        areaServed: ['Worldwide', 'United States', 'Europe', 'Asia-Pacific'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${origin}/#service-studio`,
        name: 'DevCenterPoint Software Engineering Studio',
        url: origin,
        image: `${origin}/og-image.svg`,
        telephone: '+8801988383323',
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
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'DevCenterPoint Engineering Capabilities',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Product Engineering & Full-Stack SaaS',
                description: 'Custom SaaS web applications, microservices, and high-performance API design.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI & Intelligent Systems Engineering',
                description: 'Explainable AI pipelines, predictive machine learning, and enterprise RAG workflows.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Experience Design & Design Systems',
                description: 'Accessible, high-density token-driven UI/UX design systems.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Business Systems & ERP/POS',
                description: 'Tailored enterprise resource planning, point of sale, and offline-first data sync.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Headless Commerce Infrastructure',
                description: 'High-throughput headless e-commerce, multi-currency payment switches, and marketplaces.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud Infrastructure & Zero-Downtime DevOps',
                description: 'Docker, Kubernetes, automated CI/CD pipelines, and multi-region deployment automation.',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'DevCenterPoint',
        publisher: {
          '@id': `${origin}/#organization`,
        },
        description:
          'Digital products, software & intelligent systems engineered for real-world impact.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
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
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faqpage`,
        mainEntity: FAQ_DATA.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${origin}/#case-studies`,
        name: 'DevCenterPoint Production Case Studies & Applications',
        itemListElement: PROJECTS_DATA.map((proj, idx) => ({
          '@type': 'SoftwareApplication',
          position: idx + 1,
          name: proj.title,
          applicationCategory: proj.category,
          operatingSystem: 'Cloud / Web Browser / Mobile',
          description: proj.shortDescription,
          url: proj.liveUrl || `${origin}/#work`,
        })),
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
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* GEO Geotargeting Meta Tags */}
      <meta name="geo.region" content="BD-13" />
      <meta name="geo.placename" content="Dhaka, Global" />
      <meta name="geo.position" content="23.8103;90.4125" />
      <meta name="ICBM" content="23.8103, 90.4125" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="DevCenterPoint" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${origin}/og-image.svg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="DevCenterPoint Digital Products & Intelligent Systems" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@devcenterpoint" />
      <meta name="twitter:creator" content="@devcenterpoint" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${origin}/og-image.svg`} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
