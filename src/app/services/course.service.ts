import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {
    // Verify API URL on service initialization
    console.log('CourseService initialized with API URL:', this.apiUrl);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 404) {
      return throwError(() => new Error('Course not found'));
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getCourses(): Observable<Course[]> {
    console.log('Fetching all courses from:', this.apiUrl);
    return this.http.get<Course[]>(this.apiUrl).pipe(
      tap(courses => console.log('Fetched courses:', courses)),
      catchError(this.handleError)
    );
  }

  getCourse(id: number): Observable<Course> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching course from:', url);
    
    return this.http.get<Course>(url).pipe(
      tap(course => {
        console.log('Raw course data received:', course);
        if (!course) {
          throw new Error('Course not found');
        }
      }),
      catchError(this.handleError)
    );
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    const newCourse = {
      ...course,
      students: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.http.post<Course>(this.apiUrl, newCourse).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    const url = `${this.apiUrl}/${id}`;
    const updatedCourse = {
      ...course,
      updatedAt: new Date()
    };
    return this.http.put<Course>(url, updatedCourse).pipe(
      catchError(this.handleError)
    );
  }

  deleteCourse(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  searchCourses(term: string): Observable<Course[]> {
    const url = `${this.apiUrl}?q=${term}`;
    return this.http.get<Course[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  isUserEnrolled(userId: number, courseId: number): Observable<boolean> {
    return this.getCourse(courseId).pipe(
      map(course => course.students?.includes(userId) || false),
      catchError(error => {
        console.error('Error checking enrollment:', error);
        return throwError(() => error);
      })
    );
  }

  enrollUserInCourse(userId: number, courseId: number): Observable<void> {
    return this.getCourse(courseId).pipe(
      map(course => {
        const students = course.students || [];
        if (!students.includes(userId)) {
          students.push(userId);
        }
        return { ...course, students };
      }),
      map(updatedCourse => this.updateCourse(courseId, updatedCourse)),
      map(() => undefined),
      catchError(error => {
        console.error('Error enrolling in course:', error);
        return throwError(() => error);
      })
    );
  }

  getEnrolledCourses(userId: number): Observable<Course[]> {
    // Replace with actual implementation returning an observable
    return this.http.get<Course[]>(`/api/courses/enrolled/${userId}`);
  }

  getRecommendedCourses(userId: string): Observable<Course[]> {
    // Replace with actual implementation returning an Observable
    return this.http.get<Course[]>(`/api/recommended-courses/${userId}`);
  }

  updateCourseImage(id: number, imageUrl: string): Observable<Course> {
    const url = `${this.apiUrl}/${id}`;
    return this.getCourse(id).pipe(
      map(course => ({
        ...course,
        imageUrl: imageUrl,
        updatedAt: new Date()
      })),
      switchMap(updatedCourse => this.http.put<Course>(url, updatedCourse)),
      catchError(this.handleError)
    );
  }
}