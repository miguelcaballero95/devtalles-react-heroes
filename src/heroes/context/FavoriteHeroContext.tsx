import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../types/hero.interface";

interface FavoriteHeroContext {
  favorites: Hero[];
  favoriteCount: number;
  toggleFavorite: (hero: Hero) => void;
  isFavorite: (hero: Hero) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

const getFavoritesFromLocalStorage = (): Hero[] => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {

  const [favorites, setFavorites] = useState<Hero[]>(getFavoritesFromLocalStorage);

  const toggleFavorite = (hero: Hero) => {

    const heroExists = favorites.find(h => h.id === hero.id);

    if (heroExists) {
      setFavorites(favorites.filter(h => h.id !== hero.id));
      return;
    }
    setFavorites([...favorites, hero]);
  }

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext value={{
      favorites,
      favoriteCount: favorites.length,
      toggleFavorite,
      isFavorite: (hero: Hero) => favorites.some(h => h.id === hero.id)
    }}>{children}</FavoriteHeroContext>
  )
}