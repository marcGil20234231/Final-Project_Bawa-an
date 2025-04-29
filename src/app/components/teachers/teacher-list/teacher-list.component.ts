import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css'
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  isLoading: boolean = true;

  constructor(
    private teacherService: TeacherService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.isLoading = false;
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => {
          this.teachers = this.teachers.filter(teacher => teacher.id !== id);
        },
        error: (error) => {
          console.error('Error deleting teacher:', error);
        }
      });
    }
  }
}
