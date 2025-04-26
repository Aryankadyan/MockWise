import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link to={"/"}>
        <img
          src="/assets/svgs/MockWise.png"
          alt="MockWise logo"
          className="h-14"
        />
      </Link>

        <div className="flex gap-4"></div>
      </div>
    </header>
    )
  }
 