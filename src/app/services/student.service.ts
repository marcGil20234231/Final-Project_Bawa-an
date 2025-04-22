import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  addStudent(student: Student): Observable<void> {
    // Replace with actual implementation, e.g., HTTP POST
    return this.http.post<void>('/api/students', student);
  }
  private apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    const newStudent = {
      ...student,
      enrolledCourses: [],
      completedCourses: [],
      progress: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      id: Math.floor(Math.random() * 1000)
    };
    return this.http.post<Student>(this.apiUrl, newStudent);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    const updatedStudent = {
      ...student,
      updatedAt: new Date()
    };
    return this.http.put<Student>(`${this.apiUrl}/${id}`, updatedStudent);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  enrollStudent(studentId: number, courseId: number): Observable<Student> {
    return this.getStudent(studentId).pipe(
      map((student: Student) => {
        if (!student.enrolledCourses.includes(courseId)) {
          student.enrolledCourses.push(courseId);
          student.progress = [
            ...(student.progress ?? []),
            { courseId, progressPercentage: 0, lastAccessed: new Date() }
          ];
        }
        return student;
      }),
      switchMap((student: Partial<Student>) => this.updateStudent(studentId, student))
    );
  }

  searchStudents(term: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}?q=${term}`);
  }
}

function switchMap(arg0: (student: Partial<Student>) => Observable<Student>): import("rxjs").OperatorFunction<Student, Student> {
  throw new Error('Function not implemented.');
}
