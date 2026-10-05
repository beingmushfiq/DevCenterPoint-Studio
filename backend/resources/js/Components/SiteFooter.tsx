import React from 'react';
import { useCms } from '../Context/CmsContext';
import { RegionOverride } from './RegionOverride';
import { FooterFourColumn } from './FooterTemplates/FooterFourColumn';
import { FooterCompactRow } from './FooterTemplates/FooterCompactRow';
import { FooterMegaSitemap } from './FooterTemplates/FooterMegaSitemap';

const PRESETS: Record<string, React.FC> = {
  'four-column': FooterFourColumn,
  'compact-row': FooterCompactRow,
  'mega-sitemap': FooterMegaSitemap,
};

export const SiteFooter: React.FC = () => {
  const cms = useCms();
  const overrideMode = cms.getSectionBlock<{ mode?: string }>(
    'appearance',
    'footer_override',
    {}
  )?.mode;

  if (overrideMode === 'live') {
    return <RegionOverride region="footer" minHeight={120} />;
  }

  const templateKey = cms.getSetting('footer_template', 'four-column');
  const Preset = PRESETS[templateKey] ?? FooterFourColumn;

  return <Preset />;
};
