import React, { createContext, useContext } from 'react';

export interface CmsData {
  capabilities?: any[];
  projects?: any[];
  posts?: any[];
  milestones?: any[];
  faqs?: any[];
  team?: any[];
  testimonials?: any[];
  sandboxApps?: any[];
  plans?: any[];
  solutionProducts?: any[];
  pageSections?: Record<string, Record<string, any>>;
  siteSettings?: Record<string, string>;
}

export interface CmsContextValue extends CmsData {
  getSectionBlock: <T = any>(sectionKey: string, blockKey: string, fallback: T) => T;
  getSetting: (key: string, fallback: string) => string;
}

const defaultContext: CmsContextValue = {
  getSectionBlock: <T = any>(_sec: string, _blk: string, fallback: T): T => fallback,
  getSetting: (_key: string, fallback: string): string => fallback,
};

const CmsContext = createContext<CmsContextValue>(defaultContext);

export const CmsProvider: React.FC<{ value: CmsData; children: React.ReactNode }> = ({ value, children }) => {
  const getSectionBlock = <T = any>(sectionKey: string, blockKey: string, fallback: T): T => {
    if (value.pageSections?.[sectionKey]?.[blockKey] !== undefined) {
      return value.pageSections[sectionKey][blockKey] as T;
    }
    return fallback;
  };

  const getSetting = (key: string, fallback: string): string => {
    if (value.siteSettings?.[key] !== undefined && value.siteSettings[key] !== '') {
      return value.siteSettings[key];
    }
    return fallback;
  };

  const contextValue: CmsContextValue = {
    ...value,
    getSectionBlock,
    getSetting,
  };

  return <CmsContext.Provider value={contextValue}>{children}</CmsContext.Provider>;
};

export const useCms = (): CmsContextValue => useContext(CmsContext);
