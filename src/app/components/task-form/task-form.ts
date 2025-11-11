import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Task } from '../../model/task.model';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateField } from '../../shared/date-field/date-field';
import { Textfield } from '../../shared/textfield/textfield';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, ReactiveFormsModule, DateField, CommonModule, Textfield],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  @Input() task: Task | null = null;          // Input from parent to edit a task
  @Output() save = new EventEmitter<Task>();  // Emits when form is submitted
  @Output() cancel = new EventEmitter<void>(); // Emits when cancel is clicked

  taskForm: FormGroup; // Reactive form

  constructor(private fb: FormBuilder) {
    // Initialize form with validators
    this.taskForm = this.fb.group({
      id: [null],
      assignedTo: ['', Validators.required], // Required field
      status: ['', Validators.required],     // Required field
      dueDate: ['', Validators.required],    // Required field
      priority: ['', Validators.required],   // Required field
      comments: ['']                         // Optional field
    });
  }

  // Expose form controls for template binding
  get assignedTo() { return this.taskForm.get('assignedTo') as FormControl; }
  get status() { return this.taskForm.get('status') as FormControl; }
  get dueDate() { return this.taskForm.get('dueDate') as FormControl; }
  get priority() { return this.taskForm.get('priority') as FormControl; }
  get comments() { return this.taskForm.get('comments') as FormControl; }

  // Patch form when @Input task changes (edit mode)
  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue(this.task); // Only patch, do not recreate
    }
  }

  // Emit form data to parent when submitted
  onSubmit() {
    if (this.taskForm.valid) {
      this.save.emit(this.taskForm.value);
    }
  }

  // Emit cancel event to parent
  onCancel() {
    this.cancel.emit();
  }
}
