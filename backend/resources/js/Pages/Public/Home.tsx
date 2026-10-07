import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from '../../Context/ThemeContext';
import { CmsProvider, CmsData } from '../../Context/CmsContext';
import { SEOProvider } from '../../Components/SEOHead';
import { SiteHeader } from '../../Components/SiteHeader';
import { Hero } from '../../Components/Hero';
import { SiteFooter } from '../../Components/SiteFooter';
import { CustomCursor } from '../../Components/CustomCursor';
import { BackToTop } from '../../Components/BackToTop';
import { GlobalLoadingScreen } from '../../Components/GlobalLoadingScreen';
import { MobileBottomActionBar } from '../../Components/MobileBottomActionBar';

// Below-the-fold sections are code-split so the initial homepage payload stays small.
const Positioning = React.lazy(() =>
  import('../../Components/Positioning').then((m) => ({ default: m.Positioning }))
);
const CapabilitiesSection = React.lazy(() =>
  import('../../Components/CapabilitiesSection').then((m) => ({ default: m.CapabilitiesSection }))
);
const SelectedWorkSection = React.lazy(() =>
  import('../../Components/SelectedWorkSection').then((m) => ({ default: m.SelectedWorkSection }))
);
const TestimonialsSection = React.lazy(() =>
  import('../../Components/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection }))
);
const EngineeringPhilosophy = React.lazy(() =>
  import('../../Components/EngineeringPhilosophy').then((m) => ({ default: m.EngineeringPhilosophy }))
);
const TechEcosystem = React.lazy(() =>
  import('../../Components/TechEcosystem').then((m) => ({ default: m.TechEcosystem }))
);
const ProcessSection = React.lazy(() =>
  import('../../Components/ProcessSection').then((m) => ({ default: m.ProcessSection }))
);
const EfficiencyMetricsSection = React.lazy(() =>
  import('../../Components/EfficiencyMetricsSection').then((m) => ({ default: m.EfficiencyMetricsSection }))
);
const AboutPrinciples = React.lazy(() =>
  import('../../Components/AboutPrinciples').then((m) => ({ default: m.AboutPrinciples }))
);
const FAQSection = React.lazy(() =>
  import('../../Components/FAQSection').then((m) => ({ default: m.FAQSection }))
);
const ProjectInquiryBuilder = React.lazy(() =>
  import('../../Components/ProjectInquiryBuilder').then((m) => ({ default: m.ProjectInquiryBuilder }))
);
const PlansPricingSection = React.lazy(() =>
  import('../../Components/PlansPricingSection').then((m) => ({ default: m.PlansPricingSection }))
);
const NewsletterSignup = React.lazy(() =>
  import('../../Components/NewsletterSignup').then((m) => ({ default: m.NewsletterSignup }))
);
const ClientDemoSandboxModal = React.lazy(() =>
  import('../../Components/ClientDemoSandboxModal').then((m) => ({ default: m.ClientDemoSandboxModal }))
);

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

function ScrollRevealSection({
  children,
  className = '',
  delay = 0,
  yOffset = 36,
}: ScrollRevealSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: '0px 0px -50px 0px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

function HeroReveal({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-reveal wrapper for code-split sections. Reserves vertical space while
 * the chunk loads so the page never shifts, and keeps the section anchors in a
 * stable document flow once mounted.
 */
function DeferredSection({ children, className, delay, yOffset }: ScrollRevealSectionProps) {
  return (
    <ScrollRevealSection className={className} delay={delay} yOffset={yOffset}>
      <React.Suspense fallback={<div className="w-full min-h-[40vh]" aria-hidden="true" />}>
        {children}
      </React.Suspense>
    </ScrollRevealSection>
  );
}

export default function Home(props: CmsData) {
  const [isSiteLoaded, setIsSiteLoaded] = React.useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = React.useState(false);

  const handleMountComplete = React.useCallback(() => setIsSiteLoaded(true), []);

  return (
    <CmsProvider value={props}>
      <SEOProvider>
        <ThemeProvider>
          {/* Global Initial Mounting Screen & Skeleton Loader */}
          <GlobalLoadingScreen onMountComplete={handleMountComplete} />

          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans antialiased relative selection:bg-blue-600 selection:text-white">
            {/* Desktop Subtle Cursor Indicator */}
            <CustomCursor />

            {/* Primary Fixed Navigation with Sandbox Opener */}
            <SiteHeader onOpenSandbox={() => setIsSandboxOpen(true)} />

            {/* Main Page Content Flow with Scroll-Reveal Motion Animations */}
            <main id="main-content">
              {/* Hero Section with Interactive System Map */}
              <HeroReveal>
                <Hero />
              </HeroReveal>

              {/* Positioning Statement */}
              <DeferredSection>
                <Positioning />
              </DeferredSection>

              {/* Interactive Capability Category Index & Code Inspector */}
              <DeferredSection>
                <CapabilitiesSection />
              </DeferredSection>

              {/* Selected Work Archive with Drill-down Case Study Inspector */}
              <DeferredSection>
                <SelectedWorkSection />
              </DeferredSection>

              {/* Verified Enterprise Impact & Executive Testimonials */}
              <DeferredSection>
                <TestimonialsSection />
              </DeferredSection>

              {/* Engineering Philosophy: 5-Layer System Architecture Diagram */}
              <DeferredSection>
                <EngineeringPhilosophy />
              </DeferredSection>

              {/* Technology Ecosystem Matrix */}
              <DeferredSection>
                <TechEcosystem />
              </DeferredSection>

              {/* Product Lifecycle & Process */}
              <DeferredSection>
                <ProcessSection />
              </DeferredSection>

              {/* Interactive Data Visualization: Lifecycle Efficiency Metrics */}
              <DeferredSection>
                <EfficiencyMetricsSection />
              </DeferredSection>

              {/* Brand Principles & Editorial Story */}
              <DeferredSection>
                <AboutPrinciples />
              </DeferredSection>

              {/* Frequently Asked Questions */}
              <DeferredSection>
                <FAQSection />
              </DeferredSection>

              {/* Dynamically Published Plans & Pricing (Controlled by CMS toggle) */}
              {props.plans && props.plans.length > 0 && props.siteSettings?.show_pricing_on_site === 'true' && (
                <DeferredSection>
                  <PlansPricingSection
                    plans={props.plans}
                    isVisible={true}
                    heading={props.siteSettings?.pricing_section_heading || 'Transparent Engineering Engagements'}
                    subheading={props.siteSettings?.pricing_section_subheading || 'Predictable milestones, dedicated senior squads, and zero-compromise system architecture.'}
                  />
                </DeferredSection>
              )}

              {/* Interactive Project Scope Estimator & Contact Form */}
              <DeferredSection>
                <ProjectInquiryBuilder />
              </DeferredSection>

              {/* Company Updates & Newsletter Signup */}
              <DeferredSection>
                <NewsletterSignup />
              </DeferredSection>
            </main>

            {/* Editorial Footer */}
            <ScrollRevealSection yOffset={24}>
              <SiteFooter />
            </ScrollRevealSection>

            {/* Floating Back to Top Action Button */}
            <BackToTop />

            {/* Mobile Fixed Sticky Bottom Action Bar */}
            <MobileBottomActionBar onOpenSandbox={() => setIsSandboxOpen(true)} />

            {/* Live Client Sandbox Modal */}
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
}
