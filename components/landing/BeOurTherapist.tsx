"use client";

import { motion } from "framer-motion";
import { Clock3, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    title: "Premium clientele",
    description: "Pre-vetted guests, concierge partners, and corporate clients who value five-star service.",
    icon: ShieldCheck,
  },
  {
    title: "Earn more, faster",
    description: "Transparent pricing, high average tickets, and optional same-day payouts when you need them.",
    icon: Sparkles,
  },
  {
    title: "Your schedule, your radius",
    description: "Control availability, travel distance, and modalities so every booking fits your craft.",
    icon: Clock3,
  },
  {
    title: "Built for pros",
    description: "Insurance support, safety protocols, and dedicated success coaching for top performers.",
    icon: HeartHandshake,
  },
];

const stats = [
  { label: "Avg. payout per visit", value: "$142" },
  { label: "Same-day payout", value: "Available" },
  { label: "Cities live", value: "12" },
  { label: "Therapist retention", value: "94%" },
];

const steps = [
  "Apply with your credentials in under 3 minutes.",
  "Verify licenses and complete a brief background check.",
  "Shadow a senior therapist and take your first booking within 48 hours.",
];

const BeOurTherapist = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-background via-background to-amber-50/50">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(218,180,93,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.15),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(14,116,144,0.12),transparent_30%)]" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-14 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-[0.2em] text-xs">Be our therapist</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-2xl">
              Elevate your practice with concierge-level bookings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Join a curated collective of licensed therapists delivering sanctuary-grade care. We handle demand, payments, and safety so you can focus on exceptional bodywork.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {perks.map((perk) => (
                <div key={perk.title} className="h-full rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-6 shadow-sm hover:shadow-elevated transition-shadow duration-300">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{perk.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                Apply as Therapist
              </Link>
              <Link
                href="/apply#requirements"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-primary/50 hover:text-primary transition-colors"
              >
                View Requirements
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:w-[420px] xl:w-[460px]"
          >
            <div className="rounded-3xl bg-foreground text-background p-8 space-y-8 shadow-2xl">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">What to expect</p>
                <h3 className="font-serif text-2xl font-semibold">Financial clarity, safety-first ops</h3>
                <p className="text-white/80 leading-relaxed">
                  Transparent rates per modality, zero surprise fees, and a concierge team on-call during every session.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wide text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Your onboarding</p>
                <ul className="space-y-2 text-white/80">
                  {steps.map((step) => (
                    <li key={step} className="flex gap-3 items-start">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-primary" />
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeOurTherapist;
