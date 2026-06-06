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
    <article className="grid gap-6 py-8 sm:py-10 lg:grid-cols-[13rem_minmax(0,1fr)_17rem]">
      <div>
        <p className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {course.code}
        </p>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
          {course.level}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {course.credits} credits
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {course.institution}
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
          {course.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {course.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/[0.07] dark:text-gray-300"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Terms
        </h4>
        <p className="mt-3 text-base font-medium text-gray-950 dark:text-white">
          {course.terms.join(", ")}
        </p>

        {course.prerequisites && course.prerequisites.length > 0 ? (
          <div className="mt-6 border-t border-gray-200 pt-5 dark:border-white/10">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Prerequisites
            </h4>
            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {course.prerequisites.join(", ")}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}


