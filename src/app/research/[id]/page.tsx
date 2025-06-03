import { notFound, redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { ResearchProjectJSON } from '@/components/research-project-json';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: string;
  image: string;
  funding?: {
    agency: string;
    amount: string;
    duration: string;
  };
  team: string[];
  keywords: string[];
  publications: number;
  impact: string;
  type: 'native' | 'json' | 'static';
}

interface ResearchProjectsData {
  featuredProjects: ResearchProject[];
}

async function getProject(id: string): Promise<ResearchProject | null> {
  try {
    const projectsPath = path.join(process.cwd(), 'src/data/research-projects.json');
    const projectsFile = await fs.readFile(projectsPath, 'utf8');
    const projectsData: ResearchProjectsData = JSON.parse(projectsFile);
    
    return projectsData.featuredProjects.find(project => project.id === id) || null;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

async function getProjectJSON(id: string) {
  try {
    const jsonPath = path.join(process.cwd(), `src/data/research-projects/${id}.json`);
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(jsonFile);
  } catch (error) {
    console.error('Error loading project JSON:', error);
    return null;
  }
}

export default async function ResearchProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  
  if (!project) {
    notFound();
  }

  // Handle different project types
  switch (project.type) {
    case 'native':
      // Native pages have their own dedicated routes, so this shouldn't be reached
      // But just in case, return not found to prevent conflicts
      notFound();
      
    case 'json':
      const projectData = await getProjectJSON(id);
      if (!projectData) {
        notFound();
      }
      return <ResearchProjectJSON project={project} data={projectData} />;
      
    case 'static':
      // Redirect to static HTML page
      redirect(`/static/research/${id}/index.html`);
      
    default:
      notFound();
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const projectsPath = path.join(process.cwd(), 'src/data/research-projects.json');
    const projectsFile = await fs.readFile(projectsPath, 'utf8');
    const projectsData: ResearchProjectsData = JSON.parse(projectsFile);
    
    // Only generate params for JSON and static types
    // Native types have their own dedicated pages
    return projectsData.featuredProjects
      .filter(project => project.type === 'json' || project.type === 'static')
      .map((project) => ({
        id: project.id,
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
} 