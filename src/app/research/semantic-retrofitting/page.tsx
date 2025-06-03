import type { Metadata } from "next";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, DollarSign, Tag, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: "Leveraging Semantics to Retrofit Security and Resiliency in Legacy CPS | IoTrust Lab",
  description: "Research on leveraging knowledge about cyber-physical system semantics to enhance safety and security in deployed and legacy systems.",
};

export default function SemanticRetrofittingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-6">
            <Link
              href="/research"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              ← Back to Research
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Active Research
                </span>
                <span className="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  NSF Funded
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Leveraging Semantics to Retrofit Security and Resiliency in Legacy CPS
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                For deployed and legacy systems, how can we leverage knowledge about a cyber-physical system&apos;s semantics, 
                e.g., the underlying physical equations, to enhance safety and security at all levels of the software stack?
              </p>
              
              {/* Project Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <DollarSign className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium mr-2">Funding:</span>
                  <span>NSF - $500K</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium mr-2">Duration:</span>
                  <span>2022-2025</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium mr-2">Team:</span>
                  <span>L. Garcia, N. Sayom, Y. Wang</span>
                </div>
              </div>
              
              {/* Keywords */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Research Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Cyber-Physical Systems", "Security Retrofitting", "Semantic Analysis", "Legacy Systems"].map((keyword) => (
                    <span 
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/project-placeholder.jpg"
                alt="Semantic Retrofitting Research"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Research Challenge */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            The Challenge
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Industrial control systems and cyber-physical systems deployed in critical infrastructure often operate for decades. 
                These legacy systems face evolving cybersecurity threats but cannot be easily replaced due to cost, safety certification, 
                and operational constraints.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our research investigates how to leverage the inherent physical semantics—the mathematical models describing the 
                physical processes—to retrofit security mechanisms without requiring hardware changes or system downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Approach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Semantic Extraction
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extract and formalize the physical semantics from existing control logic, documentation, and operational data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Security Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Develop security mechanisms that leverage physical constraints and process models to detect anomalies.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Retrofit Implementation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deploy security enhancements through software-only solutions that work with existing hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Innovations */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Key Innovations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Physics-Informed Anomaly Detection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Using physical process models to distinguish between legitimate operational changes and potential attacks.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Semantic-Aware Access Control
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Implementing context-aware security policies based on the physical state and operational constraints.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Non-Intrusive Monitoring
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Deploying security mechanisms without modifying existing control loops or operational procedures.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Real-World Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our methods enable critical infrastructure operators to enhance security posture without the prohibitive 
                costs and risks associated with system replacement.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-3">5</span>
                  <span className="text-gray-600 dark:text-gray-300">Publications</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-3">3</span>
                  <span className="text-gray-600 dark:text-gray-300">Industry Partnerships</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-3">2</span>
                  <span className="text-gray-600 dark:text-gray-300">Patent Applications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Timeline */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Research Timeline
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  2022-2023
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1 mr-4"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Foundation & Theory Development
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Developed formal frameworks for semantic extraction and established theoretical foundations for physics-informed security.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  2023-2024
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1 mr-4"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Implementation & Testing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Building prototype systems and conducting validation studies with industrial control system testbeds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  2024-2025
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full mt-1 mr-4"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Deployment & Evaluation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Real-world deployment studies and comprehensive evaluation of security effectiveness and operational impact.
                  </p>
                </div>
              </div>
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
            We&apos;re looking for industry partners with legacy systems and infrastructure operators interested in 
            enhancing security through semantic retrofitting approaches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Research Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Publications
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 