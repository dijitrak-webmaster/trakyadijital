import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext(null);

/** Favori ürünler — localStorage'da saklanır, giriş gerekmez. */
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dijitrak_favoriler') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dijitrak_favoriler', JSON.stringify(ids));
  }, [ids]);

  const toggle = (id) => setIds((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const has = (id) => ids.includes(id);

  return <FavoritesContext.Provider value={{ ids, toggle, has }}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);