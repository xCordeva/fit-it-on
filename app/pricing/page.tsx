import { Navbar } from '@/components/Navbar'
import { PricingTable } from '@/components/PricingTable'
import { Sparkles } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free tier, then upgrade when you're ready for unlimited virtual try-ons.
          </p>
        </div>

        <PricingTable />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-gray-600">
                You get 1 free try without signing up, then 4 additional tries when you create an account. 
                No credit card required for the free tier.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your Pro subscription at any time from your account settings. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What image formats are supported?</h3>
              <p className="text-gray-600">
                We support JPG, PNG, and WebP formats. Images should be under 10MB for best performance.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold mb-2">How accurate are the try-on results?</h3>
              <p className="text-gray-600">
                Our AI technology provides highly realistic results, especially with clear, well-lit photos. 
                Pro subscribers get access to enhanced processing for even better quality.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}