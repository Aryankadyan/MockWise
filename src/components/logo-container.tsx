import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src="/assets/log/MockWise.png"
        alt="MockWise logo"
        className="h-14"
      />
    </Link>
  );
};

  