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
  templateUrl: './edit-dialog.component.html'
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