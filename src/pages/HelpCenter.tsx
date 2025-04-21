
import React, { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, HelpCircle, BookOpen, Compass, MessageSquare, Zap, ChevronRight } from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter FAQ items based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-white mb-2">Next Quest Help Center</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of your Next Quest adventure
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              className="pl-10 bg-gray-800 border-gray-700 text-white h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="w-full bg-gray-800 mb-8">
              <TabsTrigger value="getting-started" className="flex-1">
                <BookOpen className="mr-2 h-4 w-4" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="features" className="flex-1">
                <Compass className="mr-2 h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex-1">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex-1">
                <Zap className="mr-2 h-4 w-4" />
                Troubleshooting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started">
              <div className="grid md:grid-cols-2 gap-6">
                {gettingStartedGuides.map((guide, index) => (
                  <GuideCard key={index} {...guide} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid md:grid-cols-2 gap-6">
                {featureGuides.map((guide, index) => (
                  <GuideCard key={index} {...guide} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <div className="p-4">
                    {searchQuery && (
                      <p className="text-gray-400 mb-4">
                        {filteredFaqs.length === 0
                          ? "No results found."
                          : `Found ${filteredFaqs.length} result${filteredFaqs.length === 1 ? "" : "s"}.`}
                      </p>
                    )}
                    <div className="space-y-4">
                      {(searchQuery ? filteredFaqs : faqs).map((faq, index) => (
                        <FaqItem key={index} {...faq} />
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="troubleshooting">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Common Issues & Solutions</h2>
                <div className="space-y-6">
                  {troubleshootingItems.map((item, index) => (
                    <TroubleshootingItem key={index} {...item} />
                  ))}
                </div>
                <div className="mt-8 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
                  <div className="flex">
                    <MessageSquare className="text-yellow-400 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium text-yellow-400">Need more help?</h3>
                      <p className="text-gray-300 mt-1">
                        If you can't find a solution to your problem, don't hesitate to{" "}
                        <a href="/contact" className="text-yellow-400 hover:underline">
                          contact our support team
                        </a>
                        . We're here to help you on your quest!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper Components
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 rounded-md overflow-hidden">
      <button
        className="w-full text-left p-4 bg-gray-800/50 flex justify-between items-center hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white">{question}</span>
        <ChevronRight
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4 text-gray-300 bg-gray-800/20">{answer}</div>}
    </div>
  );
};

const GuideCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => {
  return (
    <div className="border border-gray-800 rounded-lg p-5 bg-gray-900/50 hover:border-gray-700 transition-colors">
      <div className="flex items-start">
        <div className="p-2 bg-yellow-500/20 rounded-md text-yellow-500 mr-4">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" className="text-xs text-gray-300 border-gray-700">
          Read Guide <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const TroubleshootingItem = ({ issue, solution }: { issue: string; solution: string }) => {
  return (
    <div>
      <h3 className="font-medium text-yellow-400 mb-2">{issue}</h3>
      <p className="text-gray-300">{solution}</p>
    </div>
  );
};

// Data
const gettingStartedGuides = [
  {
    title: "Create Your First Quest",
    description: "Learn how to set up your first quest and start tracking your progress.",
    icon: BookOpen,
  },
  {
    title: "Understanding XP & Levels",
    description: "Everything you need to know about how the experience system works.",
    icon: Zap,
  },
  {
    title: "Project Management Basics",
    description: "How to create projects, add team members and set objectives.",
    icon: Compass,
  },
  {
    title: "Team Collaboration",
    description: "Set up your team members for success with role assignments and permissions.",
    icon: MessageSquare,
  },
];

const featureGuides = [
  {
    title: "Quest Maps & Journeys",
    description: "Learn how to create visual representations of your project roadmap.",
    icon: Compass,
  },
  {
    title: "Achievement System",
    description: "Unlock badges and rewards by completing quests and milestones.",
    icon: Zap,
  },
  {
    title: "Analytics Dashboard",
    description: "Understand the metrics and data available in your project dashboard.",
    icon: BookOpen,
  },
  {
    title: "Integration Guides",
    description: "Connect Next Quest with your favorite tools and platforms.",
    icon: MessageSquare,
  },
];

const faqs = [
  {
    question: "What is Next Quest?",
    answer: "Next Quest is a project management platform that transforms traditional task tracking into an exciting adventure. It gamifies productivity by turning projects into quests, tasks into missions, and progress into character development.",
  },
  {
    question: "How does the XP system work?",
    answer: "XP (Experience Points) are earned by completing tasks, meeting deadlines, and achieving milestones. As you accumulate XP, your character levels up, unlocking new abilities, badges, and features. The amount of XP earned depends on the difficulty and importance of the task completed.",
  },
  {
    question: "Can I use Next Quest with my existing project management tools?",
    answer: "Yes! Next Quest integrates with popular project management tools like Jira, Asana, Trello, and GitHub. You can sync your existing workflows and enhance them with Next Quest's gamification features.",
  },
  {
    question: "How do I add team members to my Next Quest account?",
    answer: "Navigate to your Team settings from the dashboard. Click 'Add Member' and enter their email address. You can assign roles and permissions during this process. New members will receive an invitation via email to join your Next Quest adventure.",
  },
  {
    question: "Is Next Quest suitable for large enterprises?",
    answer: "Absolutely! Next Quest scales from solo adventurers to enterprise-level guilds. Our enterprise plan includes advanced features like custom integrations, dedicated support, and enhanced security controls to meet the needs of larger organizations.",
  },
  {
    question: "How secure is my data with Next Quest?",
    answer: "Next Quest takes data security seriously. We implement industry-standard encryption, regular security audits, and strict access controls. All data is backed up regularly, and we are compliant with major data protection regulations including GDPR.",
  },
  {
    question: "What makes Next Quest different from traditional project management tools?",
    answer: "Next Quest stands out with its unique gamification approach that turns work into play. Traditional tools focus solely on productivity, while we enhance motivation and team engagement through game mechanics like quests, achievements, and character development.",
  },
  {
    question: "Do I need gaming experience to use Next Quest?",
    answer: "Not at all! Next Quest is designed to be intuitive for everyone, regardless of gaming experience. The platform incorporates familiar RPG elements in a user-friendly interface that anyone can navigate.",
  },
];

const troubleshootingItems = [
  {
    issue: "I can't log in to my account",
    solution: "First, ensure you're using the correct email address and password. If you've forgotten your password, use the 'Forgot Password' option on the login page. Make sure your internet connection is stable and try clearing your browser cache. If problems persist, contact support.",
  },
  {
    issue: "My progress isn't being tracked correctly",
    solution: "Check if the task was properly marked as complete in the system. Verify that all integrations with external tools are functioning correctly. Sometimes, there may be a slight delay in updating progress due to synchronization. If the issue continues, try refreshing the page or logging out and back in.",
  },
  {
    issue: "Team members can't see shared quests",
    solution: "Ensure that team members have the correct permissions assigned. Verify that the quests are properly set as 'shared' in the quest settings. If using team workspaces, check that all members have been added to the relevant workspace. You might need to re-share the quest or ask team members to refresh their browser.",
  },
  {
    issue: "The application is running slowly",
    solution: "Clear your browser cache and cookies. Close unnecessary tabs and applications to free up system resources. Check your internet connection speed. If using the mobile app, ensure you have the latest version installed. For persistent performance issues, try accessing Next Quest from a different browser or device.",
  },
];

export default HelpCenter;
