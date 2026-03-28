"use client"
import { motion } from "framer-motion";
import { Clock, Shield, Award, MapPin } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Book in 60 Seconds",
    description: "Effortless booking with instant confirmation. Your relaxation is just a few taps away.",
  },
  {
    icon: Shield,
    title: "Vetted Professionals",
    description: "Every therapist is licensed, background-checked, and trained to five-star hotel standards.",
  },
  {
    icon: Award,
    title: "Luxury Experience",
    description: "Premium oils, heated tables, and techniques from the world's finest spas—brought to you.",
  },
  {
    icon: MapPin,
    title: "Anywhere You Are",
    description: "At home, your hotel, or the office. Wellness follows wherever life takes you.",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Why Spacall
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Redefining Relaxation
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;ve elevated the at-home massage experience to match the world&apos;s finest hotels.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-gradient-card border border-border/50 hover:shadow-elevated hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
