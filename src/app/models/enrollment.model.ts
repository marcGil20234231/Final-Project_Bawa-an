export interface Enrollment {
    id?: number;
    studentId: number;
    courseId: number;
    enrollmentDate: string;
    status: 'active' | 'completed' | 'dropped';
    progress?: number;
    lastAccessed?: string;
  } 