
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Card, CardContent } from './ui/card';

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState("youtube");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cardRef.current) {
          cardRef.current.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-48 px-6 bg-[#121212] flex items-center justify-center relative z-10"
    >
      <Card 
        ref={cardRef}
        className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full fade-in-up card-hover"
      >
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Ready to Create Your First Script?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram Reel</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input 
                placeholder="Enter video title..." 
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="300">5 minutes</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age Group</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              >
                <option value="all">All Ages</option>
                <option value="kids">Kids (8-12)</option>
                <option value="teens">Teens (13-17)</option>
                <option value="young-adults">Young Adults (18-24)</option>
                <option value="adults">Adults (25-45)</option>
                <option value="seniors">Seniors (45+)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Input 
                placeholder="Enter tags separated by commas..." 
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <Input 
                type="text" 
                placeholder="Enter your topic or idea here..." 
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Additional Information</label>
          <Textarea 
            placeholder="Add any specific requirements or details for your script..." 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
            rows={4}
          />
        </div>
        
        <div className="flex justify-center">
          <button className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden">
            <span className="relative z-10">Generate Script</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full hover:animate-shine"></span>
          </button>
        </div>
        
        <p className="text-gray-500 mt-6 text-sm text-center">
          No credit card required. Try it out instantly.
        </p>
      </Card>
    </section>
  );
};

export default TryItOutSection;
