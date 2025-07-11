import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MainPageFaqs() {
  return (
    <div className="max-w-3xl mx-auto my-16">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="faq-1">
          <AccordionTrigger>What image formats are supported?</AccordionTrigger>
          <AccordionContent>
            We support JPEG, JPG, and PNG formats. Images should be under 10MB
            for best performance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2">
          <AccordionTrigger>
            How accurate are the try-on results?
          </AccordionTrigger>
          <AccordionContent>
            Our AI technology provides highly realistic results, especially with
            clear, well-lit photos. Pro subscribers get access to enhanced
            processing for even better quality.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3">
          <AccordionTrigger>
            What happens when I delete my account?
          </AccordionTrigger>
          <AccordionContent>
            When you delete your account, all your personal data and uploaded
            photos are permanently removed from our servers in accordance with
            our privacy policy. This action is irreversible.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-4">
          <AccordionTrigger>
            Do you store or use my photos after I upload them?
          </AccordionTrigger>
          <AccordionContent>
            Your uploaded photos are only stored to enhance your experience.
            They are never shared with third parties, not used for training AI,
            and can be deleted by you at any time from your gallery settings.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-5">
          <AccordionTrigger>
            Can I use the virtual try-on on my phone?
          </AccordionTrigger>
          <AccordionContent>
            Absolutely! FitItOn is fully mobile-friendly. You can upload a photo
            and try on items right from your smartphone with the same smooth
            experience.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
