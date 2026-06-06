import type { Metadata } from "next";
import { CourseCard } from "@/components/course-card";
import { PageIntro } from "@/components/page-intro";
import { getCourses } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Courses",
  description: "Courses taught by IoTrust Lab members across digital systems, cyber-physical systems security, and applied network security.",
  path: "/courses",
});

export default async function CoursesPage() {
  const courses = await getCourses();
  const institutions = new Set(courses.map((course) => course.institution)).size;
  const latestTerms = courses
    .flatMap((course) => course.terms)
    .slice(0, 4)
    .join(" / ");

  return (
    <main className="bg-white dark:bg-gray-950">
      <PageIntro
        eyebrow="Courses"
        title="Teaching that connects systems, security, and implementation."
        lede="A compact catalog of courses taught across digital systems, CPS security, and applied network security."
      >
        <dl className="grid max-w-3xl grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Courses</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {courses.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Institutions</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">
              {institutions}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Recent terms</dt>
            <dd className="mt-1 text-sm font-semibold leading-6 text-gray-950 dark:text-white">
              {latestTerms}
            </dd>
          </div>
        </dl>
      </PageIntro>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
