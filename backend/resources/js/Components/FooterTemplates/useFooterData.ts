import { useCms } from '../../Context/CmsContext';
import type { NavLink } from '../HeaderTemplates/useHeaderData';

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface FooterLink {
  label: string;
  href: string;
  note?: string;
  accent?: string;
}

export interface FooterData {
  brandName: string;
  bio: string;
  statusLabel: string;
  contactEmail: string;
  contactPhone: string;
  whatsappUrl: string;
  address: string;
  copyrightText: string;
  tagline: string;
  columns: FooterColumn[];
  ecosystemLinks: FooterLink[];
  bookingUrl: string;
  bookingLabel: string;
  showBooking: boolean;
  founderName: string;
  founderUrl: string;
  githubUrl: string;
  socialGithub: string;
  socialLinkedin: string;
  socialTwitter: string;
  template: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Selected Work', href: '#work' },
      { label: 'Architecture', href: '#architecture' },
      { label: 'Tech Ecosystem', href: '#tech' },
      { label: 'Lifecycle Process', href: '#process' },
      { label: 'Principles', href: '#about' },
      { label: 'FAQ & Engagement', href: '#faq' },
      { label: 'Start Project', href: '#contact' },
    ],
  },
];

const DEFAULT_ECOSYSTEM: FooterLink[] = [
  { label: 'Engineering Studio', href: 'https://devcenterpoint.com', note: 'devcenterpoint.com' },
  { label: 'AI Applied Studio', href: 'https://devcenterpoint.ai.studio', note: 'devcenterpoint.ai', accent: 'emerald' },
  { label: 'Enterprise ERP Demo', href: 'https://demoerp.devcenterpoint.com', note: 'demoerp', accent: 'blue' },
  { label: 'Healthcare Serial Manager', href: 'https://serial.ferozamedicinecorner.com', note: 'serial', accent: 'emerald' },
  { label: 'Road Safety Movement', href: 'https://roadsafetymovement.org', note: 'roadsafety' },
  { label: 'Qttenzy Smart Attendance', href: 'https://qttenzy.vercel.app', note: 'qttenzy' },
];

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    if (parsed && typeof parsed === 'object') return parsed as T;
    return fallback;
  } catch {
    return fallback;
  }
}

export function useFooterData(): FooterData {
  const cms = useCms();

  const whatsappNumber = cms.getSetting('whatsapp_number', '+8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', 'Hi DevCenterPoint, I would like to discuss engineering a digital product.')
  );

  const columns = parseJson<FooterColumn[]>(cms.getSetting('footer_columns', ''), DEFAULT_COLUMNS);
  const ecosystemLinks = parseJson<FooterLink[]>(cms.getSetting('footer_ecosystem_links', ''), DEFAULT_ECOSYSTEM);
  const bookingUrl = cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');

  return {
    brandName: cms.getSetting('site_name', 'DevCenterPoint Studio'),
    bio: cms.getSetting(
      'footer_bio',
      'DevCenterPoint is a custom software engineering studio building cloud architectures, high-performance web systems, and applied AI workflows.'
    ),
    statusLabel: cms.getSetting('footer_status_label', 'ALL SYSTEMS OPERATIONAL (2026)'),
    contactEmail: cms.getSetting('contact_email', 'contact@devcenterpoint.com'),
    contactPhone: cms.getSetting('whatsapp_number', '+8801988383323'),
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    address: cms.getSetting('studio_location', 'Global Software Studio & Scalable Systems Lab'),
    copyrightText: cms.getSetting('footer_copyright_text', ''),
    tagline: cms.getSetting('footer_tagline', 'Designed with intent. Engineered with purpose.'),
    columns: columns.length > 0 ? columns : DEFAULT_COLUMNS,
    ecosystemLinks: ecosystemLinks.length > 0 ? ecosystemLinks : DEFAULT_ECOSYSTEM,
    bookingUrl,
    bookingLabel: cms.getSetting('booking_cta_label', 'Book a Meeting'),
    showBooking: cms.getSetting('booking_in_footer', 'true') !== 'false' && bookingUrl !== '',
    founderName: cms.getSetting('founder_name', 'Mushfiq'),
    founderUrl: cms.getSetting('founder_portfolio_url', 'https://buildwithmushfiq.vercel.app'),
    githubUrl: cms.getSetting('social_github', 'https://github.com/beingmushfiq'),
    socialGithub: cms.getSetting('social_github', 'https://github.com/beingmushfiq'),
    socialLinkedin: cms.getSetting('social_linkedin', 'https://linkedin.com/company/devcenterpoint'),
    socialTwitter: cms.getSetting('social_twitter', 'https://twitter.com/devcenterpoint'),
    template: cms.getSetting('footer_template', 'four-column'),
  };
}
