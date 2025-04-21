import React from "react";
import { motion } from "framer-motion";
import { Scale, FileText, ShieldCheck, MessageSquare, Ban, Handshake, RefreshCw } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsOfService = () => {
  const sections = [
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Agreement to Terms",
      content: "By accessing our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: "Our service and its original content, features, and functionality are owned by Next Quest and are protected by international copyright laws."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "User Responsibilities",
      content: "You are responsible for safeguarding your account and ensuring that others do not access your account without permission."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "User Content",
      content: "You retain rights to your content, but grant us a license to use, modify, and display content you post on our service."
    },
    {
      icon: <Ban className="w-6 h-6" />,
      title: "Prohibited Activities",
      content: "Users must not engage in any unlawful conduct or attempt to gain unauthorized access to our systems."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Disclaimer",
      content: "Our service is provided 'as is' without warranties of any kind, either express or implied."
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Modifications",
      content: "We reserve the right to modify or replace these terms at any time. Changes will be effective immediately upon posting."
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
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
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

export default TermsOfService;
