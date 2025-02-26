import { Component } from '@angular/core';
import { TimelineElement } from './component/timeline-element';

@Component({
    selector: 'app-horizontal-timeline-page',
    templateUrl: './horizontal-timeline-page.component.html',
    styleUrls: ['./horizontal-timeline-page.component.scss']
})

export class HorizontalTimelinePageComponent {

    content = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum praesentium officia, fugit recusandae
    ipsa, quia velit nulla adipisci? Consequuntur aspernatur at, eaque hic repellendus sit dicta consequatur quae,
    ut harum ipsam molestias maxime non nisi reiciendis eligendi! Doloremque quia pariatur harum ea amet quibusdam
    quisquam, quae, temporibus dolores porro doloribus.`;

    timeline: TimelineElement[] = [
        { date: new Date(2020, 0, 16), selected: true, title: 'Horizontal Timeline', content: this.content },
        { date: new Date(2020, 1, 28), title: 'Event title here', content: this.content },
        { date: new Date(2020, 2, 20), title: 'Event title here', content: this.content },
        { date: new Date(2020, 4, 20), title: 'Event title here', content: this.content },
        { date: new Date(2020, 6, 9), title: 'Event title here', content: this.content },
        { date: new Date(2020, 7, 30), title: 'Event title here', content: this.content },
        { date: new Date(2020, 8, 15), title: 'Event title here', content: this.content },
        { date: new Date(2020, 10, 1), title: 'Event title here', content: this.content },
        { date: new Date(2020, 11, 10), title: 'Event title here', content: this.content },
        { date: new Date(2021, 0, 19), title: 'Event title here', content: this.content },
        { date: new Date(2021, 2, 3), title: 'Event title here', content: this.content },
    ];

}
