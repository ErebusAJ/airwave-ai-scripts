import React, { useState, ChangeEvent, FormEvent } from 'react';

const useCaseOptions = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'Website', 'Other'];

// Function to simulate API call
async function submitSignUpData(email: string, useCaseDetails: string): Promise<void> {
  const response = await fetch('http://localhost:8080/v1/beta/access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, use_case: useCaseDetails }),
  });
  if (!response.ok) {
    throw new Error('Sign up failed');
  }
  console.log('Sign up successful');
}

const SignUpSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [otherUseCase, setOtherUseCase] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseCaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUseCase(value);
    if (value !== 'Other') {
      setOtherUseCase(''); // Clear otherUseCase if a predefined option is selected
      setError(null); // Clear error related to other use case
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!useCase) {
      setError('Please select a use case.');
      return;
    }
    if (useCase === 'Other' && !otherUseCase.trim()) {
      setError('Please specify your use case.');
      return;
    }

    const finalUseCase = useCase === 'Other' ? otherUseCase.trim() : useCase;

    try {
      await submitSignUpData(email, finalUseCase);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <section className="py-16 px-6 bg-white" id="sign-up">
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
            <p className="text-xl text-black font-medium">Thanks for signing up!</p>
            <p className="text-gray-500 mt-2">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[70%] px-4 py-3  text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className={`w-[30%] px-4 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-black ${useCase === '' ? 'text-gray-500' : 'text-black'}`}
                value={useCase}
                onChange={handleUseCaseChange}
              >
                <option value="" disabled hidden>Select your primary use case</option>
                {useCaseOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {useCase === 'Other' && (
              <input
                type="text"
                placeholder="Please specify your use case"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black mt-2"
                value={otherUseCase}
                onChange={(e) => setOtherUseCase(e.target.value)}
              />
            )}
            {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            <button 
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-md font-medium transition-all hover:bg-white hover:text-black hover:border-black border-2 border-black w-full sm:w-auto mt-2"
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
