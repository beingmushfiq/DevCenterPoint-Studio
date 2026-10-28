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

export type SocialPlatform = 'linkedin' | 'github' | 'x' | 'youtube' | 'instagram' | 'facebook';

export interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  platform: SocialPlatform | string;
  accentHover?: string;
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
  socialX: string;
  socialYoutube: string;
  socialInstagram: string;
  socialFacebook: string;
  socialNetwork: SocialChannel[];
  template: string;
}

/**
 * Footer navigation. Dedicated routes use real paths; homepage-only sections
 * use `/#anchor` so they still resolve when the footer is shown on a
 * standalone page. `#contact` stays in-page because every public page renders
 * the inquiry section.
 */
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Selected Work', href: '/work' },
      { label: 'Engineering Blog', href: '/blog' },
      { label: 'Architecture', href: '/#architecture' },
      { label: 'Tech Ecosystem', href: '/#tech' },
      { label: 'Lifecycle Process', href: '/#process' },
      { label: 'Principles', href: '/#about' },
      { label: 'FAQ & Engagement', href: '/#faq' },
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

  const socialLinkedin = cms.getSetting('social_linkedin', 'https://www.linkedin.com/company/devcenterpoint');
  const socialGithub = cms.getSetting('social_github', 'https://github.com/DevCenterPoint');
  const socialX = cms.getSetting('social_x', cms.getSetting('social_twitter', 'https://x.com/DevCenterPoint'));
  const socialYoutube = cms.getSetting('social_youtube', 'https://youtube.com/@DevCenterPoint');
  const socialInstagram = cms.getSetting('social_instagram', 'https://www.instagram.com/devcenterpoint/');
  const socialFacebook = cms.getSetting('social_facebook', 'https://facebook.com/DevCenterPoint');

  const rawSocials: SocialChannel[] = [
    {
      name: 'LinkedIn',
      handle: '/company/devcenterpoint',
      url: socialLinkedin,
      platform: 'linkedin',
    },
    {
      name: 'GitHub',
      handle: '@DevCenterPoint',
      url: socialGithub,
      platform: 'github',
    },
    {
      name: 'X (Twitter)',
      handle: '@DevCenterPoint',
      url: socialX,
      platform: 'x',
    },
    {
      name: 'YouTube',
      handle: '@DevCenterPoint',
      url: socialYoutube,
      platform: 'youtube',
    },
    {
      name: 'Instagram',
      handle: '@devcenterpoint',
      url: socialInstagram,
      platform: 'instagram',
    },
    {
      name: 'Facebook',
      handle: '/DevCenterPoint',
      url: socialFacebook,
      platform: 'facebook',
    },
  ];

  const socialNetwork = rawSocials.filter((item) => Boolean(item.url));

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
    githubUrl: socialGithub,
    socialGithub,
    socialLinkedin,
    socialTwitter: socialX,
    socialX,
    socialYoutube,
    socialInstagram,
    socialFacebook,
    socialNetwork,
    template: cms.getSetting('footer_template', 'four-column'),
  };
}
