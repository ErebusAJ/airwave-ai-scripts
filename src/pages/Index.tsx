
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
  // Function to animate elements on scroll with parallax effect
  useEffect(() => {
    // Initialize scroll observers for parallax effects
    const initScrollObservers = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      };
  
      // Create observer for fade-up animations
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            
            // Add a slight delay based on index for child elements if needed
            if (entry.target.hasAttribute('data-stagger')) {
              const children = entry.target.children;
              Array.from(children).forEach((child, index) => {
                (child as HTMLElement).style.transitionDelay = `${index * 100}ms`;
                child.classList.add('in-view');
              });
            }
            
            fadeObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);
  
      // Find all elements with data-scroll attribute
      const scrollElements = document.querySelectorAll('[data-scroll]');
      scrollElements.forEach(el => {
        // Apply base animation classes
        el.classList.add('fade-in-up');
        fadeObserver.observe(el);
      });

      // Regular fade animations
      const fadeElements = document.querySelectorAll(".fade-in-up:not([data-scroll])");
      fadeElements.forEach(el => fadeObserver.observe(el));

      // Handle parallax effect on scroll
      const handleParallax = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.2');
          const offset = scrollY * speed;
          (element as HTMLElement).style.transform = `translateY(${offset}px)`;
        });
      };

      // Add scroll listener for parallax
      window.addEventListener('scroll', handleParallax, { passive: true });
      
      // Initial call to set positions
      handleParallax();

      // Clean up
      return () => {
        fadeElements.forEach(el => fadeObserver.unobserve(el));
        scrollElements.forEach(el => fadeObserver.unobserve(el));
        window.removeEventListener('scroll', handleParallax);
      };
    };

    // Wait a bit before initializing to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initScrollObservers();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
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
