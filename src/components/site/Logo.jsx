import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Dijitrak logo paketi (vektör SVG — font gerektirmez):
 * - logo-dark.svg: koyu zeminde mint simge + krem yazı (site varsayılanı)
 * - logo-light.svg: açık zeminde mint simge + lacivert yazı
 * - symbol.svg: yalnızca simge (küçük alanlarda kullanılır)
 */
export const LOGO_URL = '/logos/logo-dark.svg?v=3';
export const LOGO_LIGHT_URL = '/logos/logo-light.svg?v=3';
export const SYMBOL_URL = '/logos/symbol.svg?v=3';

export function LogoMark({ className = 'w-9 h-9' }) {
  return (
    <img src={SYMBOL_URL} alt="Dijitrak" className={`${className} rounded-xl`} loading="lazy" />
  );
}

export default function Logo({ compact = false, className = 'h-10' }) {
  if (compact) {
    return (
      <Link to="/" className="inline-flex select-none transition-transform duration-300 hover:-rotate-6 hover:scale-105" aria-label="Dijitrak">
        <LogoMark className="w-9 h-9" />
      </Link>
    );
  }
  // Logo SVG'si simge + "Dijitrak" yazısını birlikte içerir — ayrıca metin tekrarı yapılmaz
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 select-none transition-opacity duration-300 hover:opacity-85"
      aria-label="Dijitrak"
    >
      <img src={LOGO_URL} alt="Dijitrak" className={`${className} w-auto`} />
    </Link>
  );
}