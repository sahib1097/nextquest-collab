
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const PricingFAQ = () => {
  const faqs = [
    {
      question: "How does Jira sync work?",
      answer: "Connect your Jira account in 2 clicks. NextQuest auto-converts tickets into quests with deadlines, and vice versa. Poof! Productivity magic."
    },
    {
      question: "Can I try Pro Hero before paying?",
      answer: "Yep! All paid plans have a 14-day free trial. No credit card required to start."
    },
    {
      question: "What if my team grows beyond 50?",
      answer: "Custom \"Guild Empire\" plans available. Contact us for dragon-scale discounts."
    },
    {
      question: "Are achievements shareable?",
      answer: "Absolutely. Flex your Email Dragon Slayer badge on LinkedIn, Twitter, or Tinder."
    },
    {
      question: "Is the Personal Roadmap really free?",
      answer: "Yes, and it's 100% ad-free. We're nice like that."
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
          🤔 Pricing FAQ: No Goblin Fine Print
        </h2>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                <AccordionTrigger className="text-white hover:text-yellow-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
