import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { SearchService } from '../../../services/search.service';
import { Course } from '../../../models/course.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  categories: string[] = [];
  selectedCategory: string = '';
  isAdmin: boolean = false;
  
  constructor(
    private courseService: CourseService,
    private searchService: SearchService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadCourses();
    this.checkUserRole();
    
    // Subscribe to search term changes
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.searchTerm = term;
      this.filterCourses();
    });
  }
  
  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
      
      // Extract unique categories
      this.categories = [...new Set(courses.map(course => course.category))];
    });
  }
  
  checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'admin';
  }
  
  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchTerm || 
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || course.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }
  
  onCategoryChange(): void {
    this.filterCourses();
  }
  
  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    }
  }
}