import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";

export const LogoContainer = () => {
  const {theme} = useTheme()
  return (
    <Link to={"/"}>
      <img
        src={theme === "dark" ? "/assets/log/MockWise.png" : "/assets/log/MockWise.png"}
        alt="MockWise logo"
        className="h-14"
      />
    </Link>
 ); 
};



