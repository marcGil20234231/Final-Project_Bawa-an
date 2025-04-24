import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { TeacherService } from '../../../services/teacher.service';
import { StudentService } from '../../../services/student.service';
import { Course } from '../../../models/course.model';
import { Teacher } from '../../../models/teacher.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  courses: Course[] = [];
  teachers: Teacher[] = [];
  students: Student[] = [];
  recentCourses: Course[] = [];

  isLoading: boolean = true;
  error: string = '';
  
  constructor(
    private courseService: CourseService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.error = '';
    this.courseService.getCourses().subscribe({
      next: courses => {
        console.log('Courses:', courses);
        this.teacherService.getTeachers().subscribe({
          next: teachers => {
            console.log('Teachers:', teachers);
            this.courses = courses;
            this.teachers = teachers;
            // Map instructor name to each course
            this.recentCourses = courses.slice(0, 5).map(course => {
              const teacher = teachers.find(t => t.id === course.teacherId);
              return {
                ...course,
                instructorName: teacher ? teacher.name : 'Unknown'
              };
            });
            this.isLoading = false;
          },
          error: err => {
            console.error('Error loading teachers:', err);
            this.error = 'Failed to load teachers.';
            this.isLoading = false;
          }
        });
      },
      error: err => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load courses.';
        this.isLoading = false;
      }
    });
    
    this.studentService.getStudents().subscribe({
      next: students => {
        console.log('Students:', students);
        this.students = students;
      },
      error: err => {
        console.error('Error loading students:', err);
        this.error = 'Failed to load students.';
      }
    });
  }

  deleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          // Remove the student from the local array
          this.students = this.students.filter(s => s.id !== studentId);
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        }
      });
    }
  }
}