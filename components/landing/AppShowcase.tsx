"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Smartphone, Star } from 'lucide-react';

export const AppShowcase: React.FC = () => {
  return (
    <section className="py-24 overflow-hidden relative bg-foreground text-background">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 mb-16 lg:mb-0 pr-0 lg:pr-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">
              Booking is Effortless
            </h2>
            <p className="text-white/70 text-lg mb-8 font-light max-w-lg">
              Our intuitive app connects you with top-tier professionals in seconds. 
              Browse profiles, read real reviews, and secure your appointment with a tap.
            </p>
            
            <div className="flex flex-col space-y-4">
              {[
                { num: 1, title: "Select Your Treatment", desc: "Choose from a variety of modalities and durations." },
                { num: 2, title: "Choose a Therapist", desc: "View bios, ratings, and specialties to find your match." },
                { num: 3, title: "Relax & Restore", desc: "Track your therapist's arrival and prepare to unwind." }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">{step.num}</div>
                  <div>
                    <h4 className="text-xl font-medium text-white">{step.title}</h4>
                    <p className="text-white/60 text-sm mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4 mt-10"
            >
              <button className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium">
                <Apple size={20} />
                <span>iOS Download</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors font-medium backdrop-blur-sm border border-white/10">
                <Smartphone size={20} />
                <span>Android Download</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-center lg:justify-end"
          >
            {/* Phone Mockups */}
            <motion.div
              initial={{ rotate: -6, opacity: 0 }}
              whileInView={{ rotate: -6, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative w-[280px] md:w-[320px] h-[580px] md:h-[640px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform z-10 translate-x-8 lg:translate-x-0"
            >
               {/* Screen Content 1 (Profile) */}
               <div className="relative h-full w-full bg-white overflow-hidden flex flex-col">
                  <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop" className="h-2/3 w-full object-cover" alt="Therapist Profile" />
                  <div className="p-6 bg-white flex-1">
                     <h3 className="text-2xl font-serif font-bold text-gray-900">Sarah Jenkins</h3>
                     <p className="text-gray-500 text-sm mb-4">Deep Tissue Specialist • 4.9 <Star size={12} className="inline text-amber-400 fill-amber-400"/></p>
                     <div className="flex space-x-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Sports</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Shiatsu</span>
                     </div>
                     <button className="mt-6 w-full py-3 bg-black text-white rounded-xl font-medium">Book Now</button>
                  </div>
               </div>
            </motion.div>
            
            <motion.div
              initial={{ rotate: 6, opacity: 0, x: 30 }}
              whileInView={{ rotate: 6, opacity: 0.8, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute top-12 left-0 lg:left-20 w-[260px] md:w-[300px] h-[540px] md:h-[600px] bg-white rounded-[3rem] border-8 border-gray-200 shadow-xl overflow-hidden -z-0 hidden md:block"
            >
               {/* Screen Content 2 (List) */}
               <div className="h-full w-full bg-gray-50 p-4 pt-12">
                  <div className="h-8 w-32 bg-gray-200 rounded-lg mb-6"></div>
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex space-x-3">
                           <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                           <div className="flex-1 space-y-2">
                              <div className="h-4 w-24 bg-gray-200 rounded"></div>
                              <div className="h-3 w-16 bg-gray-100 rounded"></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};