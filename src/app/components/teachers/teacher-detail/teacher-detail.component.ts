import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Teacher } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-detail.component.html',
  styleUrl: './teacher-detail.component.css'
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher | null = null;
  courses: Course[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private courseService: CourseService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTeacher(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadTeacher(id: number): void {
    this.teacherService.getTeacher(id).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.loadTeacherCourses(teacher.courses || []);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teacher:', error);
        this.loading = false;
      }
    });
  }

  loadTeacherCourses(courseIds: number[]): void {
    if (courseIds.length === 0) {
      this.courses = [];
      return;
    }

    const courseObservables = courseIds.map(id => 
      this.courseService.getCourse(id)
    );

    Promise.all(courseObservables.map(obs => obs.toPromise()))
      .then(courses => {
        this.courses = courses.filter(course => course !== undefined) as Course[];
      })
      .catch(error => {
        console.error('Error loading courses:', error);
        this.courses = [];
      });
  }
}