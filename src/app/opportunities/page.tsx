import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Explore research opportunities and join our team at IoTrust Lab.",
};

export default function OpportunitiesPage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Opportunities
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Coming soon - Explore research opportunities and join our team at IoTrust Lab.
          </p>
        </div>
      </div>
    </div>
  );
} 