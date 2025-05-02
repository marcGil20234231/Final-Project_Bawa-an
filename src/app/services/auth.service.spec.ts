import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        isAdmin: false,
        createdAt: new Date(),
        subscribe: function (arg0: (user: User | null) => void): unknown {
            throw new Error('Function not implemented.');
        },
        role: '',
        fullName: '',
        name: '',
        completedCourses: 0
    };

    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users?email=test@example.com');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'wrong').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/users?email=test@example.com');
    req.flush([], { status: 404, statusText: 'Not Found' });
  });

  it('should register successfully', () => {
    const newUser: Partial<User> = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      isAdmin: false
    };

    service.register(newUser).subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.id).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newUser, id: 1, createdAt: new Date() });
  });

  it('should logout and clear user data', () => {
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
}); 