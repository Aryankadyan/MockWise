import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/layouts/public-layout"
import Home from "@/routes/Home"
import AuthenticationLayout from "@/layouts/auth-layout"
import { SignInPage } from "./routes/SignIn"
import { SignUpPage } from "./routes/SignUp"
import ProtectRoutes from "@/layouts/protected-routes"
import { MainLayout } from "@/layouts/main-layout"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* authentication layout */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectRoutes>
              <MainLayout />
            </ProtectRoutes>
          }
        >
        {/* Add all the protect routes */}

        </Route>
      </Routes>
    </Router>
  )
}

export default App

