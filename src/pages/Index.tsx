
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TryItOutSection from "../components/TryItOutSection";
import CoreBenefits from "../components/CoreBenefits";
import HowItWorks from "../components/HowItWorks";
import FeatureSection from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import SignUpSection from "../components/SignUpSection";
import Footer from "../components/Footer";

const Index = () => {
  // Function to animate elements on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in-up");
    fadeElements.forEach(el => observer.observe(el));

    return () => {
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <TryItOutSection />
      <CoreBenefits />
      <HowItWorks />
      <FeatureSection />
      <PricingSection />
      <TestimonialsSection />
      <SignUpSection />
      <Footer />
    </div>
  );
};

export default Index;
