import type { Metadata } from "next";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, DollarSign, Tag, AlertTriangle, Shield, Activity, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: "Physics-Informed Security Mechanisms for SCADA Systems | IoTrust Lab",
  description: "Research on leveraging physical equations and process models to detect anomalies and prevent attacks in supervisory control and data acquisition systems.",
};

export default function SCADAPhysicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="mb-6">
            <Link
              href="/research"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              ← Back to Research
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Active Research
                </span>
                <span className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                  Critical Infrastructure
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Physics-Informed Security Mechanisms for SCADA Systems
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Leveraging underlying physical equations and process models to detect anomalies and prevent attacks 
                in supervisory control and data acquisition systems that manage critical infrastructure.
              </p>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <DollarSign className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                    <div>
                      <span className="font-medium block">DOE Funding</span>
                      <span className="text-sm">$750K</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                    <div>
                      <span className="font-medium block">Duration</span>
                      <span className="text-sm">2023-2026</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400" />
                    <div>
                      <span className="font-medium block">Team</span>
                      <span className="text-sm">L. Garcia, Y. Wang</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <TrendingUp className="h-5 w-5 mr-3 text-orange-600 dark:text-orange-400" />
                    <div>
                      <span className="font-medium block">Publications</span>
                      <span className="text-sm">3 papers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Keywords */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Research Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["SCADA Security", "Physics-based Detection", "Anomaly Detection", "Critical Infrastructure"].map((keyword) => (
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
            
            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/project-placeholder.jpg"
                  alt="SCADA Systems Research"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Overlay with SCADA visualization elements */}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-semibold">Securing Critical Infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Landscape */}
      <section className="py-16 bg-red-50 dark:bg-red-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Critical Infrastructure Challenge
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              SCADA systems controlling power grids, water treatment plants, and industrial facilities are increasingly 
              targeted by sophisticated cyberattacks that can cause physical damage and endanger public safety.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">40%</div>
              <div className="text-gray-600 dark:text-gray-300">
                Increase in attacks on critical infrastructure since 2020
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">15min</div>
              <div className="text-gray-600 dark:text-gray-300">
                Average time to detect sophisticated attacks in traditional systems
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">90%</div>
              <div className="text-gray-600 dark:text-gray-300">
                Of critical infrastructure systems lack advanced threat detection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Physics-Informed Security Approach
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                How It Works
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Physical Process Modeling
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      We create mathematical models of the physical processes (fluid dynamics, thermodynamics, electrical systems) 
                      that SCADA systems control.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Invariant Detection
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Identify physical invariants and constraints that should always hold true during normal operation, 
                      regardless of operational mode.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Real-time Monitoring
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Deploy monitoring systems that continuously check sensor data against physical models to detect 
                      violations that indicate attacks or system failures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Detection Capabilities
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">False Data Injection</span>
                  <span className="text-green-500 font-semibold">99.2% Detection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Command Injection</span>
                  <span className="text-green-500 font-semibold">97.8% Detection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Replay Attacks</span>
                  <span className="text-green-500 font-semibold">95.5% Detection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">DoS Attacks</span>
                  <span className="text-green-500 font-semibold">99.7% Detection</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Average Detection Time</span>
                    <span className="text-blue-500 font-bold">{"<"} 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Applications */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Target Applications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Power Grid Systems
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Protecting electrical transmission and distribution systems from attacks that could cause blackouts.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Generation control systems</li>
                <li>• Load dispatch centers</li>
                <li>• Substation automation</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Water Treatment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Securing water and wastewater treatment facilities that serve millions of people daily.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Chemical dosing systems</li>
                <li>• Filtration controls</li>
                <li>• Distribution networks</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Industrial Control
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Defending manufacturing and process control systems in chemical plants and refineries.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Process control systems</li>
                <li>• Safety instrumented systems</li>
                <li>• Batch control systems</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research Impact */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Research Impact & Partnerships
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Industry Collaborations
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Regional Utility Company</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Pilot deployment in transmission substation with 50,000+ customers
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Municipal Water Authority</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Testing framework in water treatment facility serving 200,000 residents
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Department of Homeland Security</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Evaluation of detection capabilities in critical infrastructure testbed
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Key Achievements
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">IEEE Papers Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Patent Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Industry Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Conference Presentations</div>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Recognition & Awards
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Best Paper Award - IEEE Industrial Cyber-Physical Systems 2023</li>
                  <li>• Outstanding Research Contribution - ACSAC 2023</li>
                  <li>• Featured in DHS Science & Technology Showcase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Directions */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Future Research Directions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Building on our foundational work, we&apos;re expanding to address emerging challenges in critical infrastructure security.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI-Enhanced Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrating machine learning with physics models for adaptive threat detection in evolving attack landscapes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Distributed Systems
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extending our approach to large-scale, geographically distributed infrastructure networks.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Partner With Our Research
              <Shield className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 