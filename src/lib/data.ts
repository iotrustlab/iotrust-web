import { promises as fs } from 'fs';
import path from 'path';
import { LabInfo } from '@/types/data';

// Types
export interface Project {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'proposed';
    image: string;
    funding?: {
        agency: string;
        amount: string;
        duration: string;
    };
    team: string[]; // Array of person IDs
    keywords: string[];
    publications: number;
    impact: string;
    type: 'native' | 'static' | 'json';
}

export interface Person {
    id: string;
    name: string;
    role: string;
    title?: string;
    email: string;
    image: string;
    bio?: string;
    research_interests?: string[];
    education?: Array<{
        degree: string;
        institution: string;
        year: string | number;
        focus?: string;
    }>;
    experience?: Array<{
        position: string;
        institution: string;
        department?: string;
        duration: string;
    }>;
    current_projects?: string[];
    publications_count?: number;
    website?: string;
    linkedin?: string;
    google_scholar?: string;
    github?: string;
    twitter?: string;
    research_statement?: string;
    research_questions?: string[];
    type: 'native' | 'static' | 'json';
}

export interface FurryMember {
    id: string;
    name: string;
    role: string;
    title: string;
    description: string;
    image: string;
}

export interface Publication {
    id: string;
    title: string;
    authors: string[];
    venue: string;
    year: number;
    type: 'journal' | 'conference' | 'workshop' | 'preprint';
    doi?: string;
    abstract: string;
    keywords: string[];
    citations?: number;
    url?: string;
}

interface PeopleIndex {
    principalInvestigator: Array<{ id: string; type: 'native' | 'static' | 'json' }>;
    postdocs: Array<{ id: string; type: 'native' | 'static' | 'json' }>;
    phdStudents: Array<{ id: string; type: 'native' | 'static' | 'json' }>;
    undergrads: Array<{ id: string; type: 'native' | 'static' | 'json' }>;
    alumni: Array<{ id: string; type: 'native' | 'static' | 'json' }>;
    furryMembers: FurryMember[];
}

