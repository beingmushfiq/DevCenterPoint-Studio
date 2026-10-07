import React from 'react';
import { CmsProvider, CmsData } from '../Context/CmsContext';
import { SEOProvider } from './SEOHead';
import { ThemeProvider } from '../Context/ThemeContext';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { CustomCursor } from './CustomCursor';
import { BackToTop } from './BackToTop';
import { GlobalLoadingScreen } from './GlobalLoadingScreen';
import { MobileBottomActionBar } from './MobileBottomActionBar';

// Shared below-the-fold sections. Lazy so the initial HTML for a sub-page stays
// as small as the homepage's, and so the inquiry form's client-only work never
// blocks the server-rendered body.
const ProjectInquiryBuilder = React.lazy(() =>
  import('./ProjectInquiryBuilder').then((m) => ({ default: m.ProjectInquiryBuilder }))
);
const ClientDemoSandboxModal = React.lazy(() =>
  import('./ClientDemoSandboxModal').then((m) => ({ default: m.ClientDemoSandboxModal }))
);

export interface PublicPageMeta {
  /** Document title, written for search intent rather than brand voice. */
  title: string;
  /** Meta description, ~155 characters. */
  description: string;
  /** Root-relative path, e.g. `/services/product-engineering`. */
  canonicalPath: string;
}

interface PublicPageShellProps {
  /** The full CMS payload shared by every public route. */
  cms: CmsData;
  /** Page-level metadata. Overrides the scroll-spy section defaults outright. */
  meta: PublicPageMeta;
  /** `website` for hub pages, `article` for blog posts. */
  ogType?: string;
  /** Route-specific Schema.org entities appended to the JSON-LD `@graph`. */
  extraJsonLd?: (ctx: {
    origin: string;
    canonicalUrl: string;
    ogImageUrl: string;
  }) => Array<Record<string, unknown>>;
  /**
   * Render the project inquiry section. It also carries the `id="contact"`
   * anchor that the header CTA and the mobile action bar scroll to, so it
   * should only be disabled on pages that supply their own contact target.
   */
  showInquiry?: boolean;
  children: React.ReactNode;
}

/**
 * Chrome shared by every public page other than the homepage.
 *
 * The homepage composes these providers itself; standalone routes are wrapped
 * here so the header, footer, theme, loading screen and mobile action bar
 * behave identically without each page re-implementing the composition.
 */
export const PublicPageShell: React.FC<PublicPageShellProps> = ({
  cms,
  meta,
  ogType = 'website',
  extraJsonLd,
  showInquiry = true,
  children,
}) => {
  const [isSandboxOpen, setIsSandboxOpen] = React.useState(false);

  return (
    <CmsProvider value={cms}>
      <SEOProvider override={meta} ogType={ogType} extraJsonLd={extraJsonLd}>
        <ThemeProvider>
          <GlobalLoadingScreen />

          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans antialiased relative selection:bg-blue-600 selection:text-white">
            <CustomCursor />

            <SiteHeader onOpenSandbox={() => setIsSandboxOpen(true)} />

            <main id="main-content">
              {children}

              {showInquiry && (
                <React.Suspense fallback={<div className="w-full min-h-[40vh]" aria-hidden="true" />}>
                  <ProjectInquiryBuilder />
                </React.Suspense>
              )}
            </main>

            <SiteFooter />

            <BackToTop />

            <MobileBottomActionBar onOpenSandbox={() => setIsSandboxOpen(true)} />

            <React.Suspense fallback={null}>
              <ClientDemoSandboxModal
                isOpen={isSandboxOpen}
                onClose={() => setIsSandboxOpen(false)}
              />
            </React.Suspense>
          </div>
        </ThemeProvider>
      </SEOProvider>
    </CmsProvider>
  );
};

export default PublicPageShell;
