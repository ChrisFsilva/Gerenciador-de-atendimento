import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { futureService } from '../../services/future/future.service';

@Component({
  selector: 'app-futuro',
  standalone: true,
  imports: [],
  templateUrl: './futuro.html',
  styleUrl: './futuro.css',
})
export class Futuro {

  constructor (
    private router: Router,
    public futureService: futureService,
    private cdr: ChangeDetectorRef 
  ){}

}
