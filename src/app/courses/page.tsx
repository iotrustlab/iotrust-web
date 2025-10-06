import { getCourses } from '@/lib/data';
import { CourseCard } from '@/components/course-card';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Teaching
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Courses taught by Dr. Luis A. Garcia at the University of Utah and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

