import Link from 'next/link';
import { Mail } from 'lucide-react';

// Since footer is used in layout, we'll create a client component with static data
// or make the layout async. For now, let's use static data inline.
const labInfo = {
  lead: {
    name: "Dr. Sarah Chen",
    title: "Associate Professor",
    email: "s.chen@university.edu"
  },
  university: {
    name: "University of Technology",
    department: "Department of Computer Science and Engineering",
    address: {
      street: "123 University Drive",
      city: "Tech City",
      state: "TC",
      zip: "12345"
    }
  }
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lab and University Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              IoTrust Lab
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>{labInfo.university.department}</p>
              <p>{labInfo.university.name}</p>
              <div className="mt-3">
                <p>{labInfo.university.address.street}</p>
                <p>{labInfo.university.address.city}, {labInfo.university.address.state} {labInfo.university.address.zip}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Principal Investigator
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium">{labInfo.lead.name}</p>
                <p>{labInfo.lead.title}</p>
                <a 
                  href={`mailto:${labInfo.lead.email}`}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1"
                >
                  <Mail className="h-3 w-3" />
                  {labInfo.lead.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Research Projects
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/people" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Research Team
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Join Our Lab
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} IoTrust Lab, {labInfo.university.name}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
              Advancing IoT Security Research
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 