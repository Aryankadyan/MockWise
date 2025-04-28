import { MainRoutes } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

export const NavigationRoutes = ({ isMobile = false }: NavigationRoutesProps) => {
  return (
    <ul
      className={cn(
        "flex items-center gap-6",
        isMobile && "flex-col items-start gap-8"
      )}
    >
      {MainRoutes.map((route) => (
        <li key={route.href}>
          <NavLink
            to={route.href}
            className={({ isActive }) =>
              cn(
                "text-base text-neutral-500 hover:text-neutral-800 transition-colors",
                isActive && "text-neutral-800 font-semibold"
              )
            }
          >
            {route.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};


