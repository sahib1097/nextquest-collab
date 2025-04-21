
import React from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import LeaderboardSystem from '@/components/Social/LeaderboardSystem';
import { motion } from 'framer-motion';

const Leaderboards = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Leaderboards | NextQuest</title>
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Hero Leaderboards
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Compare your progress with heroes from around the world and climb the ranks to legendary status.
              </motion.p>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
              <LeaderboardSystem />
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboards;
