import {Footer} from "@/components/Footer"
import Header from "@/components/Header"
import { Container } from "@/components/Container"
import { Outlet } from "react-router-dom"

export const MainLayout = () => { 
  return (
   <div className="flex flex-col h-screen">
      {/* Header */}
      <Header/>

      <Container className="flex-grow">
        <main className="flex-grow">
      <Outlet/>
        </main>
      </Container>


      <Footer />
    </div> 
  )
}