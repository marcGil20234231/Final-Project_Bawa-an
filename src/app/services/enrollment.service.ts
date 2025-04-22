import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  enrollStudent(studentId: number, courseId: number): Observable<Enrollment> {
    return this.getStudentEnrollments(studentId).pipe(
      switchMap(enrollments => {
        // Check if student is already enrolled in this course
        const existingEnrollment = enrollments.find(e => e.courseId === courseId && e.status === 'active');
        if (existingEnrollment) {
          return throwError(() => new Error('Already enrolled in this course'));
        }
        
        // If not enrolled, create new enrollment
        const enrollment = {
          studentId,
          courseId,
          enrollmentDate: new Date().toISOString(),
          status: 'active',
          progress: 0,
          lastAccessed: new Date().toISOString()
        };
        return this.http.post<Enrollment>(this.apiUrl, enrollment);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getStudentEnrollments(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}?studentId=${studentId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getCourseEnrollments(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}?courseId=${courseId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateEnrollmentStatus(enrollmentId: number, status: string): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.apiUrl}/${enrollmentId}`, { status }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
} 