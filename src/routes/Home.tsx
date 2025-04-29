// import { Container } from "@/components/Container"

// const Home = () => {
//   return (
 //    <div className="flex-col w-full pb-24">
 //      <Container>
 //        <div className="my-8">
 //          <h2 className="text-3xl text-center md:text-left md:text-6xl">
 //            <span className="text-outline font-extrabold md:text-8xl">
 //              AI Superpower
 //            </span>
 //            <span className="text-slate-400 font-extrabold">
 //              - A better way to
 //            </span>
 //            <br/>
 //            improve your interview chances and skills
 //          </h2>
 //          <p className="mt-4 text-muted-foreground text-sm">
 //  //           Boost your interview skills and increase your success rate with our AI-powered platform. 
 //            Discover a smarter way to prepare, practice and stand out in the competitive job market.
 //          </p>
 //        </div>
// 
  //       <div className="flex w-full items-center justify-evenly md:px-12 md:py-12">
  //         <p className="text-3xl font-semibold text-teal-400 text-center">
  //           100k+
  //           <span className="block text-xl text-muted-foreground font-normal">
  //             Offers Recieved
 //            </span>
 //          </p>
 //          <p className="text-3xl font-semibold text-teal-400 text-center">
  //           1.1M+
 //            <span className="block text-xl text-muted-foreground font-normal">
 //              Interview Aced
 //            </span>
 //          </p>
 //        </div>
 //      </Container>
 //    </div>
//   )
// }

// export default Home

import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col w-full pb-24 bg-white text-slate-900">
      <Container>
        <div className="my-16">
          <h2 className="text-center md:text-left text-4xl md:text-6xl font-semibold leading-tight">
            <span className="bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent font-extrabold md:text-7xl">
              AI Superpower
            </span>
            <span className="text-slate-500 font-bold"> – A better way to</span>
            <br />
            <span className="text-slate-800">improve your interview chances and skills</span>
          </h2>

          <p className="mt-6 text-slate-600 text-base md:text-lg max-w-2xl">
            Boost your interview skills and increase your success rate with our AI-powered platform.
            Discover a smarter way to prepare, practice, and stand out in the competitive job market.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center md:px-12 md:py-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-500">100k+</p>
            <p className="text-lg text-slate-500">Offers Received</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-500">1.1M+</p>
            <p className="text-lg text-slate-500">Interviews Aced</p>
          </div>
        </div>

        {/* image section */}
        <div className="w-full mt-4 rounded-xl bg-gray-100 h-[400px] drop-shadow-md overflow-hidden relative">
          <img
          src="/assets/img/hero.jpg"
          alt=""
          className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 px-4 py-3 rounded-md bg-white/40 backdrop-blur-md">
          Interviews Copilot&copy
          </div>
          
          <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-2 rounded-md bg-white/60 backdrop-blur-md">
          <h2 className="text-neutral-800 font-semibold">Developer</h2>
          <p className="text-sm text-neutral-500">
            "I used AI Superpower to prepare for my interviews, 
            and it made a huge difference. I felt more confident 
            and was able to answer questions more effectively. 
            I got the job!"
          </p>
          <Button className="mt-4">
            Generate <Sparkles />
          </Button>
          </div>
        </div>
      </Container>

      {/* marquee section */}


    </div>
  )
}

export default Home;
