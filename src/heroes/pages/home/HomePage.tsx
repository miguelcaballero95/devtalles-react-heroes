import { useSearchParams } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumb } from "@/components/custom/CustomBreadcrumb"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { use } from "react"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"

export const HomePage = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, favoriteCount } = use(FavoriteHeroContext);

  const activeTab = searchParams.get('tab') ?? 'all';
  const currentPage = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  const { data: heroesResponse } = usePaginatedHero(Number(currentPage), Number(limit), category);
  const { data: summary } = useHeroSummary();

  const handleChangeCategory = (tab: string, category: string) => {
    searchParams.set('category', category);
    searchParams.set('page', '1');
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  }

  return (
    <>
      <>
        <CustomJumbotron
          title="Superhero Universe"
          description="Discover, explore, and manage your favorite superheroes and villains" />
        <CustomBreadcrumb currentPage="Superheroes" />
        <HeroStats />

        {/* Tabs */}
        <Tabs value={activeTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              onClick={() => handleChangeCategory('all', 'all')}
              value="all">
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleChangeCategory('favorites', 'favorites')}
              value="favorites"
              className="flex items-center gap-2">
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleChangeCategory('heroes', 'hero')}
              value="heroes">
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleChangeCategory('villains', 'villain')}
              value="villains">
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
          <TabsContent value='favorites'>
            <HeroGrid heroes={favorites} />
          </TabsContent>
          <TabsContent value='heroes'>
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
          <TabsContent value='villains'>
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
        </Tabs>

        <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
      </>
    </>
  )
}