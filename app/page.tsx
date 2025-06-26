'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { TryOnForm } from '@/components/TryOnForm'
import { TryOnResult } from '@/components/TryOnResult'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Shield, Users } from 'lucide-react'
import Link from 'next/link'

interface TryOnResultData {
  inputUrl: string
  garmentUrl: string
  outputUrl: string
}

export default function HomePage() {
  const [result, setResult] = useState<TryOnResultData | null>(null)

  const handleResult = (newResult: TryOnResultData) => {
    setResult(newResult)
  }

  const handleReset = () => {
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {!result ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Virtual Try-On
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Try On Any Outfit
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Before You Buy
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload your photo and any clothing item to see how it looks on you. 
                Powered by advanced AI technology for realistic results.
              </p>
            </div>

            {/* Try-On Form */}
            <div className="max-w-4xl mx-auto mb-16">
              <TryOnForm onResult={handleResult} />
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Choose FitItOn.io?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">
                    Get your try-on results in seconds with our optimized AI processing pipeline.
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                  <p className="text-gray-600">
                    Your photos are processed securely and never shared with third parties.
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Loved by Thousands</h3>
                  <p className="text-gray-600">
                    Join our community of fashion enthusiasts exploring virtual try-ons.
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">
                  Ready to Transform Your Shopping Experience?
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  Get 4 free tries when you sign up, then upgrade for unlimited access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    variant="secondary"
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Your Virtual Try-On Result</h1>
              <p className="text-gray-600">
                Here's how the outfit looks on you! Download, share, or try another combination.
              </p>
            </div>
            
            <TryOnResult result={result} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}