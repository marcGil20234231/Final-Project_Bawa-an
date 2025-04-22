import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  // Admin users limited to 3
  private adminUsers = [
    { id: 1, username: 'admin1', email: 'admin1@edu.ph', isAdmin: true },
    { id: 2, username: 'admin2', email: 'admin2@edu.ph', isAdmin: true },
    { id: 3, username: 'admin3', email: 'admin3@edu.ph', isAdmin: true }
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === password) {
          delete user.password;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Invalid credentials');
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  register(user: Partial<User>): Observable<User> {
    // Check if trying to register as admin
    if (user.isAdmin) {
      const adminCount = this.adminUsers.length;
      if (adminCount >= 3) {
        return throwError(() => new Error('Maximum admin users reached (3)'));
      }
    }

    const newUser = {
      ...user,
      createdAt: new Date(),
      id: Math.floor(Math.random() * 1000)
    } as User;
    
    return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
      tap(createdUser => {
        if (createdUser.isAdmin) {
          this.adminUsers.push({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            isAdmin: true
          });
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.isAdmin;
  }
}