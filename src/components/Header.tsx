import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./Container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";

const Header = () => {
  const { userId } = useAuth()

  return (
    <header
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logo section */}
          <LogoContainer />
          {/* navigation section */}
         <NavigationRoutes/>

          {/* profile section */}

        </div>
      </Container>
    </header>

  )
}

export default Header