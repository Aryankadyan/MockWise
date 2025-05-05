import { Container } from "@/components/Container";
import { MarqueImg } from "@/components/marquee-img";
import { Button } from "@/components/ui/button";
import { Quote, Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { FaChartLine, FaRegComment, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col w-full pb-24 bg-white text-slate-900">
      {/* Hero Section */}
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

        {/* Image Section */}
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

            <Button className="mt-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white hover:scale-105 transition-transform">
              Generate <Sparkles className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </Container>

      {/* 1. Marquee Section */}
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

      {/* 3. Features Section */}
      <div className="flex flex-col w-full pb-24 bg-white text-slate-900">
        <Container className="py-12 space-y-10">
          <h2 className="tracking-wide text-2xl md:text-3xl font-bold text-slate-800 text-center md:text-left leading-snug">
            Key Features of <span className="text-teal-500">AI Superpower</span>
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            {/* Feature 1 */}
            <div className="feature-card transform transition-all hover:scale-105 hover:shadow-xl hover:bg-teal-100 rounded-lg p-6 bg-white shadow-lg hover:text-teal-500 hover:border-teal-500 border-2 border-transparent flex flex-col items-center space-y-4">
              <FaStar className="text-4xl text-teal-400" />
              <h3 className="text-xl font-semibold">Personalized Feedback</h3>
              <p className="text-slate-600 text-center">
                Receive real-time feedback on your interview performance based on AI analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card transform transition-all hover:scale-105 hover:shadow-xl hover:bg-purple-100 rounded-lg p-6 bg-white shadow-lg hover:text-purple-500 hover:border-purple-500 border-2 border-transparent flex flex-col items-center space-y-4">
              <FaRegComment className="text-4xl text-purple-400" />
              <h3 className="text-xl font-semibold">AI-Powered Question Generator</h3>
              <p className="text-slate-600 text-center">
                Practice with questions tailored to your job role and industry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card transform transition-all hover:scale-105 hover:shadow-xl hover:bg-yellow-100 rounded-lg p-6 bg-white shadow-lg hover:text-yellow-500 hover:border-yellow-500 border-2 border-transparent flex flex-col items-center space-y-4">
              <FaChartLine className="text-4xl text-yellow-400" />
              <h3 className="text-xl font-semibold">Comprehensive Report</h3>
              <p className="text-slate-600 text-center">
                Get a detailed report with insights and areas for improvement after every mock interview.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Centered Image Below Heading */}
      <div className="w-full flex justify-center mb-8">
        <img
          src="/assets/img/office.jpg"
          alt="Office environment"
          className="rounded-xl shadow-lg w-full max-w-md md:max-w-lg h-auto max-h-64 object-cover"
        />
      </div>

      <style>{`
          .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          }
          .feature-card:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        `}</style>

      {/* 4. Call to Action Section */}
      <div className="flex flex-col w-full pb-24 bg-white text-slate-900">
        <Container className="py-16 space-y-11 text-center bg-gradient-to-r from-teal-100 to-purple-100 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            Ready to take your interview skills to the next level?
          </h2>
          <Link to="/generate" className="w-full">
            <Button className="py-4 px-10 text-lg font-semibold bg-gradient-to-r from-violet-400 to-emerald-400 text-white shadow-xl hover:scale-105 hover:shadow-2xl hover:translate-y-1 transition-all duration-300 ease-in-out transform">
              Start Your Journey
              <Sparkles className="ml-2 w-5 h-5 animate-pulse" />
            </Button>
          </Link>
        </Container>
      </div>
    </div>

  );
};

export default Home;

