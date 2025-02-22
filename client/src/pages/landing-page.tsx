import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

import { ShieldCheck, Brain, Zap } from "lucide-react";

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
                Welcome to PlagiCheck
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
              Why Choose PlagiCheck?
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

        {/* Powerful Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Powerful Features
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Everything you need to maintain academic integrity
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Plagiarism Detection</h3>
                <p className="text-gray-600">Advanced algorithms to detect content similarity across documents</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Content Detection</h3>
                <p className="text-gray-600">Identify AI-generated content using state-of-the-art analysis</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Analysis</h3>
                <p className="text-gray-600">Get instant results with detailed reports and insights</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 PlagiCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
