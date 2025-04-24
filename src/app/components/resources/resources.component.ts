import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchBarComponent],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
  
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  currentSearchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [
    'Programming',
    'Web Development',
    'Mathematics',
    'Science',
    'Language Learning',
    'Teaching Materials'
  ];

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.filteredResources = resources;
      },
      error: (error) => {
        console.error('Error loading resources:', error);
      }
    });
  }

  onSearch(result: SearchResult): void {
    this.currentSearchTerm = result.searchTerm;
    
    if (!this.currentSearchTerm.trim()) {
      this.filteredResources = this.resources;
      return;
    }

    this.resourceService.searchResources(this.currentSearchTerm).subscribe({
      next: (resources) => {
        console.log('Search results:', resources);
        this.filteredResources = resources;
      },
      error: (error) => {
        console.error('Error searching resources:', error);
        this.filteredResources = [];
      }
    });
  }

  clearSearch(): void {
    this.currentSearchTerm = '';
    this.filteredResources = this.resources;
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.filteredResources = this.resources;
      return;
    }

    this.resourceService.filterByCategory(this.selectedCategory).subscribe({
      next: (resources) => {
        this.filteredResources = resources;
      },
      error: (error) => {
        console.error('Error filtering resources:', error);
      }
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.currentSearchTerm = '';
    this.loadResources();
  }

  onResourceClick(resource: Resource): void {
    this.resourceService.incrementDownloadCount(resource.id).subscribe();
  }

  getDefaultThumbnail(type: string): string {
    switch (type) {
      case 'PDF':
        return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
      case 'Video':
        return 'https://cdn-icons-png.flaticon.com/512/1666/1666998.png';
      case 'Article':
        return 'https://cdn-icons-png.flaticon.com/512/2965/2965879.png';
      case 'Link':
        return 'https://cdn-icons-png.flaticon.com/512/1828/1828954.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/2965/2965879.png';
    }
  }

  getActionText(type: string): string {
    switch (type) {
      case 'PDF':
        return 'Download PDF';
      case 'Video':
        return 'Watch Video';
      case 'Article':
        return 'Read Article';
      case 'Link':
        return 'Visit Link';
      default:
        return 'Access Resource';
    }
  }
} 