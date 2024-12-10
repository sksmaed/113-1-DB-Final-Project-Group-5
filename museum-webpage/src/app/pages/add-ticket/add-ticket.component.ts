import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddService } from '../../shared/services/add.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-ticket',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, 
    MatIconModule, MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './add-ticket.component.html',
  styleUrl: './add-ticket.component.scss'
})
export class AddTicketComponent {
  ticketForm: FormGroup;

  constructor(private fb: FormBuilder, private addService: AddService,
    private snackBar: MatSnackBar, private router: Router) {
    this.ticketForm = this.fb.group({
      t_name: [''],
      price: [''],
      sale_start_date: [''],
      sale_end_date: [''],
      valid_time_span: [''],
      iden_name: [''],
      rooms: this.fb.array([]),
    });
  }

  get roomControls() {
    return this.ticketForm.get('rooms') as FormArray;
  }

  addRoom(): void {
    this.roomControls.push(this.fb.control(''));
  }

  removeRoom(index: number): void {
    this.roomControls.removeAt(index);
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.addService.addTicket(this.ticketForm.value).subscribe(
        (data) => {
          this.snackBar.open('票券已成功新增！', '確定', { duration: 3000 });
          this.router.navigate(['/edit-ticket']);
        },
        (err) => {
          this.snackBar.open('無法新增票券，請重試！', '關閉', { duration: 5000 });
          console.error('無法新增票券', err);
        }
      );
    } else {
      console.warn('表單資料無效');
      this.snackBar.open('表單資料無效，請檢查！', '關閉', { duration: 5000 });
    }
  }
}