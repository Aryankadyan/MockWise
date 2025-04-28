import { cn } from "@/lib/utils"; 
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./Container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import {ProfileContainer} from "./profile-container";
import { ToggleContainer } from "./toggle-container";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="pl-0 flex items-center gap-8 w-full h-20">
          {/* logo section */}
          <LogoContainer />

          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-6">
            <NavigationRoutes />
            {userId && (
              <NavLink 
              to={"/generate"}
              className={({ isActive }) =>
                cn(
                  "text-base text-neutral-500",
                  isActive && "text-neutral-800 font-semibold"
                )
                }
                >
                  Take an Interview
                </NavLink>
            )}
          </nav>

          {/* profile section */}
          <div className="ml-auto flex items-center gap-6">
            {/* profile section */}
            <ProfileContainer/>

            {/* mobile toggle section */}
            <ToggleContainer />

          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
