export interface LabInfo {
    lead: {
        name: string;
        title: string;
        department: string;
        university: string;
        email: string;
        bio: string;
        image: string;
        credentials: string;
    };
    banner?: {
        enabled: boolean;
        image: string;
        alt: string;
        showOnMobile: boolean;
        position: 'above-title' | 'below-title';
        height: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
        fullWidth?: boolean;
    };
    mission: string;
    focus_areas: string[];
    university: {
        name: string;
        department: string;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
    };
} 