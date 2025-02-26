import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KBCategory } from '../knowledge-base.model';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
  selector: 'app-knowledge-categories',
  templateUrl: './knowledge-categories.component.html',
  styleUrls: ['./knowledge-categories.component.scss']
})
export class KnowledgeCategoriesComponent  {
  kbCategories: KBCategory[] = [];
  searchQuery: string = '';
  page = 1;
  isShowCategory = false;

  constructor(private router: Router, kbService: KnowledgeBaseService) {
    this.kbCategories = kbService.kbCategory;
  }

  viewQuestions(category: any) {
    this.router.navigate(['/pages/kb/questions']);
  }

}
