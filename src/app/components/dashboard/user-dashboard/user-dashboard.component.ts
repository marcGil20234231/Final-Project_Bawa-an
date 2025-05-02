import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';
import { Enrollment } from '../../../models/enrollment.model';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  enrolledCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  isLoading = true;
  error = '';

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.error = 'Please log in to view your dashboard';
      this.isLoading = false;
      return;
    }

    // Load enrolled courses
    this.enrollmentService.getStudentEnrollments(currentUser.id).subscribe({
      next: (enrollments) => {
        const courseIds = enrollments.map(e => e.courseId);
        this.courseService.getCourses().subscribe({
          next: (courses) => {
            this.enrolledCourses = courses.filter(course => courseIds.includes(course.id));
            this.loadRecommendedCourses();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading courses:', err);
            this.error = 'Failed to load courses';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.error = 'Failed to load enrollments';
        this.isLoading = false;
      }
    });
  }

  loadRecommendedCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        // Filter out already enrolled courses
        this.recommendedCourses = courses
          .filter(course => !this.enrolledCourses.some(ec => ec.id === course.id))
          .slice(0, 3); // Show only 3 recommended courses
      },
      error: (err) => {
        console.error('Error loading recommended courses:', err);
      }
    });
  }

  getCourseProgress(courseId: number): number {
    // This should be implemented based on actual progress tracking
    return Math.floor(Math.random() * 100); // Placeholder
  }
}