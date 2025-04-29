import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  availableMajors: string[] = ['Computer Science', 'Information Technology', 'Software Engineering'];
  searchQuery: string = '';
  yearFilter: string = '';
  majorFilter: string = '';
  loading: boolean = true;
  isAdmin: boolean = true;
  
  // Pagination
  studentsPerPage: number = 9;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students.map(student => ({
          ...student,
          profileImage: student.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        }));
        this.filteredStudents = this.students;
        this.totalPages = Math.ceil(this.students.length / this.studentsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  extractAvailableMajors(): void {
    const majors = new Set<string>();
    this.students.forEach(student => {
      if (student.major) {
        majors.add(student.major);
      }
    });
    this.availableMajors = Array.from(majors).sort();
  }

  filterStudents(): void {
    let filtered = this.students;
    
    // Apply search query filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.studentId.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
      );
    }
    
    // Apply year level filter
    if (this.yearFilter) {
      filtered = filtered.filter(student => student.yearLevel === this.yearFilter);
    }
    
    // Apply major filter
    if (this.majorFilter) {
      filtered = filtered.filter(student => student.major === this.majorFilter);
    }
    
    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.studentsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    this.filteredStudents = filtered.slice(startIndex, startIndex + this.studentsPerPage);
  }

  setYearFilter(year: string): void {
    this.yearFilter = year;
    this.currentPage = 1;
    this.filterStudents();
  }

  setMajorFilter(major: string): void {
    this.majorFilter = major;
    this.currentPage = 1;
    this.filterStudents();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterStudents();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}