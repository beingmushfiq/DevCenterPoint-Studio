import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { SEOProvider } from './components/SEOHead';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Positioning } from './components/Positioning';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { SelectedWorkSection } from './components/SelectedWorkSection';
import { EngineeringPhilosophy } from './components/EngineeringPhilosophy';
import { TechEcosystem } from './components/TechEcosystem';
import { ProcessSection } from './components/ProcessSection';
import { EfficiencyMetricsSection } from './components/EfficiencyMetricsSection';
import { AboutPrinciples } from './components/AboutPrinciples';
import { FAQSection } from './components/FAQSection';
import { ProjectInquiryBuilder } from './components/ProjectInquiryBuilder';
import { PlansPricingSection } from './components/PlansPricingSection';
import { NewsletterSignup } from './components/NewsletterSignup';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import { GlobalLoadingScreen } from './components/GlobalLoadingScreen';
import { ClientDemoSandboxModal } from './components/ClientDemoSandboxModal';
import { MobileBottomActionBar } from './components/MobileBottomActionBar';
import { TestimonialsSection } from './components/TestimonialsSection';

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
              <ScrollRevealSection>
                <Positioning />
              </ScrollRevealSection>

              {/* Interactive Capability Category Index & Code Inspector */}
              <ScrollRevealSection>
                <CapabilitiesSection />
              </ScrollRevealSection>

              {/* Selected Work Archive with Drill-down Case Study Inspector */}
              <ScrollRevealSection>
                <SelectedWorkSection />
              </ScrollRevealSection>

              {/* Verified Enterprise Impact & Executive Testimonials */}
              <ScrollRevealSection>
                <TestimonialsSection />
              </ScrollRevealSection>

              {/* Engineering Philosophy: 5-Layer System Architecture Diagram */}
              <ScrollRevealSection>
                <EngineeringPhilosophy />
              </ScrollRevealSection>

              {/* Technology Ecosystem Matrix */}
              <ScrollRevealSection>
                <TechEcosystem />
              </ScrollRevealSection>

              {/* Product Lifecycle & Process */}
              <ScrollRevealSection>
                <ProcessSection />
              </ScrollRevealSection>

              {/* Interactive Data Visualization: Lifecycle Efficiency Metrics */}
              <ScrollRevealSection>
                <EfficiencyMetricsSection />
              </ScrollRevealSection>

              {/* Brand Principles & Editorial Story */}
              <ScrollRevealSection>
                <AboutPrinciples />
              </ScrollRevealSection>

              {/* Frequently Asked Questions: Engineering Process & Engagement Models */}
              <ScrollRevealSection>
                <FAQSection />
              </ScrollRevealSection>

              {/* Dynamic Plans & Pricing Section (Disabled on public site by default) */}
              <ScrollRevealSection>
                <PlansPricingSection isVisible={false} />
              </ScrollRevealSection>

              {/* Interactive Project Scope Estimator & Contact Form */}
              <ScrollRevealSection>
                <ProjectInquiryBuilder />
              </ScrollRevealSection>

              {/* Company Updates & Engineering Dispatch Newsletter Signup (Firebase Firestore) */}
              <ScrollRevealSection>
                <NewsletterSignup />
              </ScrollRevealSection>
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
            <ClientDemoSandboxModal
              isOpen={isSandboxOpen}
              onClose={() => setIsSandboxOpen(false)}
            />
          </div>
        </ThemeProvider>
      </SEOProvider>
    </HelmetProvider>
  );
}

