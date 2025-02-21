import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

const features = [
  "AI-Powered Plagiarism Detection",
  "Easy Assignment Submission",
  "Real-time Progress Tracking",
  "Secure and User-friendly Interface",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Transform Your Teaching Experience
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline assignment management with powerful AI-assisted tools for plagiarism detection
                and automated analysis.
              </p>
              <Link href="/auth">
                <Button size="lg" className="rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose EduAssign?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start space-x-4 p-6 rounded-lg border bg-white shadow-sm"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 EduAssign. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
