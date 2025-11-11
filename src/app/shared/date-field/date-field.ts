import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-field',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './date-field.html',
  styleUrl: './date-field.scss',
})
export class DateField {
   @Input() label!: string;
  @Input() control!: FormControl;
}
