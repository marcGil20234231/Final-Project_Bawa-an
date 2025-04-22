import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Author {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    email: string;
  };
}

@Component({
  selector: 'app-about-authors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-authors.component.html',
  styleUrl: './about-authors.component.css'
})
export class AboutAuthorsComponent {
  authors: Author[] = [
    {
      name: 'Marc Gil Bawa-an',
      role: 'Lead Developer',
      imageUrl: '',
      bio: 'BSIT student',
      socialLinks: {
        linkedin: '',
        github: '',
        email: '20234231@s.ubaguio.edu'
      }
    }
  ];
}
