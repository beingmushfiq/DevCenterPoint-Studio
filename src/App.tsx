import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { SEOProvider } from './components/SEOHead';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import { GlobalLoadingScreen } from './components/GlobalLoadingScreen';
import { MobileBottomActionBar } from './components/MobileBottomActionBar';

// Below-the-fold sections are code-split so the initial page payload stays small.
const Positioning = React.lazy(() =>
  import('./components/Positioning').then((m) => ({ default: m.Positioning }))
);
const CapabilitiesSection = React.lazy(() =>
  import('./components/CapabilitiesSection').then((m) => ({ default: m.CapabilitiesSection }))
);
const SelectedWorkSection = React.lazy(() =>
  import('./components/SelectedWorkSection').then((m) => ({ default: m.SelectedWorkSection }))
);
const TestimonialsSection = React.lazy(() =>
  import('./components/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection }))
);
const EngineeringPhilosophy = React.lazy(() =>
  import('./components/EngineeringPhilosophy').then((m) => ({ default: m.EngineeringPhilosophy }))
);
const TechEcosystem = React.lazy(() =>
  import('./components/TechEcosystem').then((m) => ({ default: m.TechEcosystem }))
);
const ProcessSection = React.lazy(() =>
  import('./components/ProcessSection').then((m) => ({ default: m.ProcessSection }))
);
const EfficiencyMetricsSection = React.lazy(() =>
  import('./components/EfficiencyMetricsSection').then((m) => ({ default: m.EfficiencyMetricsSection }))
);
const AboutPrinciples = React.lazy(() =>
  import('./components/AboutPrinciples').then((m) => ({ default: m.AboutPrinciples }))
);
const FAQSection = React.lazy(() =>
  import('./components/FAQSection').then((m) => ({ default: m.FAQSection }))
);
const ProjectInquiryBuilder = React.lazy(() =>
  import('./components/ProjectInquiryBuilder').then((m) => ({ default: m.ProjectInquiryBuilder }))
);
const PlansPricingSection = React.lazy(() =>
  import('./components/PlansPricingSection').then((m) => ({ default: m.PlansPricingSection }))
);
const NewsletterSignup = React.lazy(() =>
  import('./components/NewsletterSignup').then((m) => ({ default: m.NewsletterSignup }))
);
const ClientDemoSandboxModal = React.lazy(() =>
  import('./components/ClientDemoSandboxModal').then((m) => ({ default: m.ClientDemoSandboxModal }))
);

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * ScrollRevealSection provides a physics-informed graceful slide and fade animation
 * triggered as each section enters the user's viewport on scroll.
 */
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
        ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier curve for graceful deceleration
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * HeroReveal ensures the above-the-fold hero section gracefully fades and slides in
 * immediately on initial mount without requiring scroll interaction.
 */
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

export default function App() {
  const [isSiteLoaded, setIsSiteLoaded] = React.useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = React.useState(false);
  const handleMountComplete = React.useCallback(() => setIsSiteLoaded(true), []);

  return (
    <HelmetProvider>
      <SEOProvider>
        <ThemeProvider>
          {/* Global Initial Mounting Screen & Skeleton Loader */}
          <GlobalLoadingScreen onMountComplete={handleMountComplete} />

          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans antialiased relative selection:bg-blue-600 selection:text-white">
            {/* Desktop Subtle Cursor Indicator */}
            <CustomCursor />

            {/* Primary Fixed Navigation with Sandbox Opener */}
            <Navigation onOpenSandbox={() => setIsSandboxOpen(true)} />

            {/* Main Page Content Flow with Scroll-Reveal Motion Animations */}
            <main id="main-content">
              {/* Hero Section with Interactive System Map (Initial reveal on load) */}
              <HeroReveal>
                <Hero />
              </HeroReveal>

              {/* Positioning Statement: "We build systems, not just screens." */}
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

              {/* Frequently Asked Questions: Engineering Process & Engagement Models */}
              <DeferredSection>
                <FAQSection />
              </DeferredSection>

              {/* Dynamic Plans & Pricing Section (Disabled on public site by default) */}
              <DeferredSection>
                <PlansPricingSection isVisible={false} />
              </DeferredSection>

              {/* Interactive Project Scope Estimator & Contact Form */}
              <DeferredSection>
                <ProjectInquiryBuilder />
              </DeferredSection>

              {/* Company Updates & Engineering Dispatch Newsletter Signup (Firebase Firestore) */}
              <DeferredSection>
                <NewsletterSignup />
              </DeferredSection>
            </main>

            {/* Editorial Footer with subtle scroll-reveal */}
            <ScrollRevealSection yOffset={24}>
              <Footer />
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
    </HelmetProvider>
  );
}

