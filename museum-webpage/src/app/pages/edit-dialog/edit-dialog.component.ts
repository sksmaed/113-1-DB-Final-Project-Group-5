import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  template: `
    <h2 mat-dialog-title>編輯展覽</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm">
        <mat-form-field appearance="fill">
          <mat-label>名稱</mat-label>
          <input matInput formControlName="exhName" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>開始日期</mat-label>
          <input matInput type="date" formControlName="start_date" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>結束日期</mat-label>
          <input matInput type="date" formControlName="end_date" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>展廳</mat-label>
          <input matInput formControlName="room" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>舉辦單位</mat-label>
          <input matInput formControlName="host" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="closeDialog()">取消</button>
      <button mat-raised-button color="primary" (click)="saveChanges()">儲存</button>
    </mat-dialog-actions>
  `,
})
export class EditDialogComponent {
  editForm: FormGroup = new FormGroup({
    exh_id: new FormControl(''),
    exhName: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    room: new FormControl(''),
    host: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = undefined, // Initialize as undefined
    private editExhService: EditExhService
  ) {
    if (this.data) {
      this.editForm.patchValue(this.data); // Populate the form with data if available
    }
  }

  saveChanges(): void {
    const updatedExh = this.editForm.value;
    this.editExhService.updateExh(updatedExh).subscribe((response) => {
      this.dialogRef.close(response);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}