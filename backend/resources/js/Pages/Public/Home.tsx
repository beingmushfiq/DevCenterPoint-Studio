import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Head } from '@inertiajs/react';
import { ThemeProvider } from '../../Context/ThemeContext';
import { CmsProvider, CmsData } from '../../Context/CmsContext';
import { SEOProvider } from '../../Components/SEOHead';
import { Navigation } from '../../Components/Navigation';
import { Hero } from '../../Components/Hero';
import { Positioning } from '../../Components/Positioning';
import { CapabilitiesSection } from '../../Components/CapabilitiesSection';
import { SelectedWorkSection } from '../../Components/SelectedWorkSection';
import { EngineeringPhilosophy } from '../../Components/EngineeringPhilosophy';
import { TechEcosystem } from '../../Components/TechEcosystem';
import { ProcessSection } from '../../Components/ProcessSection';
import { EfficiencyMetricsSection } from '../../Components/EfficiencyMetricsSection';
import { AboutPrinciples } from '../../Components/AboutPrinciples';
import { FAQSection } from '../../Components/FAQSection';
import { ProjectInquiryBuilder } from '../../Components/ProjectInquiryBuilder';
import { PlansPricingSection } from '../../Components/PlansPricingSection';
import { NewsletterSignup } from '../../Components/NewsletterSignup';
import { Footer } from '../../Components/Footer';
import { CustomCursor } from '../../Components/CustomCursor';
import { BackToTop } from '../../Components/BackToTop';
import { GlobalLoadingScreen } from '../../Components/GlobalLoadingScreen';
import { ClientDemoSandboxModal } from '../../Components/ClientDemoSandboxModal';
import { MobileBottomActionBar } from '../../Components/MobileBottomActionBar';
import { TestimonialsSection } from '../../Components/TestimonialsSection';

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

export default function Home(props: CmsData) {
  const [isSiteLoaded, setIsSiteLoaded] = React.useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = React.useState(false);
  const siteTitle = props.siteSettings?.seo_meta_title || 'DevCenterPoint Studio | Software Engineering & System Architecture';
  const siteDescription = props.siteSettings?.seo_meta_description || 'Elite software engineering consultancy specializing in scalable web systems, AI pipelines, and resilient cloud architectures.';

  return (
    <HelmetProvider>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
      </Head>
      <CmsProvider value={props}>
        <SEOProvider>
          <ThemeProvider>
            {/* Global Initial Mounting Screen & Skeleton Loader */}
            <GlobalLoadingScreen onMountComplete={() => setIsSiteLoaded(true)} />

            <div
              className={`min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans antialiased relative selection:bg-blue-600 selection:text-white transition-opacity duration-300 ${
                isSiteLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Desktop Subtle Cursor Indicator */}
              <CustomCursor />

              {/* Primary Fixed Navigation with Sandbox Opener */}
              <Navigation onOpenSandbox={() => setIsSandboxOpen(true)} />

              {/* Main Page Content Flow with Scroll-Reveal Motion Animations */}
              <main id="main-content">
                {/* Hero Section with Interactive System Map */}
                <HeroReveal>
                  <Hero />
                </HeroReveal>

                {/* Positioning Statement */}
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

                {/* Frequently Asked Questions */}
                <ScrollRevealSection>
                  <FAQSection />
                </ScrollRevealSection>

                {/* Dynamically Published Plans & Pricing (Controlled by CMS toggle) */}
                {props.plans && props.plans.length > 0 && props.siteSettings?.show_pricing_on_site === 'true' && (
                  <ScrollRevealSection>
                    <PlansPricingSection
                      plans={props.plans}
                      isVisible={true}
                      heading={props.siteSettings?.pricing_section_heading || 'Transparent Engineering Engagements'}
                      subheading={props.siteSettings?.pricing_section_subheading || 'Predictable milestones, dedicated senior squads, and zero-compromise system architecture.'}
                    />
                  </ScrollRevealSection>
                )}

                {/* Interactive Project Scope Estimator & Contact Form */}
                <ScrollRevealSection>
                  <ProjectInquiryBuilder />
                </ScrollRevealSection>

                {/* Company Updates & Newsletter Signup */}
                <ScrollRevealSection>
                  <NewsletterSignup />
                </ScrollRevealSection>
              </main>

              {/* Editorial Footer */}
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
      </CmsProvider>
    </HelmetProvider>
  );
}
