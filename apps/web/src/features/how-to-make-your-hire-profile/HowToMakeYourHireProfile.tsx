"use client";

import Link from "next/link";

export default function HowToMakeYourHireProfile() {
  return (
    <section className="bg-base-100 text-secondary py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            How to make your hire profile
          </h1>
        </div>

        <div className="bg-base-200 rounded-2xl p-8 shadow-sm space-y-6">
          <p className="text-secondary-content leading-relaxed">
            Looking for work opportunities? Create your {" "}
            <strong>Hire Profile</strong> {""}
            on {""}
            <strong>Just Search</strong> and get discovered by nearby businesses
            and employers.
          </p>
          <p className="text-secondary-content leading-relaxed">
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
              Step 2: Click on Login as Hire
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 3: Sign up using your mobile number or email ID.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 4: Enter your {""}
              <strong> personal and professional details</strong> – name,
              skills, experience, preferred work type (full-time, part-time,
              freelance), and location.
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 5: Upload your <strong>photo, ID proof,</strong> and any{" "}
              <strong>work summery or certificates</strong> {""}
              (optional but recommended).
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 6: Review your details and click {""}
              <strong>Submit.</strong>
            </div>

            <div className="bg-base-100 rounded-xl p-4 border border-base-300">
              Step 7: Once verified, your {""}
              <strong>Hire Listing</strong> will go live and nearby businesses
              can <strong>contact you directly</strong> for jobs or projects.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
