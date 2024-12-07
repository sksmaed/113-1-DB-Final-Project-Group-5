import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-edit-exh',
  imports: [CommonModule, ReactiveFormsModule, EditDialogComponent, MatFormFieldModule, 
    MatSelectModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './edit-exh.component.html',
  styleUrl: './edit-exh.component.scss'
})
export class ExhibitionManagementComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    room: new FormControl(''),
    host: new FormControl(''),
  });
  exhibitions: any[] = [];
  selectedExhibition: any = null;
  displayedColumns: string[] = ['exhName', 'start_date', 'end_date', 'room', 'host', 'actions'];

  constructor(private searchExhService: SearchExhService) { }

  ngOnInit(): void { this.unlimitSearch(); }

  unlimitSearch(): void {
    const params = this.filterForm.value
    this.searchExhService.findAll( ).subscribe((data) => {
      console.log(data);
      this.exhibitions = data;
    });
  }

  onSearch(): void {
    const params = this.filterForm.value
    this.searchExhService.filterExh( params ).subscribe((data) => {
      console.log(data);
      this.exhibitions = data;
    });
  }

  openEditDialog(exhibition: any): void {
    this.selectedExhibition = exhibition;
  }

  onDialogClose(updated: boolean): void {
    if (updated) {
      this.onSearch();
    }
    this.selectedExhibition = null;
  }
}
