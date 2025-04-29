import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { SafePipe } from "../../../pipes/safe.pipe";
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Enrollment } from '../../../models/enrollment.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  currentUser: User | null = null;
  isEnrolled: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;
  canEnroll = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.error = 'Please log in to view course details';
      this.isLoading = false;
      return;
    }

    const courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID from route:', courseId);
    
    if (courseId) {
      this.loadCourse(+courseId);
      this.checkUserRole();
    } else {
      this.router.navigate(['/courses']);
    }
  }
  
  loadCourse(id: number): void {
    this.isLoading = true;
    this.error = null;
    console.log('Loading course with ID:', id);
    
    this.courseService.getCourse(id).pipe(
      tap(course => console.log('Raw course data:', course)),
      catchError(error => {
        console.error('Error details:', error);
        this.error = 'Course not found. Please check the URL and try again.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe({
      next: (course) => {
        if (course) {
          console.log('Course loaded successfully:', course);
          this.course = course;
          this.checkEnrollmentStatus();
        }
        this.isLoading = false;
      }
    });
  }
  
  checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.isAdmin = user.role === 'admin';
      console.log('Current user:', user);
      this.checkEnrollmentStatus();
    }
  }
  
  checkEnrollmentStatus(): void {
    if (!this.currentUser) {
      console.error('No user logged in');
      return;
    }
    if (!this.course) {
      console.error('No course loaded');
      return;
    }

    console.log('Checking enrollment status for user:', this.currentUser.id, 'in course:', this.course.id);
    
    this.enrollmentService.getStudentEnrollments(this.currentUser.id).subscribe({
      next: (enrollments) => {
        console.log('Current enrollments:', enrollments);
        this.isEnrolled = enrollments.some(e => e.courseId === this.course?.id && e.status === 'active');
        this.canEnroll = true;
        console.log('Enrollment status:', this.isEnrolled);
      },
      error: (error) => {
        console.error('Error checking enrollment:', error);
        this.error = 'Failed to check enrollment status';
      }
    });
  }
  
  enrollInCourse(): void {
    if (!this.currentUser) {
      this.error = 'Please log in to enroll in this course';
      return;
    }
    if (!this.course) {
      this.error = 'Course not found';
      return;
    }

    console.log('Attempting to enroll user:', this.currentUser.id, 'in course:', this.course.id);
    this.isLoading = true;
    this.error = null;
    
    this.enrollmentService.enrollStudent(this.currentUser.id, this.course.id).subscribe({
      next: (enrollment) => {
        console.log('Enrollment successful:', enrollment);
        this.isEnrolled = true;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error enrolling in course:', error);
        if (error.message === 'Already enrolled in this course') {
          this.error = 'You are already enrolled in this course';
        } else {
          this.error = 'Failed to enroll in course. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }
}