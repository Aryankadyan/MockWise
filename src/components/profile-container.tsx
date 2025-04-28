import { useAuth, UserButton } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"


export const ProfileContainer = () => {

    const {isSignedIn, isLoaded} = useAuth()

    if(!isLoaded){
        return (
            <div className="flex items-center">
                <Loader className="min-w-4 min-h-4 animate-spin text-emerald-400" /> 
            </div>
        )
    }

  return (
    <div className="flex items-center gap-5">
        {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
        ) : (
        <Link to={"/signin"}>
        <Button size={"sm"}>Get Started</Button>
        </Link>
        )}
    </div>
  )
}

