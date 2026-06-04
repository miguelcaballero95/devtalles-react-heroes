import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { useState } from "react"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumb } from "@/components/custom/CustomBreadcrumb"
import { useQuery } from "@tanstack/react-query"
import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.action"

export const HomePage = () => {

  const [activeTab, setActiveTab] = useState('all');

  const { data: heroesResponse } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => getHeroesByPageAction(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

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
            <TabsTrigger onClick={() => setActiveTab('all')} value="all">All Characters (16)</TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('favorites')} value="favorites" className="flex items-center gap-2">
              Favorites (3)
            </TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('heroes')} value="heroes">Heroes (12)</TabsTrigger>
            <TabsTrigger onClick={() => setActiveTab('villains')} value="villains">Villains (2)</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
          <TabsContent value='favorites'>
            <HeroGrid heroes={[]} />
          </TabsContent>
          <TabsContent value='heroes'>
            <HeroGrid heroes={[]} />
          </TabsContent>
          <TabsContent value='villains'>
            <HeroGrid heroes={[]} />
          </TabsContent>
        </Tabs>
        <CustomPagination totalPages={8} />
      </>
    </>
  )
}