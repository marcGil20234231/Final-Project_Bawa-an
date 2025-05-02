import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-components',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
teacherForm: any;
teachers: any;
isEditing: any;
cancelEdit() {
throw new Error('Method not implemented.');
}
deleteTeacher(arg0: any) {
throw new Error('Method not implemented.');
}
editTeacher(_t38: any) {
throw new Error('Method not implemented.');
}

}