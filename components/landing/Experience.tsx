
"use client"

import { motion } from "framer-motion";

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                alt="In-home massage setup"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
                alt="Calming spa ambiance"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            {/* Circle Accent */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/20 rounded-full opacity-50"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm">The Experience</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Transform Your Space Into a Private Spa
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Forget the stress of traffic and parking. Spacall therapists arrive equipped with a professional massage table, fresh premium linens, and a curated selection of oils and music. All you need to do is open the door and exhale.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "Swedish & Deep Tissue Massage",
                "Sports Recovery & Prenatal",
                "Couples Massage Sessions",
                "Aromatherapy Enhancements"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-foreground/80 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-6"
            >
              <button className="text-primary font-bold border-b-2 border-primary/30 hover:border-primary pb-1 transition-all">
                View Treatment Menu
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};