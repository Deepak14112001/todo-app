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
  imports: [TaskForm, CommonModule, FormsModule, MatIconModule, ConfirmDialog],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  tasks: Task[] = [];               // All tasks
  filteredTasks: Task[] = [];       // Filtered tasks for search
  searchTerm: string = '';           // Search input
  showForm = false;                  // Controls task form visibility
  editingTask: Task | null = null;   // Task currently being edited

  showConfirm = false;               // Delete confirmation popup
  taskToDelete: Task | null = null;  // Task selected for deletion

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks(); // Load tasks on component init
  }

  // Fetch tasks from service
  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.filteredTasks = [...this.tasks]; // Copy for filtering
    });
  }

  // Search/filter tasks
  search() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term) ||
      task.comments.toLowerCase().includes(term)
    );
  }

  // Open form to edit task
  editTask(task: Task) {
    this.editingTask = { ...task }; // Clone task
    this.showForm = true;
  }

  // Add new task or update existing task
  addTask(task: Task) {
    if (this.editingTask) {
      // Update existing
      this.taskService.updateTask({ ...task, id: this.editingTask.id }).subscribe(() => {
        this.loadTasks();
        this.closeForm();
      });
    } else {
      // Add new task (remove id if null)
      const { id, ...taskWithoutId } = task;
      this.taskService.addTask(taskWithoutId).subscribe(() => {
        this.loadTasks();
        this.closeForm();
      });
    }
  }

  // Show delete confirmation popup
  deleteTask(task: Task) {
    this.taskToDelete = task;
    this.showConfirm = true;
  }

  // Confirm deletion
  confirmDelete() {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id!).subscribe(() => {
        this.loadTasks();
        this.showConfirm = false;
        this.taskToDelete = null;
      });
    }
  }

  // Cancel deletion
  cancelDelete() {
    this.showConfirm = false;
    this.taskToDelete = null;
  }

  // Close task form
  closeForm() {
    this.showForm = false;
    this.editingTask = null;
  }

  // Refresh tasks
  refresh() {
    this.loadTasks();
  }
}
