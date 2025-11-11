import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textfield.html',
  styleUrl: './textfield.scss',
})
export class Textfield {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() type: string = 'text';

  // Dummy validator reference for showing *
  requiredValidator = Validators.required;
}
