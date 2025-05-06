export interface Teacher {
    id: number;
    name: string;
    email: string;
    specialization: string;
    bio: string;
    courses: number[];
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
}