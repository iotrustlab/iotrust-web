import type { Metadata } from "next";
import { ResearchProjects } from "@/components/research-projects";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore our cutting-edge research in IoT security, trust, and privacy.",
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Research
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Explore our cutting-edge research in IoT security, trust, and privacy. Our interdisciplinary approach combines theoretical foundations with practical implementations to address real-world challenges in cyber-physical systems.
            </p>
          </div>
        </div>
      </div>

      {/* Research Projects Section */}
      <ResearchProjects />

      {/* Research Areas Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Research Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                IoT Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Developing novel security mechanisms for Internet of Things devices and networks, focusing on privacy-preserving protocols and secure communication.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Trustworthy AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating explainable and reliable artificial intelligence systems for cyber-physical environments with human-in-the-loop capabilities.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Cyber-Physical Systems
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Securing critical infrastructure through physics-informed security mechanisms and anomaly detection in industrial control systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Interested in Collaboration?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We welcome collaborations with industry partners, academic institutions, and government agencies. Contact us to discuss potential research opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/opportunities"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 