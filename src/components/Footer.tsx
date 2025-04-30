import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Container } from "@/components/Container";
import { MainRoutes } from "@/lib/helper";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`transition-transform duration-200 hover:scale-125 ${hoverColor}`}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="hover:underline text-gray-300 hover:text-white text-sm transition-colors"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <div className="w-full bg-black text-gray-300 py-10 border-t-4 border-transparent bg-gradient-to-r from-orange-400 via-violet-500 to-teal-400">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl text-white tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {MainRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-xl text-white tracking-wide mb-4">About Us</h3>
            <p className="leading-relaxed text-sm text-gray-400">
              We help you unlock your full potential with AI-powered tools. Improve your interview skills and success rate with our smart platform.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-xl text-white tracking-wide mb-4">Services</h3>
            <ul className="space-y-2">
              <FooterLink to="/services/interview-prep">Interview Preparation</FooterLink>
              <FooterLink to="/services/career-coaching">Career Coaching</FooterLink>
              <FooterLink to="/services/resume-building">Resume Building</FooterLink>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-xl text-white tracking-wide mb-4">Stay Updated</h3>
            <p className="mb-3 text-sm text-orange-300">Get interview tips and updates straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md text-black w-full focus:outline-none"
              />
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition-transform hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} AI Interviews Copilot. All rights reserved.</p>
          <div className="flex gap-4">
            <SocialLink href="https://facebook.com" icon={<FaFacebookF size={20} />} hoverColor="text-blue-600" />
            <SocialLink href="https://twitter.com" icon={<FaTwitter size={20} />} hoverColor="text-blue-400" />
            <SocialLink href="https://instagram.com" icon={<FaInstagram size={20} />} hoverColor="text-pink-500" />
            <SocialLink href="https://linkedin.com" icon={<FaLinkedinIn size={20} />} hoverColor="text-blue-700" />
          </div>
        </div>
      </Container>
    </div>
  );
};
