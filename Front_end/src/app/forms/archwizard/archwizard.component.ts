import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';


@Component({
  selector: 'app-archwizard',
  templateUrl: './archwizard.component.html',
  styleUrls: ['./archwizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchwizardComponent implements OnInit, AfterViewInit {

  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);

  }

}
