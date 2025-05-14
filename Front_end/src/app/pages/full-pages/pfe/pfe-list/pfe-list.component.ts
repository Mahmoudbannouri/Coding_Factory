// Update the imports if needed
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { PfeService } from '../../../../services/pfe.service';
import { Pfe } from 'app/models/pfe';
import { formatDate } from '@angular/common';

@Component({
  selector: "app-pfe-list",
  templateUrl: "./pfe-list.component.html",
  styleUrls: [
    "./pfe-list.component.scss",
    "../../../../../assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PfeListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // row data
  public rows: Pfe[] = [];
  public filteredRows: Pfe[] = []; // Changed from filteredData to filteredRows
  public ColumnMode = ColumnMode;
  public limitRef = 10;
  public isLoading = true;

  // column header
  public columns = [
    { name: "ID", prop: "id" },
    { name: "Project Title", prop: "projectTitle" },
    { name: "Student ID", prop: "studentId" },
    { name: "Trainer ID", prop: "trainerId" },
    { name: "Start Date", prop: "startDate", pipe: { transform: (date: Date) => date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : '' } },
    { name: "End Date", prop: "endDate", pipe: { transform: (date: Date) => date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : '' } },
    { name: "Status", prop: "status" },
    { name: "Level", prop: "level" },
    { name: "Category", prop: "category" },
    { name: "Actions", prop: "id" }
  ];
// Ajoutez cette méthode pour debugger
ngAfterViewInit(): void {
  console.log('Données chargées:', this.filteredRows);
  console.log('Premier élément:', this.filteredRows[0]);
  
}
  // Active filters
  public activeFilters = {
    search: '',
    status: '',
    level: '',
    category: ''
  };

  constructor(private pfeService: PfeService) {}

  ngOnInit(): void {
    this.loadPfes();
  }

  loadPfes(): void {
    this.isLoading = true;
    this.pfeService.getAllPfe().subscribe({
      next: (data) => {
        this.rows = data;
        this.filteredRows = [...data]; // Changed from filteredData to filteredRows
        this.isLoading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des PFEs:', error);
        this.isLoading = false;
      }
    });
  }

  // Filter update for search input
  filterUpdate(event: any): void {
    this.activeFilters.search = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // Update filters from select inputs
  onFilterChange(event: any, filterType: 'status' | 'level' | 'category'): void {
    this.activeFilters[filterType] = event.target.value;
    this.applyFilters();
  }

  // Apply all active filters
  private applyFilters(): void {
    let filtered = [...this.rows];

    // Search filter
    if (this.activeFilters.search) {
      const searchTerm = this.activeFilters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.projectTitle.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (this.activeFilters.status) {
      filtered = filtered.filter(d => d.status === this.activeFilters.status);
    }

    // Level filter
    if (this.activeFilters.level) {
      filtered = filtered.filter(d => d.level === this.activeFilters.level);
    }

    // Category filter
    if (this.activeFilters.category) {
      filtered = filtered.filter(d => d.category === this.activeFilters.category);
    }

    this.filteredRows = filtered; // Changed from filteredData to filteredRows
    
    // Reset pagination
    if (this.table) {
      this.table.offset = 0;
    }
  }

  // Clear all filters
  clearFilters(): void {
    this.activeFilters = {
      search: '',
      status: '',
      level: '',
      category: ''
    };
    this.applyFilters();
  }

  // Update entries limit
  updateLimit(event: any): void {
    this.limitRef = Number(event.target.value);
  }
}