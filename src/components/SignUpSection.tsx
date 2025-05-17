
import React, { useState } from 'react';

const SignUpSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In a real app, you would send this to your backend
      console.log('Signup with email:', email);
    }
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold mb-6 text-black">Join 500+ Creators in Beta</h2>
        <p className="text-gray-600 mb-8">Be among the first to access our full suite of AI script and voice tools.</p>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-medium">Thanks for signing up!</p>
            <p className="text-gray-500 mt-2">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-md font-medium transition-all hover:bg-white hover:text-black hover:border-black border-2 border-black"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default SignUpSection;
