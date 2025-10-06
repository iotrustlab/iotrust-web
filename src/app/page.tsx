import Link from 'next/link';
import Image from 'next/image';
import { ResearchCard } from '@/components/research-card';
import { PublicationCard } from '@/components/publication-card';
import { TeamMemberCard } from '@/components/team-member-card';
import { LabBanner } from '@/components/lab-banner';
import LogoMark from '@/components/logo-mark';
import { getLabInfo, getFeaturedProjects, getPublications, getPrincipalInvestigator, getCurrentTeam, getFurryMembers } from '@/lib/data';

export default async function HomePage() {
  const [labInfo, featuredProjects, recentPublications, principalInvestigator, currentTeam, furryMembers] = await Promise.all([
    getLabInfo(),
    getFeaturedProjects(),
    getPublications(),
    getPrincipalInvestigator(),
    getCurrentTeam(),
    getFurryMembers()
  ]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Academic Hero Section */}
      <section id="home" className="relative bg-gray-50 dark:bg-[#0f141a] pt-20 sm:pt-24 pb-8 sm:pb-10">
        <div className={`mx-auto ${labInfo.banner?.fullWidth ? '' : 'max-w-7xl px-6 lg:px-8'}`}>
          <div className={`mx-auto ${labInfo.banner?.fullWidth ? '' : 'max-w-4xl'} text-center flex flex-col items-center justify-start`}>
            {/* Lab Banner Image - Above Title */}
            {labInfo.banner?.enabled && labInfo.banner.position === 'above-title' && (
              <LabBanner
                image={labInfo.banner.image}
                alt={labInfo.banner.alt}
                showOnMobile={labInfo.banner.showOnMobile}
                height={labInfo.banner.height}
                fullWidth={labInfo.banner.fullWidth}
              />
            )}
            
            <div className={labInfo.banner?.fullWidth ? 'max-w-4xl mx-auto px-6 lg:px-8' : ''}>
            {/* Logo prominently featured */}
            <div className={labInfo.banner?.fullWidth ? 'max-w-4xl mx-auto px-6 lg:px-8' : ''}>
              <div className="mx-auto mt-0 mb-4 min-h-[160px] sm:min-h-[192px] flex items-center justify-center">
                <LogoMark size={256} className="mx-auto" />
              </div>
            </div>
            <h1 className="sr-only">IoTrust Lab — University of Utah</h1>
            <p className="mt-2 text-3xl sm:text-4xl font-semibold">Trustworthy Autonomy via Semantic Foundations</p>

            {/* Lab Banner Image - Below Title */}
            {labInfo.banner?.enabled && labInfo.banner.position === 'below-title' && (
              <div className="mt-1">
                <LabBanner
                  image={labInfo.banner.image}
                  alt={labInfo.banner.alt}
                  showOnMobile={labInfo.banner.showOnMobile}
                  height={labInfo.banner.height}
                  fullWidth={labInfo.banner.fullWidth}
                />
              </div>
            )}
            
            <p className="mt-2 text-base leading-snug text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {labInfo.mission}
            </p>

            <div className="mt-3">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">
                Research Focus Areas
              </h3>
              <div className="flex flex-wrap justify-center gap-1">
                {labInfo.focus_areas.map((area) => (
                  <span 
                    key={area}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2.5 py-0.5 rounded-md text-xs font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-x-5">
              <a
                href="#research"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Explore Research
              </a>
              <a href="#publications" className="text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 hover:underline">
                View Publications →
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Research Projects */}
      <section id="research" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Research Projects
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Current research initiatives advancing the state of cyber-physical systems security.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <ResearchCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section id="publications" className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Recent Publications
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Latest contributions to the academic literature in cybersecurity research.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {recentPublications.slice(0, 4).map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/publications"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              View All Publications →
            </Link>
          </div>
        </div>
      </section>

      {/* Principal Investigator */}
      <section id="people" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Research Team
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Meet the researchers driving innovation in cyber-physical systems security.
            </p>
          </div>
          
          {/* Principal Investigator */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Principal Investigator
            </h3>
            <div className="flex justify-center">
              <div className="max-w-md">
                {principalInvestigator.map((member) => (
                  <TeamMemberCard key={member.id} member={member} isPI={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Current Team */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Current Team
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Furry Members Section */}
          <div className="mt-20">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Furry Members
              </h3>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Our beloved four-legged colleagues who keep the lab spirits high.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {furryMembers.map((member) => {
                const hasImage = Boolean(member.image);
                
                return (
                  <div 
                    key={member.id} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl relative">
                      {hasImage && (
                        <Image 
                          src={member.image!} 
                          alt={member.name}
                          fill
                          className="rounded-full object-cover object-[50%_30%]"
                          sizes="96px"
                        />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {member.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                      {member.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="bg-blue-50 dark:bg-blue-900/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Join Our Team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We are always looking for talented and enthusiastic individuals to collaborate with us in advancing the frontiers of cybersecurity research. While we don&apos;t have any specific openings at the moment, we believe in building relationships with passionate researchers.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Whether you&apos;re a prospective PhD student, postdoctoral researcher, or interested in collaboration opportunities, we&apos;d love to hear from you. When new positions become available, they will be posted here.
            </p>
            <div className="mt-10">
              <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                We welcome
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['PhD Students', 'Postdoctoral Researchers', 'Visiting Scholars', 'Undergraduate Researchers', 'Collaborations'].map((type) => (
                  <span 
                    key={type}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10">
              <a
                href={`mailto:${labInfo.lead.email}?subject=Research Collaboration Inquiry`}
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Contact Us
            </h2>
            <div className="mt-8 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {labInfo.lead.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {labInfo.lead.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {labInfo.university.department}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {labInfo.university.name}
                </p>
                <p className="mt-2">
                  <a 
                    href={`mailto:${labInfo.lead.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {labInfo.lead.email}
                  </a>
                </p>
              </div>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>{labInfo.university.address.street}</p>
                <p>{labInfo.university.address.city}, {labInfo.university.address.state} {labInfo.university.address.zip}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
