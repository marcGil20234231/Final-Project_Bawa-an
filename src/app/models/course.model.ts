export interface Course {
    [x: string]: any;
      id: number;
      title: string;
      description: string;
      imageUrl: string;
      videoUrl?: string;
      teacherId: number;
      category: string;
      level: 'Beginner' | 'Intermediate' | 'Advanced';
      duration: number; // in hours
      topics: string[];
      students: number[];
      rating?: number;
      createdAt: Date;
      updatedAt: Date;
    }