import { useParams } from "react-router"

export const HeroPage = () => {

  const { slug = '' } = useParams();

  console.log(slug)

  return (
    <div>HeroPage</div>
  )
}