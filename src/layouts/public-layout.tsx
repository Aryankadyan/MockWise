import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Outlet } from "react-router-dom"

export const PublicLayout = () => {
  return (
   <div className="w-full">
      {/* Handler to store the user data */}
      <AuthHandler/>
      <Header/>

      <Outlet/>

      <Footer/>
    </div>
  )
}


