import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddService } from '../../shared/services/add.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-exhibition',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, 
    MatIconModule, MatInputModule, MatButtonModule],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './add-exhibition.component.html',
  styleUrls: ['./add-exhibition.component.scss'],
})
export class AddExhibitionComponent {
  exhibitionForm: FormGroup;

  constructor(private fb: FormBuilder, private addService: AddService,
    private snackBar: MatSnackBar, private router: Router) {
    this.exhibitionForm = this.fb.group({
      exhName: [''],
      start_date: [''],
      end_date: [''],
      rooms: this.fb.array([]),
      hosts: this.fb.array([]),
    });
  }

  get roomControls() {
    return this.exhibitionForm.get('rooms') as FormArray;
  }

  get hostControls() {
    return this.exhibitionForm.get('hosts') as FormArray;
  }

  addRoom(): void {
    this.roomControls.push(this.fb.control(''));
  }

  removeRoom(index: number): void {
    this.roomControls.removeAt(index);
  }

  addHost(): void {
    this.hostControls.push(this.fb.control(''));
  }

  removeHost(index: number): void {
    this.hostControls.removeAt(index);
  }

  onSubmit(): void {
    if (this.exhibitionForm.valid) {
      this.addService.addExhibition(this.exhibitionForm.value).subscribe(
        (data) => {
          this.snackBar.open('展覽已成功新增！', '確定', { duration: 3000 });
          this.router.navigate(['/edit-exh']);
        },
        (err) => {
          this.snackBar.open('無法新增展覽，請重試！', '關閉', { duration: 5000 });
          console.error('無法新增展覽', err);
        }
      );
    } else {
      console.warn('表單資料無效');
      this.snackBar.open('表單資料無效，請檢查！', '關閉', { duration: 5000 });
    }
  }
}