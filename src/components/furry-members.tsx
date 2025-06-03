import Image from 'next/image';
import { getFurryMembers } from '@/lib/data';

export async function FurryMembers() {
  const furryMembers = await getFurryMembers();

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Furry Lab Members</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Meet our four-legged colleagues who keep the lab running smoothly
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {furryMembers.map((member) => {
            const hasImage = Boolean(member.image);
            
            return (
              <div key={member.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex-shrink-0 relative">
                    {hasImage && (
                      <Image
                        src={member.image!}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full"
                        sizes="128px"
                      />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-1">
                  {member.role}
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
                
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    🐾 Essential Team Member
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 