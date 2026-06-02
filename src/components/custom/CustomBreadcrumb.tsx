import { Link } from "react-router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"

interface Breadcrumb {
  to: string;
  label: string;
}

interface Props {
  currentPage: string;
  breadcrumbs?: Breadcrumb[]
}

export const CustomBreadcrumb = ({ currentPage, breadcrumbs = [] }: Props) => {
  return (
    <Breadcrumb className="my-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map(crumb => (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={crumb.to}>
                {crumb.label}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}