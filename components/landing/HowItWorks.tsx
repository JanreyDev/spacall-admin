"use client"
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    description: "Select from Swedish, deep tissue, sports massage, and more luxury treatments.",
  },
  {
    number: "02",
    title: "Pick Your Time",
    description: "Book instantly for same-day or schedule ahead. Available 7am to 11pm daily.",
  },
  {
    number: "03",
    title: "Relax & Enjoy",
    description: "Your certified therapist arrives with everything needed for a spa-quality experience.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 translate-x-1/4" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
                How It Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-12">
                Your Path to{" "}
                <span className="text-gradient-gold">Bliss</span>
              </h2>
            </motion.div>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <span className="font-serif text-4xl lg:text-5xl font-bold text-gradient-gold">
                      {step.number}
                    </span>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 via-gold-light/10 to-transparent" />
              <div className="absolute inset-8 rounded-full bg-card shadow-elevated flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-serif text-6xl font-bold text-gradient-gold mb-2">
                    15
                  </p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">
                    Minutes<br />Average Arrival
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
