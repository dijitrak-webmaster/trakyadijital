import { useEffect, useState } from 'react';

const now = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

/** Cihaz durum çubukları için canlı saat (SS:DD). */
export default function useClock() {
  const [time, setTime] = useState(now);
  useEffect(() => {
    const t = setInterval(() => setTime(now()), 10000);
    return () => clearInterval(t);
  }, []);
  return time;
}