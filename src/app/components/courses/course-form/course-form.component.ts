import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { TeacherService } from '../../../services/teacher.service';
import { Course } from '../../../models/course.model';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  courseId: number | null = null;
  isEditMode: boolean = false;
  teachers: Teacher[] = [];
  categories: string[] = ['Mathematics', 'Science', 'Technology', 'Language Arts', 'Social Studies', 'Arts', 'Physical Education'];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  isSubmitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      level: ['', Validators.required],
      duration: ['', Validators.required],
      teacherId: ['', Validators.required],
      imageUrl: [''],
      videoUrl: [''],
      objectives: ['', Validators.required],
      requirements: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit(): void {
    this.loadTeachers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = +id;
      this.isEditMode = true;
      this.loadCourseData(this.courseId);
    }
  }
  
  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
    });
  }
  
  loadCourseData(id: number): void {
    this.courseService.getCourse(id).subscribe(course => {
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        teacherId: course.teacherId,
        imageUrl: course.imageUrl,
        videoUrl: course.videoUrl,
        objectives: course['objectives'],
        requirements: course['requirements'],
        price: course['price']
      });
    });
  }
  
  onSubmit(): void {
    if (this.courseForm.valid) {
      this.isSubmitting = true;
      const courseData: Course = this.courseForm.value;
      
      if (this.isEditMode && this.courseId) {
        // Update existing course
        this.courseService.updateCourse(this.courseId, courseData).subscribe(
          () => {
            this.router.navigate(['/courses', this.courseId]);
          },
          error => {
            console.error('Error updating course', error);
            this.isSubmitting = false;
          }
        );
      } else {
        this.courseService.createCourse(courseData).subscribe(
          (newCourse) => {
            this.router.navigate(['/courses', newCourse.id]);
          },
          error => {
            console.error('Error creating course', error);
            this.isSubmitting = false;
          }
        );
      }
    } else {
      // Mark all form controls as touched to trigger validation
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
    }
  }
}