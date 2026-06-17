import { createContext, useContext } from "react";

const IncidentQuotationModeContext = createContext(false);

export const IncidentQuotationModeProvider = IncidentQuotationModeContext.Provider;

export const useIncidentQuotationMode = () =>
  useContext(IncidentQuotationModeContext);
