import React, { createContext, useContext } from 'react';

export interface CmsData {
  capabilities?: any[];
  projects?: any[];
  milestones?: any[];
  faqs?: any[];
  team?: any[];
  pageSections?: Record<string, Record<string, any>>;
  siteSettings?: Record<string, string>;
}

const CmsContext = createContext<CmsData>({});

export const CmsProvider: React.FC<{ value: CmsData; children: React.ReactNode }> = ({ value, children }) => (
  <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
);

export const useCms = () => useContext(CmsContext);
