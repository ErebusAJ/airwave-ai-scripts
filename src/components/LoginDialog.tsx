import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LoginDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSignUpBetaClick = () => {
    setOpen(false);
    // Use a short timeout to allow the dialog to start closing before scrolling.
    // This can help make the transition smoother.
    setTimeout(() => {
      const betaSection = document.getElementById("sign-up");
      if (betaSection) {
        betaSection.scrollIntoView({ behavior: "smooth" });
      } else {
        // Log a warning if the target section is not found
        console.warn(
          "Element with ID 'beta-signup-section' not found. Cannot scroll to beta sign up."
        );
      }
    }, 150); // 150ms delay, adjust if needed
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#F5F5F5] text-[#121212] px-8 py-3 rounded-md font-medium transition-all hover:bg-[#121212] hover:text-[#F5F5F5] hover:border-[#F5F5F5] border-2 border-[#F5F5F5]"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#121212] text-[#F5F5F5] border border-[#333]">
        <DialogHeader>
          {/* Updated title and description for login-only */}
          <DialogTitle className="text-2xl font-semibold text-center">
            Login
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 pt-1"> {/* Optional: Added pt-1 for slight space from title */}
            Access your account to continue.
          </DialogDescription>
        </DialogHeader>

        {/* 
          Form content container.
          "pt-6" provides top padding, separating it from the DialogHeader.
          "space-y-4" provides vertical spacing between major form blocks.
        */}
        <div className="pt-6 space-y-4">
          <div className="space-y-2"> {/* Email input block */}
            <Label htmlFor="email-login" className="text-[#F5F5F5]">
              Email
            </Label>
            <Input
              id="email-login"
              placeholder="Email address"
              className="bg-[#222] border-[#333] text-[#F5F5F5]"
              type="email" // Added type="email" for better semantics
            />
          </div>

          <div className="space-y-2"> {/* Password input block */}
            <div className="flex items-center justify-between">
              <Label htmlFor="password-login" className="text-[#F5F5F5]">
                Password
              </Label>
              <Button variant="link" className="text-xs text-[#9b87f5] p-0 h-auto"> {/* h-auto to ensure proper sizing */}
                Forgot password?
              </Button>
            </div>
            <Input
              id="password-login"
              type="password"
              placeholder="Enter your password"
              className="bg-[#222] border-[#333] text-[#F5F5F5]"
            />
            {/* Action text added below password input */}
            <p
              className="text-xs text-center text-[#9b87f5] cursor-pointer hover:underline"
              onClick={handleSignUpBetaClick}
            >
              Don't have an account? Sign up for beta here!
            </p>
          </div>

          <Button
            type="submit" // Good practice for form buttons
            className="w-full bg-[#F5F5F5] text-[#121212] hover:animate-shine animate-shine hover:bg-[#F5F5F5]"
          >
            Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;