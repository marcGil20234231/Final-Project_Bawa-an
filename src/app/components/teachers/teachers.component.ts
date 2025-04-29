import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TeacherComponent implements OnInit {
  teacherForm: FormGroup;
  teachers: Teacher[] = [];
  isEditing = false;
  currentTeacherId: number | null = null;

  constructor(private fb: FormBuilder, private teacherService: TeacherService) {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      biography: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe(
      (teachers) => {
        this.teachers = teachers;
      },
      (error) => {
        console.error('Error loading teachers:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const teacherData = this.teacherForm.value;
      
      if (this.isEditing && this.currentTeacherId !== null) {
        // Update existing teacher
        const index = this.teachers.findIndex(t => t.id === this.currentTeacherId);
        if (index !== -1) {
          this.teachers[index] = { ...teacherData, id: this.currentTeacherId };
        }
      } else {
        // Add new teacher
        const newTeacher: Teacher = {
          ...teacherData,
          id: this.teachers.length > 0 ? Math.max(...this.teachers.map(t => t.id)) + 1 : 1
        };
        this.teacherService.createTeacher(newTeacher).subscribe(
          (teacher) => {
            this.teachers.push(teacher);
            this.resetForm();
          },
          (error) => {
            console.error('Error creating teacher:', error);
          }
        );
      }

      this.resetForm();
    }
  }

  editTeacher(teacher: Teacher): void {
    this.isEditing = true;
    this.currentTeacherId = teacher.id;
    this.teacherForm.patchValue({
      name: teacher.name,
      email: teacher.email,
      specialization: teacher.specialization,
      biography: teacher.biography
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe(
        () => {
          this.teachers = this.teachers.filter(t => t.id !== id);
          this.resetForm();
        },
        (error) => {
          console.error('Error deleting teacher:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.teacherForm.reset();
    this.isEditing = false;
    this.currentTeacherId = null;
  }
} 