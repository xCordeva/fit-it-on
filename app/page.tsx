import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import MainPageFaqs from "@/components/MainPageFaqs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      <main className="relative container mx-auto px-4 py-16 z-0">
        {/* Hero Section */}
        <div>
          <img
            src="/clothes/hanger.webp"
            alt="hanger"
            className="h-20 absolute top-[2%] left-[30%] rotate-[-15deg] z-[-1]"
          />
          <img
            src="/clothes/dress.webp"
            alt="dress"
            className="h-40 absolute top-[22%] left-[4%] rotate-[-15deg] z-[-1]"
          />
          <img
            src="/clothes/hoodie.webp"
            alt="hoodie"
            className="h-30 md:h-40 absolute top-[18%] md:top-[20%] left-[62%] md:left-[80%] rotate-[25deg] z-[-1]"
          />
          <img
            src="/clothes/jacket.webp"
            alt="jacket"
            className="h-40 absolute top-[73%] md:top-[70%] left-[10%] rotate-[8deg] z-[-1]"
          />
          <img
            src="/clothes/pants.webp"
            alt="pants"
            className="h-40 absolute top-[60%] left-[72%] md:left-[75%] rotate-[-12deg] md:rotate-[-22deg] z-[-1]"
          />
          <img
            src="/clothes/tie.webp"
            alt="tie"
            className="h-20 absolute top-[40%] left-[80%] md:left-[82%] rotate-[35deg] z-[-1]"
          />
          <img
            src="/clothes/socks.webp"
            alt="socks"
            className="h-20 absolute top-[46%] md:top-[49%] left-[5%] rotate-[0deg] z-[-1]"
          />
          <img
            src="/clothes/beanie.webp"
            alt="beanie"
            className="h-20 absolute top-[90%] md:top-[85%] left-[70%] md:left-[87%] rotate-[30deg] z-[-1] object-contain"
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

            <div className="flex flex-col items-center md:items-start gap-2 mb-2">
              <Button variant="cool" asChild size="lg">
                <Link href="/studio">Get Started for Free</Link>
              </Button>
              <p className="text-xs text-gray-500">
                Try it for free — no sign up required
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end ">
            <div className="flex justify-center md:justify-end w-full">
              <video
                src="/hero-vid.mp4"
                className="w-full max-w-md h-auto bg-gray-200 rounded-xl shadow-lg object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <p className="text-center text-lg font-semibold text-gray-700 max-w-md px-5">
              Can you guess which one is{" "}
              <span className="text-primary">AI</span> and which is real?
            </p>
          </div>
        </section>

        {/* Before & After Section*/}
        <section className="mb-24 text-center relative z-20">
          <h2 className="text-3xl font-bold mb-6">
            See the Transformation in Seconds!
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience the magic of virtual try-on: from your photo to a perfect
            fit — all with just a click and a few seconds.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-4 lg:gap-8">
            {/* Input 1: Your Photo */}
            <div className="flex flex-col items-center">
              <Image
                src="/before.webp"
                alt="Your Photo"
                width={200}
                height={200}
                className="rounded-xl shadow-lg border-2 border-gray-200 object-cover"
              />
              <p className="mt-2 text-lg font-semibold text-gray-700">
                Your Photo
              </p>
            </div>

            {/* Transition 1: Plus Garment */}
            <div className="flex flex-col items-center justify-center text-gray-500 text-center md:text-left">
              <span className="text-3xl font-bold text-primary mb-0">+</span>
              <p className="text-sm font-medium">and</p>
            </div>

            {/* Input 2: The Garment */}
            <div className="flex flex-col items-center">
              <Image
                src="/garment.webp"
                alt="Your Garment"
                width={200}
                height={200}
                className="rounded-xl shadow-lg border-2 border-gray-200 object-cover"
              />
              <p className="mt-2 text-lg font-semibold text-gray-700">
                Your Garment
              </p>
            </div>

            {/* Transition 2: To Your New Look */}
            <div className="flex flex-col items-center justify-center text-gray-500 text-center md:text-left">
              <ArrowRight className="h-12 w-12 text-primary rotate-90 md:rotate-0 mb-0" />
              <p className="text-sm font-medium">in seconds!</p>
            </div>

            {/* Output: Your New Look */}
            <div className="flex flex-col items-center">
              <Image
                src="/after.webp"
                alt="After Try-On"
                width={200}
                height={200}
                className="rounded-xl shadow-lg border-2 border-primary object-cover"
              />
              <p className="mt-2 text-lg font-semibold text-gray-700">
                Your New Look
              </p>
            </div>
          </div>
        </section>
        <section className="mb-24 text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload Your Photo",
                desc: "Snap a clear, front-facing image or use one from your gallery.",
              },
              {
                step: "2",
                title: "Select a Garment",
                desc: "Choose a clothing item from our store or upload your own.",
              },
              {
                step: "3",
                title: "See the Result",
                desc: "In seconds, see how the garment looks on you using AI magic.",
              },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="text-left p-6 bg-white rounded-xl shadow">
                <div className="text-2xl font-bold text-primary mb-2">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
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
        <MainPageFaqs />
        {/* CTA Final Section */}
        <section className="text-center bg-primary text-white p-12 rounded-2xl mb-14">
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
            <Link href="/studio" className="text-black border-black">
              Get Started for Free
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
