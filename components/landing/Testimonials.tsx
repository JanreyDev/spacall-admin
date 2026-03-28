"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: "Elena R.",
    role: "Executive Director",
    text: "Spacall is an absolute game-changer for my busy schedule. The therapist was professional, punctual, and the massage was better than most 5-star hotels I've visited.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Marcus T.",
    role: "Architect",
    text: "The attention to detail is unmatched. From the heated table to the music playlist, they really do bring the sanctuary to you. Highly recommended.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sophia L.",
    role: "Tech Entrepreneur",
    text: "I love the ease of booking on the app. Finding a high-quality therapist in a new city used to be a gamble, but Spacall delivers consistency every time.",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Loved by Busy Professionals
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-border flex flex-col h-full hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="flex text-amber-400 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-8 flex-grow leading-relaxed">&quot;{review.text}&quot;</p>
              <div className="flex items-center space-x-4 mt-auto">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-foreground">{review.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};