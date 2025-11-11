import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskForm } from '../task-form/task-form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm,CommonModule,FormsModule,MatIconModule,ConfirmDialog],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList{
   tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  showForm = false;
  editingTask: Task | null = null;

  // 👇 new properties for delete popup
  showConfirm = false;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.filteredTasks = [...this.tasks];
    });
  }

  search() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term) ||
      task.comments.toLowerCase().includes(term)
    );
  }

  editTask(task: Task) {
  this.editingTask = { ...task };   // clone task to edit
  this.showForm = true;
}

addTask(task: Task) {
  if (this.editingTask) {
    // ✅ Update existing
    this.taskService.updateTask({ ...task, id: this.editingTask.id }).subscribe(() => {
      this.loadTasks();
      this.closeForm();
    });
  } else {
    // ✅ Add new — remove id before sending
    const { id, ...taskWithoutId } = task; // <--- removes null id
    this.taskService.addTask(taskWithoutId).subscribe(() => {
      this.loadTasks();
      this.closeForm();
    });
  }
}



  // 🧠 new popup delete logic
  deleteTask(task: Task) {
    this.taskToDelete = task;
    this.showConfirm = true;
  }

  confirmDelete() {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id!).subscribe(() => {
        this.loadTasks();
        this.showConfirm = false;
        this.taskToDelete = null;
      });
    }
  }

  cancelDelete() {
    this.showConfirm = false;
    this.taskToDelete = null;
  }

  closeForm() {
    this.showForm = false;
    this.editingTask = null;
  }

  refresh() {
    this.loadTasks();
  }
}
