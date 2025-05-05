
import { FaRobot, FaChalkboardTeacher, FaChartLine, FaRegLightbulb, FaArrowUp } from 'react-icons/fa';

const services = [
  {
    title: 'AI-Powered Mock Interviews',
    description: 'Simulate real-world interviews using cutting-edge AI models tailored to your role and experience level.',
    icon: <FaRobot size={30} className="text-teal-600" />,
  },
  {
    title: 'Expert Feedback',
    description: 'Receive actionable insights and improvement tips after each mock to boost your performance.',
    icon: <FaChalkboardTeacher size={30} className="text-teal-600" />,
  },
  {
    title: 'Performance Analytics',
    description: 'Track your progress over time with charts and performance breakdowns across key metrics.',
    icon: <FaChartLine size={30} className="text-teal-600" />,
  },
  {
    title: 'Personalized Preparation',
    description: 'Get customized questions and resources based on your skill level, goals, and job preferences.',
    icon: <FaRegLightbulb size={30} className="text-teal-600" />,
  },
];

const Services = () => {
  return (
    <section className="bg-white text-gray-800 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">Our Services</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          We offer tools and insights designed to help you excel in interviews. Whether you're just starting out or preparing for senior roles, our platform adapts to your needs.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 bg-white transform hover:scale-105 text-left"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-teal-700">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-teal-50 p-10 rounded-xl shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-teal-700">Ready to level up your interview skills?</h3>
          <p className="mb-6 text-gray-700">Try a free mock session today and discover where you stand.</p>
          <a href="/signup" className="inline-block bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition duration-300">
            Get Started
          </a>
        </div>
      </div>

      {/* Scroll to Top */}
      <div className="fixed bottom-8 right-8">
        <button
          title="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition duration-300">
          <FaArrowUp />
        </button>
      </div>
    </section>
  );
};

export default Services;

