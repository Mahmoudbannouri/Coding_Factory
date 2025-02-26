import { Component } from '@angular/core';
import { HighlightService } from 'app/shared/services/highlight.service';

@Component({
    selector: 'helper-classes',
    templateUrl: './helper-classes.component.html',
    styleUrls: ['./helper-classes.component.scss']
})

export class HelperClassesComponent {
  highlighted: boolean = false;

  constructor(private highlightService: HighlightService) { }


  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }
}
