import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { TeacherService } from '../../services/teacher.service';
import { Course } from '../../models/course.model';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  featuredTeachers: Teacher[] = [];

  constructor(
    private courseService: CourseService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedCourses();
    this.loadFeaturedTeachers();
  }

  loadFeaturedCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.featuredCourses = courses.slice(0, 3);
    });
  }

  loadFeaturedTeachers(): void {
    this.teacherService.getTeachers().subscribe(teachers => {
      this.featuredTeachers = teachers.slice(0, 4);
    });
  }
}