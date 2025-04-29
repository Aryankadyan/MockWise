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
import { MarqueImg } from "@/components/marquee-img";
import { Button } from "@/components/ui/button";
import { Quote, Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";


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
        <div className="flex w-full items-center justify-evenly md:px-10 md:py-10 md:items-center md:justify-end gap-14">
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-400">100k+</p>
            <p className="text-lg text-slate-500">Offers Received</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-500">1.1M+</p>
            <p className="text-lg text-slate-500">Interviews Aced</p>
          </div>
        </div>

        {/* 1. image section */}
        <div className="w-full mt-4 rounded-xl bg-gray-100 h-[500px] md:h-[550px] drop-shadow-md overflow-hidden relative">
          <img
            src="/assets/img/hero.jpg"
            alt="Interview Hero"
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />

          {/* Top-left badge */}
          <div className="absolute top-4 left-4 px-4 py-2 rounded-md bg-white/40 backdrop-blur-md font-semibold text-white shadow-md z-20">
            Interviews Copilot &copy;
          </div>

          {/* Testimonial box */}
          <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-4 rounded-xl bg-white/60 backdrop-blur-md z-20 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/assets/img/hero.jpg"
                alt="User"
                className="w-10 h-10 rounded-full border border-white shadow"
              />
              <span className="text-sm font-medium text-neutral-800">
                Aryan Kadyan
              </span>
            </div>

            <Quote className="text-orange-500 w-5 h-5 mb-1" />

            <p className="text-sm text-neutral-600">
              "I used AI Superpower to prepare for my interviews. I felt confident, answered questions clearly, and got the job!"
            </p>

            <Button className="mt-3 bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-transform">
              Generate <Sparkles className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </Container>

      {/* 2. marquee section */}
      <div className="w-full my-12">
        <Marquee pauseOnHover>
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/zoom.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/tailwindcss.png" />
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/zoom.png" />
          <MarqueImg img="/assets/img/logo/tailwindcss.png" />
        </Marquee>
      </div>

      <Container className="py-12 space-y-10">
  <h2 className="tracking-wide text-2xl md:text-3xl font-bold text-slate-800 text-center md:text-left leading-snug">
    Unleash your potential with <span className="text-teal-500">personalized AI insights</span> and targeted interview practice.
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
    {/* Image Section */}
    <div className="col-span-1 md:col-span-3 rounded-lg overflow-hidden shadow-lg hover:scale-[1.02] transition-transform">
      <img
        src="/assets/img/office.jpg"
        alt="AI Office"
        className="w-full h-full max-h-96 object-cover"
      />
    </div>

    {/* Text & Button Section */}
    <div className="col-span-1 md:col-span-2 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 space-y-6">
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
        Transform the way you prepare, gain confidence, and boost your chances of landing your dream job.
        Let <span className="text-purple-500 font-medium">AI</span> be your edge in today’s competitive job market.
      </p>

      <Link to="/generate" className="w-full">
        <Button className="w-3/4 py-5 text-lg font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-md hover:scale-110 transition-transform duration-300">
          Generate <Sparkles className="ml-2" />
        </Button>
      </Link>
    </div>
  </div>
</Container>


    </div>
  )
}

export default Home;