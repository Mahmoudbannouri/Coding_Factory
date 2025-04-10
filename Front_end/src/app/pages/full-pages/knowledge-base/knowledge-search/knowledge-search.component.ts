import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KnowledgeBase } from '../knowledge-base.model';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
  selector: 'app-knowledge-search',
  templateUrl: './knowledge-search.component.html',
  styleUrls: ['./knowledge-search.component.scss']
})
export class KnowledgeSearchComponent {
  knowledgeBase: KnowledgeBase[] = [];
  searchQuery: string = '';

  constructor(private router: Router, kbService: KnowledgeBaseService) {
    this.knowledgeBase = kbService.knowledgeBase;
  }

  viewCategories(kb: any) {
    this.router.navigate(['/pages/kb/categories']);
  }
}
