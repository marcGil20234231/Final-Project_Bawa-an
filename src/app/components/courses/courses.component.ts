import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private courseService: CourseService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.error = null;
    
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== id);
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          alert('Failed to delete course. Please try again.');
        }
      });
    }
  }
}