import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAuthorsComponent } from './about-authors.component';

describe('AboutAuthorsComponent', () => {
  let component: AboutAuthorsComponent;
  let fixture: ComponentFixture<AboutAuthorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutAuthorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
