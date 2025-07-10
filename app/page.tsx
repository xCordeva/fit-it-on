"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Shield,
  Users,
  CheckCircle,
  Star,
  Smile,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      <main className="relative container mx-auto px-4 py-16 z-0">
        {/* Hero Section */}
        <div>
          <img
            src="/clothes/hanger.webp"
            alt="dress"
            className="h-20 absolute top-[2%] left-[30%] rotate-[-15deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/dress.webp"
            alt="dress"
            className="h-40 absolute top-[22%] left-[0%] rotate-[-15deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/hoodie.webp"
            alt="hoodie"
            className="h-40 absolute top-[20%] left-[90%] rotate-[25deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/jacket.webp"
            alt="jacket"
            className="h-40 absolute top-[70%] left-[10%] rotate-[8deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/pants.webp"
            alt="pants"
            className="h-40 absolute top-[60%] left-[75%] rotate-[-22deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/tie.webp"
            alt="tie"
            className="h-20 absolute top-[44%] left-[95%] rotate-[35deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/socks.webp"
            alt="tie"
            className="h-20 absolute top-[49%] left-[5%] rotate-[0deg] opacity-100 z-[-1]"
          />
          <img
            src="/clothes/beanie.webp"
            alt="tie"
            className="h-20 absolute top-[94%] left-[100%] rotate-[30deg] opacity-100 z-[-1]"
          />
        </div>
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Virtual Try-On
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fit It On
              <span className="block bg-primary bg-clip-text text-transparent">
                Buy with Confidence
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Upload your photo and any clothing item to see how it looks on
              you.
            </p>

            <div className="flex flex-col items-start gap-2 mb-2">
              <Button variant="cool" asChild size="lg">
                <Link href="/app">Get Started Now</Link>
              </Button>
              <p className="text-xs text-gray-500">
                Try it for free — no sign up required
              </p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md h-96 bg-gray-200 rounded-xl">
              {/* Placeholder */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FitItOn.app?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-white" />,
                title: "Lightning Fast",
                description:
                  "Try on clothes virtually in just seconds, thanks to our fast and efficient AI.",
              },
              {
                icon: <Shield className="h-6 w-6 text-white" />,
                title: "Privacy First",
                description:
                  "Your photos are processed securely and never shared with third parties.",
              },
              {
                icon: <Users className="h-6 w-6 text-white" />,
                title: "User-Focused",
                description:
                  "Join real people using virtual try-ons to find what suits them best.",
              },
            ].map(({ icon, title, description }, i) => (
              <div key={i} className="text-center p-6 ">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEW: Before & After Section */}
        <section className="mb-24 text-center relative z-20">
          {" "}
          {/* Ensure content is above background */}
          <h2 className="text-3xl font-bold mb-6">
            See the Transformation in Seconds!
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience the magic of virtual try-on: from your photo to a perfect
            fit with just a click.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Before Image */}
            <div className="flex flex-col items-center">
              <Image
                src="/before.png" // Placeholder image
                alt="Before Try-On"
                width={300}
                height={300}
                className="rounded-xl shadow-lg border-2 border-gray-200 object-cover"
              />
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Your Photo
              </p>
            </div>

            {/* Transition Indicator */}
            <div className="flex flex-col items-center justify-center text-gray-500 text-center md:text-left">
              <ArrowRight className="h-12 w-12 text-primary rotate-90 md:rotate-0 mb-4 md:mb-0" />
              <p className="text-sm font-medium">
                Just a click & a few seconds!
              </p>
            </div>

            {/* After Image */}
            <div className="flex flex-col items-center">
              <Image
                src="/after.png" // Placeholder image
                alt="After Try-On"
                width={300}
                height={300}
                className="rounded-xl shadow-lg border-2 border-primary object-cover"
              />
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Your New Look
              </p>
            </div>
          </div>
        </section>
        {/* Premium Section */}
        <section className="mb-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Upgrade to <span className="text-[#facc15]">Premium</span>
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Unlock more try-ons, priority AI processing, and early access to new
            features.
          </p>
          <Button
            variant="cool"
            asChild
            size="lg"
            className="bg-[#facc15] text-black  
            border-black"
          >
            <Link href="/pricing">View Premium Plans</Link>
          </Button>
        </section>

        {/* CTA Final Section */}
        <section className="text-center bg-primary text-white p-12 rounded-2xl mb-24">
          <h2 className="text-3xl font-bold mb-4">
            Try Fit It On Today — It’s Free!
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Discover how AI is transforming the way we shop.
          </p>
          <Button
            variant="cool"
            asChild
            size="lg"
            className="bg-white hover:bg-white"
          >
            <Link href="/app" className="text-black border-black">
              Get Started
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600 border-1 border-t-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:underline">
              Terms of Use
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} FitItOn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
