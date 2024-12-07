import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { EditExhService } from '../../shared/services/edit-exh.service';

@Component({
  selector: 'app-edit-dialog',
  imports: [ CommonModule, ReactiveFormsModule ],
  template: `
    <div *ngIf="exhibition">
      <h2>編輯展覽</h2>
      <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
        <label>
          名稱：
          <input formControlName="exhName" />
        </label>
        <label>
          開始日期：
          <input type="date" formControlName="start_date" />
        </label>
        <label>
          結束日期：
          <input type="date" formControlName="end_date" />
        </label>
        <label>
          展廳：
          <input formControlName="room" />
        </label>
        <label>
          舉辦單位：
          <input formControlName="host" />
        </label>
        <button type="submit">儲存</button>
        <button type="button" (click)="closeDialog()">取消</button>
      </form>
    </div>
  `,
})
export class EditDialogComponent {
  @Input() exhibition: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<any>();
  editForm: FormGroup = new FormGroup({
    exh_id: new FormControl(''),
    exhName: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    room: new FormControl(''),
    host: new FormControl(''),
  });

  constructor(private editExhService: EditExhService) { }

  ngOnChanges(): void {
    if (this.exhibition) {
      this.editForm.patchValue(this.exhibition);
    }
  }

  saveChanges(): void {
    const updatedExh = this.editForm.value;

    this.editExhService.updateExh(updatedExh).subscribe((response) => {
        this.update.emit(response);
        this.close.emit(true);
      });
  }

  closeDialog(): void {
    this.close.emit(false);
  }
}
