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
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">PlagiCheck</span>
            </Link>

            <div className="hidden md:flex space-x-4 ml-8">
              <Link href="/" className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-black hover:text-primary transition-colors font-medium tracking-wide">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link href="/about" className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-black hover:text-primary transition-colors font-medium tracking-wide">
                <Info className="h-4 w-4 mr-2" />
                About
              </Link>
              <Link href="/ai-detector" className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-black hover:text-primary transition-colors font-medium tracking-wide">
                <Bot className="h-4 w-4 mr-2" />
                AI Detector
              </Link>
              <Link href="/qr-code" className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-black hover:text-primary transition-colors font-medium tracking-wide">
                <QrCode className="h-4 w-4 mr-2" />
                QR Upload
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