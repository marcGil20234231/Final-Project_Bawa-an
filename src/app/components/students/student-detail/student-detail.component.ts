import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  enrolledCourses: Course[] = [];
  loading = true;
  isAdmin = false;
  isOwnProfile = false;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // In a real app, you would check if user is admin or the logged-in student
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const userId = localStorage.getItem('userId');
        if (userId && userId === id) {
          this.isOwnProfile = true;
        }
        
        this.loadStudent(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.student = student;
        if (student && student.enrolledCourses && student.enrolledCourses.length > 0) {
          this.loadEnrolledCourses(student.enrolledCourses);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching student:', error);
        this.loading = false;
      }
    });
  }

  loadEnrolledCourses(courseIds: number[]): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses.filter(course => courseIds.includes(course.id));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        this.loading = false;
      }
    });
  }
}