import { useCms } from '../../Context/CmsContext';

export interface NavLink {
  label: string;
  href: string;
  note?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface HeaderData {
  brandName: string;
  navLinks: NavLink[];
  bookingUrl: string;
  bookingLabel: string;
  showBooking: boolean;
  whatsappUrl: string;
  whatsappLabel: string;
  emailUrl: string;
  emailLabel: string;
  githubUrl: string;
  founderUrl: string;
  template: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Proof', href: '#testimonials' },
  { label: 'Process', href: '#process' },
];

const DEFAULT_DRAWER_LINKS: NavLink[] = [
  { label: 'Selected Work', href: '#work', note: '9 Production Systems' },
  { label: 'Capabilities & Services', href: '#capabilities', note: 'Full-stack & AI' },
  { label: 'Sprint Methodology', href: '#process', note: 'Discovery to Deployment' },
  { label: 'Frequently Asked Questions', href: '#faq', note: 'Engagements, SLAs, Terms' },
  { label: 'Start Project Collaboration', href: '#contact', note: 'Scope & Architecture Estimator' },
];

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useHeaderData(): HeaderData {
  const cms = useCms();

  const whatsappNumber = cms.getSetting('whatsapp_number', '+8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', "Hi DevCenterPoint, I'd like to discuss a project")
  );

  const navLinks = parseJson<NavLink[]>(cms.getSetting('header_nav_links', ''), DEFAULT_NAV_LINKS);
  const bookingUrl = cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');

  return {
    brandName: cms.getSetting('site_name', 'DevCenterPoint'),
    navLinks: navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS,
    bookingUrl,
    bookingLabel: cms.getSetting('booking_cta_label', 'Book a Meeting'),
    showBooking: cms.getSetting('booking_in_header', 'true') !== 'false' && bookingUrl !== '',
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    whatsappLabel: cms.getSetting('whatsapp_number', '+8801988383323'),
    emailUrl: `mailto:${cms.getSetting('contact_email', 'contact@devcenterpoint.com')}`,
    emailLabel: cms.getSetting('contact_email', 'contact@devcenterpoint.com'),
    githubUrl: cms.getSetting('social_github', 'https://github.com/beingmushfiq'),
    founderUrl: cms.getSetting('founder_portfolio_url', 'https://buildwithmushfiq.vercel.app'),
    template: cms.getSetting('header_template', 'glass-pill'),
  };
}

export function useHeaderDrawerLinks(): NavLink[] {
  const cms = useCms();
  return parseJson<NavLink[]>(cms.getSetting('header_drawer_links', ''), DEFAULT_DRAWER_LINKS);
}
