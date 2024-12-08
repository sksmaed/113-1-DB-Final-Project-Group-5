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
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-exh',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, 
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

  constructor(private searchExhService: SearchExhService, private dialog: MatDialog, private router: Router) { }

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
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '800px',
      data: exhibition, // Pass the selected exhibition as dialog data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Exhibition updated successfully:', result);
        this.onSearch(); // Reload exhibitions after successful update
      } else {
        console.log('Edit dialog closed without changes');
      }
    });
  }

  onDialogClose(updated: boolean): void {
    if (updated) {
      this.onSearch();
    }
    this.selectedExhibition = null;
  }

  viewVolunteers(element: any): void {
    console.log('查看志工:', element);
    this.router.navigate(['/volunteer'], { queryParams: { exhibitionId: element.exh_id, exhName: element.exhName } });
  }

  viewSponsors(element: any): void {
    console.log('查看贊助:', element);
    this.router.navigate(['/sponsor'], { queryParams: { exhibitionId: element.exh_id, exhName: element.exhName } });
  }

  viewStaffAssignments(element: any): void {
    console.log('查看職員分配:', element);
    this.router.navigate(['/staff-duty'], { queryParams: { exhibitionId: element.exh_id, exhName: element.exhName } });
  }
}
