import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SearchService, SearchResult } from '../../services/search.service';
import { Course } from '../../models/course.model';
import { Teacher } from '../../models/teacher.model';
import { Resource } from '../../models/resource.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <h1 class="mb-4">Search Results for "{{ searchTerm }}"</h1>

      <!-- Courses Section -->
      <div *ngIf="courses.length > 0" class="mb-5">
        <h2 class="mb-3">Courses</h2>
        <div class="row g-4">
          <div *ngFor="let course of courses" class="col-md-6 col-lg-4">
            <div class="card h-100">
              <img [src]="course.imageUrl || '/assets/images/default-course.jpg'" class="card-img-top" [alt]="course.title">
              <div class="card-body">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">{{ course.description | slice:0:100 }}...</p>
                <a [routerLink]="['/courses', course.id]" class="btn btn-danger">View Course</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Teachers Section -->
      <div *ngIf="teachers.length > 0" class="mb-5">
        <h2 class="mb-3">Teachers</h2>
        <div class="row g-4">
          <div *ngFor="let teacher of teachers" class="col-md-6 col-lg-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ teacher.name }}</h5>
                <p class="card-text">{{ teacher.bio | slice:0:100 }}...</p>
                <a [routerLink]="['/teachers', teacher.id]" class="btn btn-danger">View Profile</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resources Section -->
      <div *ngIf="resources.length > 0" class="mb-5">
        <h2 class="mb-3">Resources</h2>
        <div class="row g-4">
          <div *ngFor="let resource of resources" class="col-md-6 col-lg-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ resource.title }}</h5>
                <p class="card-text">{{ resource.description | slice:0:100 }}...</p>
                <a [href]="resource.url" target="_blank" class="btn btn-danger">View Resource</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!courses.length && !teachers.length && !resources.length" class="alert alert-info">
        No results found for "{{ searchTerm }}". Try different keywords or browse our courses, teachers, and resources.
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  searchTerm: string = '';
  courses: Course[] = [];
  teachers: Teacher[] = [];
  resources: Resource[] = [];

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const term = params['term'];
      if (term) {
        this.searchTerm = term;
        this.searchService.searchAll(term).subscribe({
          next: (results) => {
            this.courses = results.courses;
            this.teachers = results.teachers;
            this.resources = results.resources;
          },
          error: (error) => {
            console.error('Error performing search:', error);
          }
        });
      }
    });
  }
} 