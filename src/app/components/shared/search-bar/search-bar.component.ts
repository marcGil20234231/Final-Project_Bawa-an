import { Component, OnInit, Output, EventEmitter, Input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SearchService, SearchResult } from '../../../services/search.service';
import { isPlatformBrowser } from '@angular/common';

interface SearchOptions {
  title: boolean;
  description: boolean;
  tags: boolean;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder: string = 'Search...';
  @Input() debounceTime: number = 300;
  @Output() search = new EventEmitter<SearchResult>();
  
  searchQuery: string = '';
  isSearching: boolean = false;
  showSuggestions: boolean = false;
  showAdvancedOptions: boolean = false;
  suggestions: string[] = [];
  searchHistory: string[] = [];
  searchOptions: SearchOptions = {
    title: true,
    description: true,
    tags: true
  };

  private searchSubject = new Subject<string>();
  private readonly HISTORY_KEY = 'search_history';
  private readonly MAX_HISTORY_ITEMS = 5;
  private isBrowser: boolean;

  constructor(
    private searchService: SearchService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadSearchHistory();
    }
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.updateSuggestions(query);
        this.onSearch();
      } else {
        this.search.emit({
          searchTerm: '',
          courses: [],
          teachers: [],
          resources: []
        });
        this.suggestions = [];
      }
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.search.emit({
        searchTerm: '',
        courses: [],
        teachers: [],
        resources: []
      });
      return;
    }

    this.isSearching = true;
    this.addToHistory(query);
    
    this.searchService.searchAll(query).subscribe({
      next: (results) => {
        this.search.emit(results);
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit({
      searchTerm: '',
      courses: [],
      teachers: [],
      resources: []
    });
    this.suggestions = [];
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  private updateSuggestions(query: string): void {
    this.searchService.getSuggestions(query).subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  private loadSearchHistory(): void {
    if (!this.isBrowser) return;
    
    try {
      const history = localStorage.getItem(this.HISTORY_KEY);
      this.searchHistory = history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory = [];
    }
  }

  private saveSearchHistory(): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  addToHistory(query: string): void {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    // Add to beginning
    this.searchHistory.unshift(query);
    // Keep only the most recent items
    this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY_ITEMS);
    this.saveSearchHistory();
  }

  clearHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  removeFromHistory(item: string, event: Event): void {
    event.stopPropagation();
    this.searchHistory = this.searchHistory.filter(i => i !== item);
    this.saveSearchHistory();
  }

  selectHistoryItem(item: string): void {
    this.searchQuery = item;
    this.onSearch();
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.onSearch();
  }

  performSearch(): void {
    if (this.searchQuery.length >= 3) {
      this.router.navigate(['/search'], { 
        queryParams: { 
          term: this.searchQuery,
          ...this.searchOptions
        } 
      });
      this.showSuggestions = false;
    }
  }
}