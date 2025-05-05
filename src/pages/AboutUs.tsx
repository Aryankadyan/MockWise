

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-slate-800 via-gray-800 to-gray-900 text-white min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-10 text-center text-teal-400">
          About Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-300">
              Welcome to our platform — where innovation meets real impact. We’re a passionate team building tools that transform how people prepare for interviews and succeed in their careers.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Whether you're a student, a job seeker, or a career switcher, our mission is to make preparation easy, data-driven, and personalized — powered by AI and human insight.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              With every feature we build, we focus on clarity, simplicity, and helping you feel confident when it matters most.
            </p>
          </div>

          <img
            src="/assets/img/about.jpg" 
            alt="About us"
            className="rounded-2xl shadow-lg transform hover:scale-105 transition duration-300"
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold text-teal-300 mb-4">Our Mission</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Empower every individual to prepare smarter and present their best self — through cutting-edge tools, rich analytics, and a supportive community.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUs


