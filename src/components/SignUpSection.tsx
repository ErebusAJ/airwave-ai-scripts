import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useError, ErrorProvider } from '../context/ErrorContext'; // Adjusted path
import ApiError from './ui/ApiError'; // Import the display component

const useCaseOptions = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'Website', 'Other'];

// Function to simulate API call
async function submitSignUpData(email: string, useCaseDetails: string): Promise<void> {
  const response = await fetch('https://scriptecho.onrender.com/v1/beta/access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, use_case: useCaseDetails }),
  });
  if (!response.ok) {
    // Try to parse a meaningful error message from the backend
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || 'Sign up failed due to a server error.';
    throw new Error(message);
  }
}

const SignUpContent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [otherUseCase, setOtherUseCase] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useError(); // Use the global error handler for API errors

  const handleUseCaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUseCase(value);
    if (value !== 'Other') {
      setOtherUseCase(''); // Clear otherUseCase if a predefined option is selected
      setValidationError(null); // Clear error related to other use case
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null); // Clear previous validation errors

    if (!email) {
      setValidationError('Email is required.');
      return;
    }
    if (!useCase) {
      setValidationError('Please select a use case.');
      return;
    }
    if (useCase === 'Other' && !otherUseCase.trim()) {
      setValidationError('Please specify your use case.');
      return;
    }

    const finalUseCase = useCase === 'Other' ? otherUseCase.trim() : useCase;

    setIsLoading(true);
    try {
      await submitSignUpData(email, finalUseCase);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      // Use the global, themed error prompt for API errors
      showError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
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
            {validationError && <p className="text-red-500 text-sm mt-2 text-left">{validationError}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-8 py-3 rounded-md font-medium transition-all hover:bg-white hover:text-black hover:border-black border-2 border-black w-full sm:w-auto mt-2 flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const SignUpSection: React.FC = () => {
  return (
    <ErrorProvider>
      <SignUpContent />
      <ApiError />
    </ErrorProvider>
  )
}

export default SignUpSection;
