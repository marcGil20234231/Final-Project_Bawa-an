export interface User {
    subscribe(arg0: (user: User | null) => void): unknown;
    role: string;
    id: number;
    username: string;
    email: string;
    password?: string;
    fullName: string;
    isAdmin: boolean;
    avatar?: string;
    createdAt: Date;
    
    name: string;
    
    completedCourses: number;
    achievements?: string[]; // Add this property
  }