"use client";
import Link from "next/link";

export default function CreateYourOwnOffers() {
  return (
    <section className="bg-base-100 text-secondary py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Create your own offers
          </h1>
        </div>

        <div className="bg-base-200 rounded-2xl p-8 shadow-sm space-y-6">
          <p className="text-secondary-content leading-relaxed">
            Boost your visibility and attract more customers by adding special{" "}
            {""}
            <strong>discounts, or festive offers </strong> to your Just Search
            business profile.
          </p>
          <p className="text-secondary-content leading-relaxed">
            Follow these simple steps to showcase your offers:
          </p>

          <div className="space-y-4">
            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 1: Go to{" "}
              <strong>
                <Link
                  href="https://www.justsearch.net.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  www.justsearch.net.in
                </Link>
              </strong>{" "}
              and
              <strong> log in </strong>
              to your business account.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 2: From your <strong> dashboard</strong>, select
              <strong> “Offers” </strong>
              or
              <strong> “Add Offer.” </strong>
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 3: Enter your
              <strong> offer title </strong>
              (e.g., “Festive Sale – Flat 20% Off”) Select subcategory
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 4: Write a short <strong> description </strong>
              of what you’re offering.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 5: Upload <strong> images </strong> to make your offer more
              attractive.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 6: Click <strong> Submit </strong> to publish — your offer
              will be <strong> visible to all nearby users </strong> instantly!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
