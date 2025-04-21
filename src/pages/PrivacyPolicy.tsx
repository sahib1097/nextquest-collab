
import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Users, Eye, Database, Cookie, AlertCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection",
      content: "We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Information Collection",
      content: "We collect information that you provide directly to us, including name, email address, and usage data to improve our services."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Information Sharing",
      content: "We do not sell your personal information. We may share data with trusted partners to help perform statistical analysis or provide customer support."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. Contact us for assistance."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Storage",
      content: "Your data is stored securely in North American data centers that comply with GDPR and local regulations."
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "Cookies",
      content: "We use cookies to enhance your experience, understand site usage, and assist in our marketing efforts."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Updates",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <ScrollArea className="h-[600px] rounded-md border border-gray-800">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-yellow-400">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                      <p className="text-gray-400">{section.content}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