// Utility functions
export async function getLabInfo(): Promise<LabInfo> {
    const filePath = path.join(process.cwd(), 'src/data/lab-info.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
}

export async function getProjects(): Promise<Project[]> {
    const filePath = path.join(process.cwd(), 'src/data/research-projects.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    return data.featuredProjects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
    return await getProjects();
}

export async function getProject(id: string): Promise<Project | null> {
    const projects = await getProjects();
    return projects.find(project => project.id === id) || null;
}

// Get people index (IDs and types only)
async function getPeopleIndex(): Promise<PeopleIndex> {
    const filePath = path.join(process.cwd(), 'src/data/people-index.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
}

// Get all people by loading their individual profiles
export async function getPeople(): Promise<Person[]> {
    const index = await getPeopleIndex();
    const people: Person[] = [];

    // Add PI
    for (const personRef of index.principalInvestigator) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    // Add postdocs
    for (const personRef of index.postdocs) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    // Add PhD students
    for (const personRef of index.phdStudents) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    // Add undergrads
    for (const personRef of index.undergrads) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    return people;
}

// Get Principal Investigator
export async function getPrincipalInvestigator(): Promise<Person[]> {
    const index = await getPeopleIndex();
    const people: Person[] = [];

    for (const personRef of index.principalInvestigator) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    return people;
}

// Get current team members
export async function getCurrentTeam(): Promise<Person[]> {
    const index = await getPeopleIndex();
    const people: Person[] = [];

    // Combine all non-PI, non-alumni active members
    const activeGroups = [
        ...index.postdocs,
        ...index.phdStudents,
        ...index.undergrads,
    ];

    for (const personRef of activeGroups) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    return people;
}

// Get alumni
export async function getAlumni(): Promise<Person[]> {
    const index = await getPeopleIndex();
    const people: Person[] = [];

    for (const personRef of index.alumni) {
        try {
            const person = await getPerson(personRef.id);
            if (person) {
                people.push(person);
            }
        } catch {
            console.warn(`Failed to load profile for ${personRef.id}`);
        }
    }

    return people;
}

export async function getFurryMembers(): Promise<FurryMember[]> {
    const index = await getPeopleIndex();
    return index.furryMembers;
}

// Get individual person profile (single source of truth)
export async function getPerson(id: string): Promise<Person | null> {
    try {
        const profilePath = path.join(process.cwd(), `src/data/profiles/${id}.json`);
        const jsonData = await fs.readFile(profilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch {
        console.warn(`Profile not found for person ID: ${id}`);
        return null;
    }
}

export async function getPersonByType(id: string, type: 'native' | 'static' | 'json'): Promise<Person | null> {
    const person = await getPerson(id);
    return person && person.type === type ? person : null;
}

export async function getProjectByType(id: string, type: 'native' | 'static' | 'json'): Promise<Project | null> {
    const project = await getProject(id);
    return project && project.type === type ? project : null;
}

export async function getTeamMembers(): Promise<Person[]> {
    // This is for backward compatibility - now we just get all people
    return await getPeople();
}

export async function getPublications(): Promise<Publication[]> {
    const filePath = path.join(process.cwd(), 'src/data/publications.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    return data.recentPublications;
}

// Helper function to resolve team member names from IDs
export async function resolveTeamMembers(teamIds: string[]): Promise<Person[]> {
    const resolvedMembers: Person[] = [];

    for (const id of teamIds) {
        const person = await getPerson(id);
        if (person) {
            resolvedMembers.push(person);
        }
    }

    return resolvedMembers;
}

// Helper function to get projects by person ID
export async function getProjectsByPersonId(personId: string): Promise<Project[]> {
    const projects = await getProjects();
    return projects.filter(project => project.team.includes(personId));
}

// Get people IDs and types for routing
export async function getPeopleTypes(): Promise<Array<{ id: string; type: 'native' | 'static' | 'json' }>> {
    const index = await getPeopleIndex();
    return [
        ...index.principalInvestigator,
        ...index.postdocs,
        ...index.phdStudents,
        ...index.undergrads,
        ...index.alumni,
    ];
}

// Static data loaders for client-side usage
export function getProjectsByType() {
    // This will be implemented as a client-side utility
    return [];
}

export function getPeopleByType() {
    // This will be implemented as a client-side utility
    return [];
}

export async function parseBibFile(): Promise<Publication[]> {
    const filePath = path.join(process.cwd(), 'src/data/publications/references.bib');
    const bibContent = await fs.readFile(filePath, 'utf8');

    const publications: Publication[] = [];
    const entries = bibContent.split('\n\n').filter(entry => entry.trim());

    for (const entry of entries) {
        try {
            const titleMatch = entry.match(/title=\{([^}]+)\}/);
            const authorsMatch = entry.match(/author=\{([^}]+)\}/);
            const yearMatch = entry.match(/year=\{(\d+)\}/);
            const venueMatch = entry.match(/(journal|booktitle)=\{([^}]+)\}/);
            const doiMatch = entry.match(/doi=\{([^}]+)\}/);
            const keywordsMatch = entry.match(/keywords=\{([^}]+)\}/);

            if (titleMatch && authorsMatch && yearMatch && venueMatch) {
                const type = entry.startsWith('@article') ? 'journal' : 'conference';
                const authors = authorsMatch[1].split(' and ').map(author => author.trim());
                const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];

                publications.push({
                    id: `pub-${publications.length + 1}`,
                    title: titleMatch[1],
                    authors,
                    venue: venueMatch[2],
                    year: parseInt(yearMatch[1]),
                    type,
                    doi: doiMatch ? doiMatch[1] : undefined,
                    keywords,
                    abstract: '', // Bib entries don't typically include abstracts
                });
            }
        } catch (error) {
            console.error('Error parsing bib entry:', error);
        }
    }

    return publications;
}

// Course interfaces and functions
export interface Course {
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

export async function getCourses(): Promise<Course[]> {
    const filePath = path.join(process.cwd(), 'src/data/courses.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    return data.courses;
} 