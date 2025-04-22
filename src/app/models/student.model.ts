export interface Student {
    achievements: any;
    academicInterests: any;
    bio: any;
    major: any;
    yearLevel: any;
    studentId: any;
    program: any;
    name: any;
    profileImage: any;
      id: number;
      userId?: number;
      fullName: string;
      email: string;
      imageUrl?: string;
      dateOfBirth?: Date;
      educationalBackground?: string;
      enrolledCourses: number[]; // course IDs
      completedCourses: number[]; // course IDs
      progress?: {
        courseId: number;
        progressPercentage: number;
        lastAccessed: Date;
      }[];
      createdAt: Date;
      updatedAt: Date;
    }