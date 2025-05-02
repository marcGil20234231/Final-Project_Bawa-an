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
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
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