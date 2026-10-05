import React from 'react';
import { useCms } from '../Context/CmsContext';
import { RegionOverride } from './RegionOverride';
import { HeaderGlassPill } from './HeaderTemplates/HeaderGlassPill';
import { HeaderSolidBar } from './HeaderTemplates/HeaderSolidBar';
import { HeaderMegaMenu } from './HeaderTemplates/HeaderMegaMenu';

interface SiteHeaderProps {
  onOpenSandbox?: () => void;
}

const PRESETS: Record<string, React.FC<{ onOpenSandbox?: () => void }>> = {
  'glass-pill': HeaderGlassPill,
  'solid-bar': HeaderSolidBar,
  'mega-menu': HeaderMegaMenu,
};

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onOpenSandbox }) => {
  const cms = useCms();
  const overrideMode = cms.getSectionBlock<{ mode?: string }>(
    'appearance',
    'header_override',
    {}
  )?.mode;

  // A live override fully replaces the preset header.
  if (overrideMode === 'live') {
    return <RegionOverride region="header" minHeight={72} />;
  }

  const templateKey = cms.getSetting('header_template', 'glass-pill');
  const Preset = PRESETS[templateKey] ?? HeaderGlassPill;

  return <Preset onOpenSandbox={onOpenSandbox} />;
};
