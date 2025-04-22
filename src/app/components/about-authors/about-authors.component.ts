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
      imageUrl: 'https://scontent.fmnl15-1.fna.fbcdn.net/v/t39.30808-6/491993483_1731197290766088_4480573760669054600_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8zqo3k59W28Q7kNvwHcHNef&_nc_oc=AdkpyqhDUkrLXv5ainIITUmOjy1V77Ws3ps0aCryCzwpoVdQIAyJGHOGu5sCbAO7OL4&_nc_zt=23&_nc_ht=scontent.fmnl15-1.fna&_nc_gid=VuoMip4mOGWKGfSJMiL_hw&oh=00_AfFCyz47uWAtNzcx2XXTKtmmSWaMOlMup70YhlYIf7XLDg&oe=680D14E3',
      bio: 'BSIT student',
      socialLinks: {
        linkedin: '',
        github: '',
        email: '20234231@s.ubaguio.edu'
      }
    }
  ];
}
