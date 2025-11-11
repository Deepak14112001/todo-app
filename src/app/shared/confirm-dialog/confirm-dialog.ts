import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog', // Component tag
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html', // HTML template
  styleUrl: './confirm-dialog.scss',    // Stylesheet
})
export class ConfirmDialog {
  @Input() show = false;       // Show/hide the dialog
  @Input() title = 'Confirm';  // Dialog title
  @Input() message = 'Are you sure?'; // Dialog message

  @Output() confirm = new EventEmitter<void>(); // Event when "Yes" clicked
  @Output() cancel = new EventEmitter<void>();  // Event when "No" clicked

  onConfirm() {
    this.confirm.emit(); // Emit confirm event
  }

  onCancel() {
    this.cancel.emit();  // Emit cancel event
  }
}
