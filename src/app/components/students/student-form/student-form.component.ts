import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId: number | null = null;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {
    this.studentForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.studentId = +id;
        this.loadStudent(+id);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      studentId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')]],
      yearLevel: ['', Validators.required],
      program: ['', Validators.required],
      major: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: [''],
      bio: [''],
      academicInterests: this.fb.array([]),
      achievements: this.fb.array([])
    });
  }

  get f() { return this.studentForm.controls; }
  get academicInterests() { return this.f['academicInterests'] as FormArray; }
  get achievements() { return this.f['achievements'] as FormArray; }

  loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        // Reset the form arrays first
        while (this.academicInterests.length) {
          this.academicInterests.removeAt(0);
        }
        while (this.achievements.length) {
          this.achievements.removeAt(0);
        }
        
        // Populate form with student data
        this.studentForm.patchValue({
          name: student.name,
          studentId: student.studentId,
          yearLevel: student.yearLevel,
          program: student.program,
          major: student.major,
          email: student.email,
          profileImage: student.profileImage,
          bio: student.bio
        });
        
        // Add academic interests
        if (student.academicInterests && student.academicInterests.length > 0) {
          student.academicInterests.forEach((interest: any) => {
            this.academicInterests.push(this.fb.control(interest));
          });
        }
        
        // Add achievements
        if (student.achievements && student.achievements.length > 0) {
          student.achievements.forEach((achievement: { title: any; description: any; type: any; date: string; }) => {
            this.achievements.push(
              this.fb.group({
                title: [achievement.title, Validators.required],
                description: [achievement.description],
                type: [achievement.type],
                date: [this.formatDate(achievement.date)]
              })
            );
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading student:', error);
        this.loading = false;
        this.router.navigate(['/students']);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  addInterest(): void {
    this.academicInterests.push(this.fb.control(''));
  }

  removeInterest(index: number): void {
    this.academicInterests.removeAt(index);
  }

  addAchievement(): void {
    this.achievements.push(
      this.fb.group({
        title: ['', Validators.required],
        description: [''],
        type: ['Academic'],
        date: [this.formatDate(new Date().toString())]
      })
    );
  }

  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.studentForm.invalid) {
      // Scroll to the first invalid control
      const firstInvalidElement = document.querySelector('.is-invalid');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const studentData: Student = {
      ...this.studentForm.value,
      id: this.isEditMode ? this.studentId! : Math.floor(Math.random() * 10000) // In a real app, the backend would generate this
    };
    
    if (this.isEditMode) {
      this.updateStudent(studentData);
    } else {
      this.createStudent(studentData);
    }
  }

  createStudent(student: Student): void {
    this.loading = true;
    this.studentService.addStudent(student).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Error creating student:', error);
        this.loading = false;
      }
    });
  }

  updateStudent(student: Student): void {
    this.loading = true;
    this.studentService.updateStudent(this.studentId!, student).subscribe({
      next: () => {
        this.router.navigate(['/students', this.studentId]);
      },
      error: (error) => {
        console.error('Error updating student:', error);
        this.loading = false;
      }
    });
  }
}