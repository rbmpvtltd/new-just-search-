"use client";

import Link from "next/link";

export default function HowToListYourBusiness() {
  return (
    <section className="bg-base-100 text-secondary py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            How to list your Business
          </h1>
        </div>

        <div className="bg-base-200 rounded-2xl p-8 shadow-sm space-y-6">
          <p className="text-secondary-content leading-relaxed">
            Grow your reach and attract more local customers by listing your
            business on Just Search — your all-in-one local discovery platform.
            Follow these simple steps to get started:
          </p>

          <div className="space-y-4">
            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 1: Visit{" "}
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
              or you can download just search App.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 2: Login as business if you don't have account , Register
              with phone number or email ID.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 3: Click On add business listing
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 4: Enter your business details – name, address, category,
              contact info, and working hours.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 5: Upload your logo, photos, to make your listing stand out.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 6: Review your details and click Submit.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 7: Once approved, your business will be live on Just Search
              and visible to thousands of nearby customers!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
