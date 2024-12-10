// board-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-board-admin',
  imports: [ RouterLink ],
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  constructor( private router: Router) { }

  ngOnInit(): void { }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }  
}