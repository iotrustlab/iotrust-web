interface Course {
  id: string;
  title: string;
  code: string;
  institution: string;
  terms: string[];
  description: string;
  level: string;
  credits: number;
  prerequisites?: string[];
  topics: string[];
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {course.institution}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {course.level}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {course.credits} credits
          </p>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {course.description}
      </p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Terms Taught
        </h4>
        <div className="flex flex-wrap gap-2">
          {course.terms.map((term) => (
            <span
              key={term}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {term}
            </span>
          ))}
        </div>
      </div>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Prerequisites
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {course.prerequisites.join(', ')}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Topics Covered
        </h4>
        <div className="flex flex-wrap gap-2">
          {course.topics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

