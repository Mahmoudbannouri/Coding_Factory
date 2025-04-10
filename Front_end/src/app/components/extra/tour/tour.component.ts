import { Component, OnDestroy, AfterViewChecked } from '@angular/core';
import * as hopscotch from 'hopscotch';
import { HighlightService } from 'app/shared/services/highlight.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements AfterViewChecked, OnDestroy {

  highlighted: boolean = false;

  constructor(private highlightService: HighlightService) { }


  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  ngOnDestroy() {
    // Destroy running tour
    hopscotch.endTour(true);
  }

  startTour() {
    // Destroy running tour
    hopscotch.endTour(true);
    // Initialize new tour
    hopscotch.startTour(this.tourSteps());
  }

  tourSteps(): any {
    return {
      id: 'demo-tour',
      showPrevButton: true,
      steps: [

        {
          title: "Search",
          content: "Try fuzzy Search to visit pages in flash.",
          target: "navbar-search",
          placement: "bottom",
          xOffset: -20,
          arrowOffset: 20
        },
        {
          title: "Notifications",
          content: "See all your natifications and updates here.",
          target: "drp-notification",
          placement: "bottom",
          xOffset: -270,
          arrowOffset: 260
        },
        {
          title: "Footer",
          content: "Here are the rights of your company.",
          target: "pixinventLink",
          placement: "top",
          xOffset: -80,
          arrowOffset: 100
        }
      ]
    }
  }
}
