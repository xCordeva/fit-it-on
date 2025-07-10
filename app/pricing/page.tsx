import { Navbar } from "@/components/Navbar";
import { PricingTable } from "@/components/PricingTable";
import { Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="block bg-primary bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free tier, then upgrade when you're ready for more
            virtual try-ons.
          </p>
        </div>

        <PricingTable />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1">
              <AccordionTrigger>How does the free trial work?</AccordionTrigger>
              <AccordionContent>
                You get 1 free try without signing up, then 2 additional tries
                when you create an account. No credit card required for the free
                tier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>
                Can I cancel my subscription anytime?
              </AccordionTrigger>
              <AccordionContent>
                Yes! You can cancel your Pro subscription at any time from your
                account settings. You'll continue to have access until the end
                of your billing period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>
                What image formats are supported?
              </AccordionTrigger>
              <AccordionContent>
                We support JPEG, JPG, and PNG formats. Images should be under
                10MB for best performance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger>
                How accurate are the try-on results?
              </AccordionTrigger>
              <AccordionContent>
                Our AI technology provides highly realistic results, especially
                with clear, well-lit photos. Pro subscribers get access to
                enhanced processing for even better quality.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger>
                What happens when I run out of credits?
              </AccordionTrigger>
              <AccordionContent>
                Once you’ve used up all your available try-on credits, you won’t
                be able to try on new items until you get more. You can either
                wait for your next monthly credit refresh, or refill anytime
                with a small credit pack — starting from just 10 up to 100
                try-ons, depending on your needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <AccordionTrigger>
                Do unused credits carry over to the next month?
              </AccordionTrigger>
              <AccordionContent>
                Credit usage resets every month based on your plan. Any unused
                credits from the previous cycle will not carry over, so we
                recommend making the most of your monthly allowance before it
                refreshes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
}
