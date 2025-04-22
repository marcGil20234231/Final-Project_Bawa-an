import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container my-4">
      <h2>{{ isEditMode ? 'Edit Resource' : 'Add New Resource' }}</h2>
      
      <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input type="text" class="form-control" id="title" formControlName="title" required>
          <div class="invalid-feedback" *ngIf="resourceForm.get('title')?.invalid && resourceForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" formControlName="description" rows="3" required></textarea>
          <div class="invalid-feedback" *ngIf="resourceForm.get('description')?.invalid && resourceForm.get('description')?.touched">
            Description is required
          </div>
        </div>

        <div class="mb-3">
          <label for="type" class="form-label">Resource Type</label>
          <select class="form-select" id="type" formControlName="type" required>
            <option value="">Select type</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
            <option value="other">Other</option>
          </select>
          <div class="invalid-feedback" *ngIf="resourceForm.get('type')?.invalid && resourceForm.get('type')?.touched">
            Resource type is required
          </div>
        </div>

        <div class="mb-3">
          <label for="url" class="form-label">URL</label>
          <input type="url" class="form-control" id="url" formControlName="url" required>
          <div class="invalid-feedback" *ngIf="resourceForm.get('url')?.invalid && resourceForm.get('url')?.touched">
            Valid URL is required
          </div>
        </div>

        <div class="mb-3">
          <label for="courseId" class="form-label">Associated Course</label>
          <select class="form-select" id="courseId" formControlName="courseId">
            <option value="">Select course (optional)</option>
            <option *ngFor="let course of courses" [value]="course.id">{{ course.title }}</option>
          </select>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-danger" [disabled]="resourceForm.invalid">
            {{ isEditMode ? 'Update' : 'Create' }} Resource
          </button>
          <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class ResourceFormComponent implements OnInit {
  resourceForm: FormGroup;
  isEditMode = false;
  resourceId: number | null = null;
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resourceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      courseId: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.resourceId = +params['id'];
        this.loadResource();
      }
    });

    // Load courses for the dropdown
    this.resourceService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  loadResource(): void {
    if (this.resourceId) {
      this.resourceService.getResource(this.resourceId).subscribe(resource => {
        this.resourceForm.patchValue(resource);
      });
    }
  }

  onSubmit(): void {
    if (this.resourceForm.valid) {
      const resourceData = this.resourceForm.value;
      
      if (this.isEditMode && this.resourceId) {
        this.resourceService.updateResource(this.resourceId, resourceData).subscribe({
          next: () => {
            this.router.navigate(['/resources']);
          },
          error: (error) => {
            console.error('Error updating resource:', error);
            alert('Failed to update resource. Please try again.');
          }
        });
      } else {
        this.resourceService.createResource(resourceData).subscribe({
          next: () => {
            this.router.navigate(['/resources']);
          },
          error: (error) => {
            console.error('Error creating resource:', error);
            alert('Failed to create resource. Please try again.');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/resources']);
  }
} 