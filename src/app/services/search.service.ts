import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, Subject, BehaviorSubject } from 'rxjs';
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
  private apiUrl = 'http://localhost:3001';
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

    return this.http.get<Resource[]>(`${this.apiUrl}/resources?q=${encodeURIComponent(query)}`).pipe(
      map(resources => ({
        searchTerm: query,
        courses: [],
        teachers: [],
        resources: resources
      })),
      tap(results => console.log('Search results:', results)),
      catchError(this.handleError)
    );
  }

  getSuggestions(query: string): Observable<string[]> {
    if (!query.trim()) {
      return of([]);
    }

    return this.http.get<any[]>(`${this.apiUrl}/resources?q=${encodeURIComponent(query)}`).pipe(
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
