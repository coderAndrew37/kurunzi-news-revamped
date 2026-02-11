// app/subscribe/page.tsx
import Link from "next/link";
import { Check, Shield, Mail, Bell } from "lucide-react";

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Stay Ahead with <span className="text-red-600">Kurunzi News</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get exclusive news, in-depth analysis, and breaking updates
              delivered directly to your inbox.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                <Bell className="w-4 h-4" />
                Breaking News Alerts
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Mail className="w-4 h-4" />
                Daily News Digest
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Ad-Free Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Subscription Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600 mb-8">
                Fill in your details to get started. No credit card required.
              </p>

              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                {/* News Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What news are you most interested in?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: "politics", label: "Politics" },
                      { id: "business", label: "Business" },
                      { id: "sports", label: "Sports" },
                      { id: "tech", label: "Technology" },
                      { id: "health", label: "Health" },
                      { id: "entertainment", label: "Entertainment" },
                    ].map((topic) => (
                      <div key={topic.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={topic.id}
                          name="topics"
                          value={topic.id}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label
                          htmlFor={topic.id}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {topic.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Delivery Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Roundup</option>
                    <option value="breaking">Breaking News Only</option>
                  </select>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 mt-0.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                    I agree to receive emails from Kurunzi News and accept the{" "}
                    <Link
                      href="/privacy"
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms"
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Terms of Service
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  Start Your Subscription
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                You can unsubscribe at any time. We never share your
                information.
              </p>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Why Subscribe?
              </h3>

              <div className="space-y-6">
                {[
                  {
                    title: "Exclusive Content",
                    description:
                      "Get access to in-depth analysis and reports not available elsewhere.",
                  },
                  {
                    title: "Ad-Free Reading",
                    description:
                      "Enjoy a clean, distraction-free reading experience.",
                  },
                  {
                    title: "Early Access",
                    description:
                      "Be the first to read breaking news and exclusive stories.",
                  },
                  {
                    title: "Curated Digest",
                    description:
                      "Receive personalized news based on your interests.",
                  },
                  {
                    title: "Support Journalism",
                    description:
                      "Your subscription helps fund independent, quality journalism.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Check className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
