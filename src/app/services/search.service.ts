import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';
import { Resource } from '../models/resource.model';

export interface SearchResult {
  searchTerm: string;
  courses: Course[];
  teachers: Teacher[];
  resources: Resource[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000';
  private searchTerm$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Search service error:', error);
    return throwError(() => new Error('Something went wrong with the search. Please try again.'));
  }

  setSearchTerm(term: string) {
    this.searchTerm$.next(term);
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm$.asObservable();
  }

  searchAll(query: string): Observable<SearchResult> {
    if (!query.trim()) {
      return of({
        searchTerm: '',
        courses: [],
        teachers: [],
        resources: []
      });
    }

    console.log('Searching for:', query);
    const searchTerm = query.toLowerCase().trim();

    // Search for courses
    const coursesSearch = this.http.get<Course[]>(`${this.apiUrl}/courses`).pipe(
      map(courses => courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
      )),
      tap(courses => console.log('Courses found:', courses)),
      catchError(error => {
        console.error('Error searching courses:', error);
        return of([]);
      })
    );

    // Search for teachers
    const teachersSearch = this.http.get<Teacher[]>(`${this.apiUrl}/teachers`).pipe(
      map(teachers => teachers.filter(teacher => {
        const name = teacher.name?.toLowerCase() || '';
        const bio = teacher.bio?.toLowerCase() || '';
        const specialization = teacher.specialization?.toLowerCase() || '';
        
        return name.includes(searchTerm) ||
               bio.includes(searchTerm) ||
               specialization.includes(searchTerm);
      })),
      tap(teachers => console.log('Teachers found:', teachers)),
      catchError(error => {
        console.error('Error searching teachers:', error);
        return of([]);
      })
    );

    // Search for resources
    const resourcesSearch = this.http.get<Resource[]>(`${this.apiUrl}/resources`).pipe(
      map(resources => resources.filter(resource => {
        const searchTermLower = searchTerm.toLowerCase();
        return resource.title.toLowerCase().includes(searchTermLower) ||
          resource.description.toLowerCase().includes(searchTermLower) ||
          (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTermLower)));
      })),
      tap(resources => console.log('Resources found:', resources)),
      catchError(error => {
        console.error('Error searching resources:', error);
        return of([]);
      })
    );

    // Combine all search results
    return forkJoin({
      courses: coursesSearch,
      teachers: teachersSearch,
      resources: resourcesSearch
    }).pipe(
      map(results => ({
        searchTerm: query,
        courses: results.courses,
        teachers: results.teachers,
        resources: results.resources
      })),
      tap(results => console.log('Combined search results:', results)),
      catchError(this.handleError)
    );
  }

  getSuggestions(query: string): Observable<string[]> {
    if (!query.trim()) {
      return of([]);
    }

    return this.http.get<Resource[]>(`${this.apiUrl}/resources?q=${encodeURIComponent(query)}`).pipe(
      map(resources => {
        try {
          const suggestions = new Set<string>();
          
          resources.forEach(resource => {
            // Add title words as suggestions
            resource.title.split(' ').forEach((word: string) => {
              if (word.toLowerCase().includes(query.toLowerCase()) && word.length > 2) {
                suggestions.add(word);
              }
            });
            
            // Add tags as suggestions
            if (resource.tags) {
              resource.tags.forEach((tag: string) => {
                if (tag.toLowerCase().includes(query.toLowerCase())) {
                  suggestions.add(tag);
                }
              });
            }
          });

          return Array.from(suggestions).slice(0, 5);
        } catch (error) {
          console.error('Error processing suggestions:', error);
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }
}
