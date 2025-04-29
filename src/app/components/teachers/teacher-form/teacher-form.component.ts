import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './teacher-form.component.html',
  styleUrl: './teacher-form.component.css'
})
export class TeacherFormComponent implements OnInit {
  teacherForm: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  get f() { return this.teacherForm.controls; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadTeacher(+id);
    }
  }

  loadTeacher(id: number): void {
    this.teacherService.getTeacher(id).subscribe({
      next: (teacher) => {
        this.teacherForm.patchValue({
          name: teacher.name,
          email: teacher.email,
          specialization: teacher.specialization,
          bio: teacher.bio
        });
      },
      error: (error) => {
        console.error('Error loading teacher:', error);
        this.router.navigate(['/teachers']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.teacherForm.invalid) {
      return;
    }

    this.loading = true;
    const teacherData = {
      ...this.teacherForm.value,
      courses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.teacherService.updateTeacher(+id, teacherData).subscribe({
          next: () => {
            this.router.navigate(['/teachers']);
          },
          error: (error) => {
            this.error = error.message || 'Error updating teacher';
            this.loading = false;
          }
        });
      }
    } else {
      this.teacherService.createTeacher(teacherData).subscribe({
        next: () => {
          this.router.navigate(['/teachers']);
        },
        error: (error) => {
          this.error = error.message || 'Error creating teacher';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/teachers']);
  }
}