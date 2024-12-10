import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-purchase-ticket-dialog',
  imports: [ReactiveFormsModule, MatOptionModule, MatFormFieldModule,
     MatLabel, MatDialogModule, MatInputModule, MatSelectModule],
  templateUrl: './buy-ticket-dialog.component.html',
  styleUrls: ['./buy-ticket-dialog.component.scss']
})
export class BuyTicketDialogComponent {
  purchaseForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BuyTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // 可傳入票務數據
    private fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      ...data,
      amount: [1, [Validators.required, Validators.min(1)]],
      c_phone: ['', [Validators.required]],
      payment_method: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.purchaseForm.valid) {
      const purchaseData = this.purchaseForm.value;
      this.dialogRef.close(purchaseData); // 將數據傳回調用方
    }
  }
}
