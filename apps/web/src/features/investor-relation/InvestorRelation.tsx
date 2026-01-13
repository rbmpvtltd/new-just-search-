"use client";

import {
  CheckCircle,
  Mail,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function InvestorRelation() {
  return (
    <section className="bg-base-100 text-secondary py-4 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3">
            Investor Relations
          </h1>
          <p className="text-secondary-content max-w-2xl mx-auto">
            Building long-term value through transparency, innovation, and
            sustainable growth.
          </p>
        </div>

        {/* Why Invest Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-base-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">
              Why Invest in Just Search
            </h2>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  Investor Relation At Just Search, we believe in building a
                  transparent, scalable, and impactful business model that
                  drives value for all stakeholders.
                </p>
              </li>

              <li className="flex gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  Our mission is to{" "}
                  <strong>digitally empower small and medium businesses</strong>{" "}
                  {""}
                  bridging the gap between service providers and customers
                  across India.
                </p>
              </li>

              <li className="flex gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  With a <strong> strong focus </strong> on innovation,
                  technology, and customer satisfaction, we are shaping the
                  future of local business discovery.
                </p>
              </li>

              <li className="flex gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  We welcome investors who share our vision of creating a
                  connected, service-driven ecosystem for the{" "}
                  <strong>next billion users.</strong>
                </p>
              </li>
              <li className="flex gap-3">
                <TrendingUp className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  Our{" "}
                  <strong>
                    growth strategy, data-driven approach, and expanding market
                    presence
                  </strong>{" "}
                  offer significant opportunities for long-term returns.
                </p>
              </li>

              <li className="flex gap-3">
                <ShieldCheck className="text-primary mt-1" size={20} />
                <p className="text-secondary-content leading-relaxed">
                  We are committed to clear communication, ethical practices,
                  and sustainable growth. Partner with us to fuel the journey of
                  transforming local commerce into{" "}
                  <strong>digital success stories.</strong>
                </p>
              </li>
            </ul>

            <div className="mt-8 rounded-xl bg-base-100 p-6 border border-base-300">
              <div className="flex gap-3">
                <Mail className="text-primary mt-1" size={20} />
                <div>
                  <p className="font-medium mb-1">Investor Inquiries</p>
                  <p className="text-secondary-content leading-relaxed">
                    For investor inquiries, proposals, or to access our pitch
                    deck, please contact us at:
                  </p>
                  <a
                    href="mailto:help.justsearch@gmail.com"
                    className="text-primary font-medium hover:underline block mt-2"
                  >
                    help.justsearch@gmail.com
                  </a>
                  <p className="mt-3 font-medium">
                    Together, let’s build something extraordinary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
