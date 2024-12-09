// board-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-board-admin',
  imports: [ RouterLink ],
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  constructor( ) { }

  ngOnInit(): void { }
}