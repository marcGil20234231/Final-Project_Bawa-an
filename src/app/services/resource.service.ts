import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Resource } from '../models/resource.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = 'http://localhost:3000/resources';
  private coursesUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 404) {
      return throwError(() => new Error('Resource not found'));
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl).pipe(
      tap(resources => console.log('Fetched resources:', resources)),
      catchError(this.handleError)
    );
  }

  getResource(id: number): Observable<Resource> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Resource>(url).pipe(
      tap(resource => console.log('Fetched resource:', resource)),
      catchError(this.handleError)
    );
  }

  createResource(resource: Partial<Resource>): Observable<Resource> {
    const newResource = {
      ...resource,
      createdAt: new Date().toISOString(),
      downloadCount: 0
    };
    return this.http.post<Resource>(this.apiUrl, newResource).pipe(
      tap(resource => console.log('Created resource:', resource)),
      catchError(this.handleError)
    );
  }

  updateResource(id: number, resource: Partial<Resource>): Observable<Resource> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Resource>(url, resource).pipe(
      tap(resource => console.log('Updated resource:', resource)),
      catchError(this.handleError)
    );
  }

  deleteResource(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Deleted resource with id:', id)),
      catchError(this.handleError)
    );
  }

  searchResources(query: string): Observable<Resource[]> {
    // Encode the query to handle special characters
    const encodedQuery = encodeURIComponent(query);
    // Use json-server's q parameter for full-text search
    const url = `${this.apiUrl}?q=${encodedQuery}`;
    return this.http.get<Resource[]>(url).pipe(
      tap(resources => console.log('Search results:', resources)),
      catchError(this.handleError)
    );
  }

  filterByCategory(category: string): Observable<Resource[]> {
    const url = `${this.apiUrl}?category=${category}`;
    return this.http.get<Resource[]>(url).pipe(
      tap(resources => console.log('Filtered resources:', resources)),
      catchError(this.handleError)
    );
  }

  incrementDownloadCount(id: number): Observable<Resource> {
    return this.getResource(id).pipe(
      tap(resource => {
        const updatedResource = {
          ...resource,
          downloadCount: (resource.downloadCount || 0) + 1
        };
        return this.updateResource(id, updatedResource);
      }),
      catchError(this.handleError)
    );
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl);
  }
} 