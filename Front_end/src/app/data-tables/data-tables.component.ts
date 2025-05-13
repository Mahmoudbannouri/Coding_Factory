import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PartnershipService } from '../services/partnership.service';
import { Partnership } from '../models/partnership';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { Entreprise } from 'app/models/entreprise';
import { Proposal } from 'app/models/proposal';
import { LayoutService } from 'app/shared/services/layout.service';
import { NotificationService } from 'app/services/Notification.service';

@Component({
  selector: 'app-datatables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss', '../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataTablesComponent implements OnInit {
  public partnerships: Partnership[] = [];
  public filteredPartnerships: Partnership[] = [];
  public newPartnership: Partnership = { partnershipStatus: 'pending', entreprise: null };
  public selectedPartnership: Partnership | null = null;
  public loading = false;
  public error: string | null = null;
  public showAddForm = false;
  public columns = [
    { name: 'ID', prop: 'idPartnership', width: 100 },
    { name: 'Status', prop: 'partnershipStatus', width: 150 },
    { name: 'Actions', prop: 'actions', width: 100 }
  ];
  public entreprises: Entreprise[] = [];
  public proposals: Proposal[] = [];
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;

  nameEntreprise: string = '';
  errorMessage: string = '';
  selectedEntreprise: Entreprise | null = null;
  newProposal: Proposal;

  public page = 1;
  public pageSize = 5;
  public totalPages = 1;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private partnershipService: PartnershipService, 
    private router: Router,
    private layoutService: LayoutService,
    private NotificationService: NotificationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPartnerships();
    this.loadEntreprises();
    this.loadProposals();
  }

  goToAddAgreements() {
    this.router.navigate(['/add-agreements', this.selectedPartnership?.idPartnership]);
  }

  loadPartnerships() {
    this.loading = true;
    this.error = null;

    this.partnershipService.getPartnerships().subscribe({
      next: (data) => {
        this.partnerships = data;
        this.filteredPartnerships = [...this.partnerships];
        this.loading = false;
        this.cdr.detectChanges();  // Trigger change detection manually
      },
      error: (err) => {
        this.error = 'Error fetching partnerships';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadEntreprises() {
    this.partnershipService.getEntreprises().subscribe({
      next: (data) => this.entreprises = data,
      error: (err) => console.error('Error fetching entreprises', err)
    });
  }

  loadProposals() {
    this.partnershipService.getProposals().subscribe({
      next: (data) => this.proposals = data,
      error: (err) => console.error('Error fetching proposals', err)
    });
  }

  getPaginatedPartnerships() {
    this.totalPages = Math.ceil(this.filteredPartnerships.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    return this.filteredPartnerships.slice(start, start + this.pageSize);
  }

  goToPage(pageNum: number) {
    if (pageNum > 0 && pageNum <= this.totalPages) {
      this.page = pageNum;
    }
  }

  filterUpdate(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPartnerships = this.partnerships.filter(p =>
      p.partnershipStatus.toLowerCase().includes(val) ||
      (p.entreprise?.nameEntreprise?.toLowerCase().includes(val))
    );
    this.page = 1;  // Reset pagination to first page when filter is applied
    this.cdr.detectChanges();  // Ensure view updates
}

  openAddPartnershipForm() {
    this.showAddForm = true;
  }

  cancelAddPartnership() {
    this.showAddForm = false;
  }

  addPartnership(partnershipData: Partnership) {
    // Adding a notification with the entreprise name
    const notificationData = {
      title: 'Partnership Added',
      message: `A new partnership with ${partnershipData.entreprise?.nameEntreprise} has been added.`,
      icon: 'fa-handshake'
    };
  
    // Send through NotificationService
    this.NotificationService.addNotification(notificationData);
  
    // Send through LayoutService if necessary
    this.layoutService.sendNotification(notificationData);
  
    // Updating the partnerships list in memory
    this.partnerships.unshift(partnershipData);
    this.filteredPartnerships = [...this.partnerships];
  
    // Manually trigger change detection in case of missing updates
    this.cdr.detectChanges();
  }
  
  deletePartnership(id: number) {
    // First, find the deleted partnership to get the entreprise name
    const deletedPartnership = this.partnerships.find(p => p.idPartnership === id);
    const entrepriseName = deletedPartnership?.entreprise?.nameEntreprise || 'Unknown Entreprise';
  
    // Now proceed to delete the partnership from the service
    this.partnershipService.deletePartnership(id).subscribe({
      next: () => {
        // Remove the partnership from the local data array after the service call
        this.partnerships = this.partnerships.filter(p => p.idPartnership !== id);
        this.filteredPartnerships = [...this.partnerships]; // Update the filtered partnerships
  
        // Trigger change detection to update UI
        this.cdr.detectChanges();
  
        // Send a notification after deletion with the entreprise name
        const notificationData = {
          title: 'Partnership Deleted',
          message: `Partnership with ${entrepriseName} has been deleted.`,
          icon: 'fa-trash-alt'
        };
  
        this.layoutService.sendNotification(notificationData);
  
        // Optionally, you can also send a notification via NotificationService
        this.NotificationService.addNotification(notificationData);
      },
      error: (err) => {
        this.error = 'Error deleting partnership';
        console.error(err);
      }
    });
  }
  
  

  generatePartnershipPdf(id: number) {
    this.partnershipService.generatePartnershipPdf(id).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        const fileURL = URL.createObjectURL(blob);
        link.href = fileURL;
        link.download = `partnership_${id}.pdf`;
        link.click();
      },
      error: (error) => {
        console.error('Error downloading PDF', error);
        this.error = 'Error downloading PDF';
      },
    });
  }

acceptPartnership(partnershipId: number, entrepriseId: number): void {
  this.http.post(`http://localhost:8088/Partnership/partnerships/accept/${partnershipId}/${entrepriseId}`, null, {
    responseType: 'text' // <-- This fixes the HttpErrorResponse false positive
  }).subscribe({
    next: () => {
      this.loadPartnerships();

      this.layoutService.sendNotification({
        title: 'Proposal Approved',
        message: `The proposal for partnership ID ${partnershipId} has been approved.`,
        icon: 'fa-check-circle'
      });
    },
    error: (error) => {
      console.error('Error accepting partnership:', error);
      this.error = 'Error accepting partnership';
    }
  });
}


  onFetchEntreprise(): void {
    if (this.entreprises) {
      this.partnershipService.getEntrepriseByName(this.nameEntreprise).subscribe(
        (data) => {
          this.selectedEntreprise = data;
        },
        (error) => {
          this.errorMessage = 'Error fetching entreprise by name';
          console.error(error);
        }
      );
    }
  }

  onAddPartnership(): void {
    if (!this.newPartnership.entreprise) {
      this.error = 'Please select an entreprise!';
      return;
    }

    if (!this.newPartnership.proposals) {
      this.error = 'Please select at least one proposal!';
      return;
    }

    this.loading = true;

    this.partnershipService.createPartnership(this.newPartnership).subscribe({
      next: (partnership) => {
        this.NotificationService.addNotification({
          title: 'New Partnership Added',
          message: `A new partnership with ${this.newPartnership.entreprise.nameEntreprise} has been added.`,
          icon: 'fa-check-circle'
        });

        this.layoutService.sendNotification({
          title: 'New Partnership Added',
          message: `A new partnership with ${this.newPartnership.entreprise.nameEntreprise} has been added.`,
          icon: 'fa-check-circle'
        });

        this.loadPartnerships(); // reload after adding
        this.cancelAddPartnership();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error adding partnership', error);
        this.error = 'Error adding partnership';
        this.loading = false;
      }
    });
  }
  viewPartnership(partnership: Partnership): void {
  this.selectedPartnership = partnership;
}

closeDetails(): void {
  this.selectedPartnership = null;
}
navigateToEdit(id: number): void {
  this.router.navigate(['/partnership/edit', id]);
}


}
