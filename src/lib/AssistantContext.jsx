import React, { createContext, useCallback, useContext, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AssistantCtx = createContext(null);

export function AssistantProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  // Portaldan beslenen müşteri bağlamı: projeler, teklifler, abonelikler, sorular
  const [customerContext, setCustomerContext] = useState(null);

  const openAssistant = useCallback((payload = null) => {
    // panel her koşulda açılsın: analitik hata tıklamayı bloklayamaz
    try {
      base44.analytics.track({ eventName: 'assistant_open', properties: { source: payload?.intent || payload?.service || 'general' } });
    } catch { /* sessizce */ }
    setPending(payload);
    setOpen(true);
  }, []);

  const clearPending = useCallback(() => setPending(null), []);

  return (
    <AssistantCtx.Provider value={{ isOpen, setOpen, openAssistant, pending, clearPending, customerContext, setCustomerContext }}>
      {children}
    </AssistantCtx.Provider>
  );
}

export const useAssistant = () => useContext(AssistantCtx);