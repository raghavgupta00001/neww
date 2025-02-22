import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { GraduationCap, Home, Info, Bot, QrCode } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="PlagiCheck" className="h-8" />
              <span className="text-xl font-bold text-[#1a75ff]">PlagiCheck</span>
            </Link>

            <div className="hidden md:flex space-x-4 ml-8">
              <Link href="/">
                <Button variant="ghost" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Button>
              </Link>
              <Link href="/ai-detector">
                <Button variant="ghost" className="flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Detector
                </Button>
              </Link>
              <Link href="/qr-code">
                <Button variant="ghost" className="flex items-center">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Upload
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}