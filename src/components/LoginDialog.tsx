
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserPlus } from "lucide-react";

const LoginDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F5F5F5] text-[#121212] px-4 py-2 rounded hover:bg-opacity-90 transition-all">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#121212] text-[#F5F5F5] border border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">Welcome</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#222]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#F5F5F5]">
              <User className="mr-2 h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#F5F5F5]">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F5F5]">Email</Label>
              <Input
                id="email"
                placeholder="Email address"
                className="bg-[#222] border-[#333] text-[#F5F5F5]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#F5F5F5]">Password</Label>
                <Button variant="link" className="text-xs text-[#9b87f5] p-0">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-[#222] border-[#333] text-[#F5F5F5]"
              />
            </div>
            <Button className="w-full bg-[#F5F5F5] text-[#121212] hover:animate-shine animate-shine hover:bg-[#F5F5F5]">
              Sign In
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-[#F5F5F5]">Full Name</Label>
              <Input
                id="signup-name"
                placeholder="Enter your name"
                className="bg-[#222] border-[#333] text-[#F5F5F5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-[#F5F5F5]">Email</Label>
              <Input
                id="signup-email"
                placeholder="Email address"
                className="bg-[#222] border-[#333] text-[#F5F5F5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-[#F5F5F5]">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                className="bg-[#222] border-[#333] text-[#F5F5F5]"
              />
            </div>
            <Button className="w-full bg-[#F5F5F5] text-[#121212] hover:animate-shine animate-shine hover:bg-[#F5F5F5]">
              Create Account
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
