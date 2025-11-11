import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Task } from '../../model/task.model';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateField } from '../../shared/date-field/date-field';
import { Textfield } from '../../shared/textfield/textfield';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule,ReactiveFormsModule,DateField,CommonModule,Textfield],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
    @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Always initialize the form here
    this.taskForm = this.fb.group({
      id: [null],
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      comments: ['']
    });
  }

  // Expose controls for template binding
  get assignedTo() { return this.taskForm.get('assignedTo') as FormControl; }
  get status() { return this.taskForm.get('status') as FormControl; }
  get dueDate() { return this.taskForm.get('dueDate') as FormControl; }
  get priority() { return this.taskForm.get('priority') as FormControl; }
  get comments() { return this.taskForm.get('comments') as FormControl; }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      // Patch values safely
      if (!this.taskForm) {
        // just in case
        this.taskForm = this.fb.group({
          id: [null],
          assignedTo: ['', Validators.required],
          status: ['', Validators.required],
          dueDate: ['', Validators.required],
          priority: ['', Validators.required],
          comments: ['']
        });
      }
      this.taskForm.patchValue(this.task);
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.save.emit(this.taskForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
