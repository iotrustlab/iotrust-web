import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description: "Meet our talented team of researchers and students working on IoT security.",
};

export default function PeoplePage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            People
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Coming soon - Meet our talented team of researchers and students working on IoT security.
          </p>
        </div>
      </div>
    </div>
  );
} 