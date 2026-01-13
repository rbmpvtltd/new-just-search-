"use client";

export default function AboutUs() {
  return (
    <section className="bg-base-100 text-secondary py-4 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            About Just Search
          </h1>
          <p className="text-lg text-secondary-content max-w-3xl mx-auto">
            Your trusted platform for discovering local businesses and services
            near you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-base-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">What We Do</h2>
            <p className="text-secondary-content leading-relaxed">
              Just Search is an all-in-one digital platform that connects
              customers with local businesses and service providers. Our goal is
              to help users find trusted services quickly and easily, right from
              their phones. Whether you're looking for a plumber, makeup artist,
              shop, or mechanic — Just Search has it all.
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">For Businesses</h2>
            <p className="text-secondary-content leading-relaxed">
              We support small and big businesses to grow by increasing their
              online visibility. Our location-based search helps customers find
              services nearby. Business owners can register for free and
              showcase their offerings with photos. We build a bridge between
              service providers and customers through direct connections.
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Why Choose Us</h2>
            <p className="text-secondary-content leading-relaxed">
              Customer reviews and queries help improve trust and transparency.
              From household services to professionals, we cover a wide range of
              needs. Just Search is simple, reliable, and made for everyone.
              Join us today and take your business or search to the next level!
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-secondary-content text-lg mb-6">
            Simple. Reliable. Made for everyone.
          </p>
          <button
            type="button"
            className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
          >
            Join Just Search Today
          </button>
        </div>
      </div>
    </section>
  );
}
