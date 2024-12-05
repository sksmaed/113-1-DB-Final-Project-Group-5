import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-search-exh',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './search-exh.component.html',
  styleUrl: './search-exh.component.scss'
})
export class SearchExhComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    isActive: new FormControl(''),
    category: new FormControl(''),
    hall: new FormControl(''),
  });;
  exhibitions: any[] = [];
  displayedColumns: string[] = ['exhName', 'start_date', 'end_date'];

  constructor(private formBuilder: FormBuilder, 
    private searchExhService: SearchExhService) { }

  ngOnInit(): void {}

  onSearch(): void {
    const params = this.searchForm.value
    this.searchExhService.findAll().subscribe((data) => {
      console.log(data);
      this.exhibitions = data;
    });
  }
}