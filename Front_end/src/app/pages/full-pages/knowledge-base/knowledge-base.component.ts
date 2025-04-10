import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent {
  constructor(private router: Router) {
  }

}
