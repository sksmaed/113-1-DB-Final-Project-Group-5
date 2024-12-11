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
  selector: 'app-add-sponsor-dialog',
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
  templateUrl: './spon-add-dialog.component.html',
  styleUrls: ['./spon-add-dialog.component.scss']
})
export class AddSponsorDialogComponent {
  sponsorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSponsorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sponsorForm = this.fb.group({
      spon_name: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  // 提交表單
  onSubmit(): void {
    console.log(this.data);
    if (this.sponsorForm.valid) {
      const formData = {
        ...this.sponsorForm.value,
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
