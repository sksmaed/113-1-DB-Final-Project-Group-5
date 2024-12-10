import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-ticket-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatOptionModule, MatFormFieldModule, MatLabel,
     MatDialogModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatIconModule, FormsModule],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './edit-ticket-dialog.component.html',
  styleUrls: ['./edit-ticket-dialog.component.scss'],
})
export class EditTicketDialogComponent {
  editForm: FormGroup;
  ticketRooms: any[] = []; // 展廳列表

  constructor(
    public dialogRef: MatDialogRef<EditTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // 傳入的門票資訊
    private fb: FormBuilder,
  ) {
    this.ticketRooms = data.rooms || [];
    this.editForm = this.fb.group({
      t_name: [data.t_name, Validators.required],
      price: [data.price, [Validators.required, Validators.min(0)]],
      sale_start_date: [data.sale_start_date, Validators.required],
      sale_end_date: [data.sale_end_date, Validators.required],
      valid_time_span: [data.valid_time_span, Validators.required],
      identity: [data.identity, Validators.required],
    });
  }

  addRoom(): void {
    this.ticketRooms.push('');
  }

  removeRoom(index: number): void {
    this.ticketRooms.splice(index, 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedTicket = {
        t_id: this.data.t_id,
        ...this.editForm.value,
        rooms: this.ticketRooms,
      };
      this.dialogRef.close(updatedTicket);
    }
  }
}
