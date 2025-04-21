
import React from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I paid off debt by treating it like a boss battle. NextQuest made it FUN.",
    author: "Jamie",
    role: "Recovered Procrastinator",
    image: "/placeholder.svg"
  },
  {
    quote: "My remote team actually finishes projects now. We compete for 'MVP' titles!",
    author: "Alex",
    role: "Startup Founder",
    image: "/placeholder.svg"
  },
  {
    quote: "Finally stuck to my fitness routine—it's a 'Quest for Six-Pack Kingdom.'",
    author: "Sam",
    role: "Fitness Adventurer",
    image: "/placeholder.svg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Heroes Who&apos;ve Conquered Their To-Do Lists
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
