import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

// Standalone Component
@Component({
  selector: 'app-add-staff-duty-dialog',
  standalone: true,  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],  
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './staff-duty-add-dialog.component.html',
  styleUrls: ['./staff-duty-add-dialog.component.scss']
})
export class AddStaffDutyDialogComponent {
  volunteerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStaffDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.volunteerForm = this.fb.group({
      s_id: ['', Validators.required],
      duty: ['', Validators.required]
    });
  }

  // 提交表單
  onSubmit(): void {
    console.log(this.data);
    if (this.volunteerForm.valid) {
      const formData = {
        ...this.volunteerForm.value,
        exh_id: this.data.exh_id
      };
      this.dialogRef.close(formData);
    }
  }

  // 關閉視窗
  onClose(): void {
    this.dialogRef.close();
  }
}
