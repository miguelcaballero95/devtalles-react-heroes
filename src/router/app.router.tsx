import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router";
import { AdminLayout } from "@/admin/layouts/AdminLayout";
import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { HeroPage } from "@/heroes/pages/hero/HeroPage";
import { HomePage } from "@/heroes/pages/home/HomePage";

// Lazy loading for SearchPage
// eslint-disable-next-line react-refresh/only-export-components
const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'heroes/:slug',
        element: <HeroPage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: '*',
        element: <Navigate to="/" />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />
      }
    ]
  }
])