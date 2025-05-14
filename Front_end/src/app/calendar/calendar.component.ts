import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Pfe } from '../models/pfe';  
import { PfeService } from '../services/pfe.service';

const colors: any = {
  red: { primary: '#ad2121', secondary: '#FAE3E3' },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' },
  green: { primary: '#21ad5b', secondary: '#D1FAD1' }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarsComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  modalData: { action: string; event: CalendarEvent };
  selectedPfeId: number | null = null;
  selectedPfe: Pfe | null = null;
  pfes: Pfe[] = [];
  newEvent: CalendarEvent | null = null;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Modifier', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.removeEvent(event);
      }
    }
  ];

  constructor(private modal: NgbModal, private pfeService: PfeService) {}

  ngOnInit(): void {
    this.loadPfes();
  }

  loadPfes(): void {
    this.pfeService.getAllPfe().subscribe(
      (pfes) => {
        this.pfes = pfes;
        if (pfes.length > 0) {
          this.onPfeSelect(pfes[0].id);
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des PFEs:', error);
      }
    );
  }
  isLoading: boolean = false;
  loadPfeEvents(pfeId: number): void {
    this.isLoading = true;
    const selectedPfe = this.pfes.find(pfe => pfe.id === pfeId);
    
    this.pfeService.getMeetingDates(pfeId).subscribe(
      (dates) => {
        this.isLoading = true;
        this.events = dates.map(date => {
          const dateObj = new Date(date);
          return {
            start: dateObj,
            end: dateObj,
            title: `Réunion pour ${selectedPfe?.projectTitle || 'PFE'}`,
            color: colors.blue,
            actions: this.actions,
            allDay: true,
            meta: { pfeId },
            resizable: { beforeStart: true, afterEnd: true },
            draggable: true
          };
        });
        
        // Si des événements existent, ouvrir le mois de la première réunion
        if (this.events.length > 0) {
          this.viewDate = new Date(this.events[0].start);
        }
        
        this.refresh.next();
      },
      (error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement des dates de réunion:', error);
        this.events = [];
        this.refresh.next();
      }
    );
  }
  onPfeSelect(pfeId: number | string): void {
    const id = typeof pfeId === 'string' ? parseInt(pfeId, 10) : pfeId;
    
    // Trouver le PFE sélectionné
    this.selectedPfe = this.pfes.find(pfe => pfe.id === id) || null;
    this.selectedPfeId = id;
  
    if (this.selectedPfe) {
      // Charger les événements pour ce PFE
      this.loadPfeEvents(id);
      
      // Si le PFE a des réunions, ajuster la vue pour les afficher
      if (this.events.length > 0) {
        // Fermer le jour actif s'il est ouvert
        this.activeDayIsOpen = false;
        
        // Optionnel: Déplacer la vue vers la première réunion
        this.viewDate = new Date(this.events[0].start);
        
        // Forcer le rafraîchissement
        this.refresh.next();
      }
    } else {
      console.error('PFE non trouvé avec ID:', id);
      // Effacer les événements si aucun PFE n'est sélectionné
      this.events = [];
      this.refresh.next();
    }
  }

  addEvent(): void {
    console.log('Selected Pfe:', this.selectedPfe); // Debug log
    console.log('Selected Pfe ID:', this.selectedPfeId); // Debug log
    
    if (!this.selectedPfe) {
      alert('Veuillez sélectionner un PFE avant d\'ajouter une réunion');
      return;
    }
  
    this.newEvent = {
      title: `Nouvelle réunion pour ${this.selectedPfe.projectTitle}`,
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.green,
      draggable: true,
      resizable: { beforeStart: true, afterEnd: true },
      actions: this.actions,
      meta: { pfeId: this.selectedPfeId }
    };
  
    this.events = [...this.events, this.newEvent];
    this.handleEvent('Ajouter une réunion', this.newEvent);
    this.refresh.next();
  }
  saveEvent(): void {
  if (this.modalData?.event?.start && this.selectedPfeId) {
    // Format the date correctly (backend expects Date object)
    const meetingDate = new Date(this.modalData.event.start);
    
    this.pfeService.addMeetingDate(this.selectedPfeId, meetingDate)
      .subscribe({
        next: (updatedPfe) => {
          // Recharge les événements après sauvegarde
          this.loadPfeEvents(this.selectedPfeId!);
          this.modal.dismissAll();
          // Affiche un message de succès
          alert('Réunion ajoutée avec succès!');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
          alert('Erreur lors de l\'ajout de la réunion');
        }
      });
  }
}


// Ajoutez cette méthode pour fermer le modal sans sauvegarder
cancelEvent(): void {
  if (this.newEvent) {
    this.events = this.events.filter(e => e !== this.newEvent);
    this.refresh.next();
  }
  this.modal.dismissAll();
}
  removeEvent(event: CalendarEvent): void {
  if (!event.start || !this.selectedPfeId) {
    console.error('Données manquantes pour la suppression');
    return;
  }

  // Confirmation avant suppression
  if (!confirm('Voulez-vous vraiment supprimer cette réunion ?')) {
    return;
  }

  // Formatage de la date pour le backend (sans heure)
  const dateToDelete = new Date(
    Date.UTC(
      event.start.getFullYear(),
      event.start.getMonth(),
      event.start.getDate()
    )
  );

  this.pfeService.removeMeetingDate(this.selectedPfeId, dateToDelete)
    .subscribe({
      next: () => {
        // Suppression de l'événement du calendrier
        this.events = this.events.filter(e => e !== event);
        this.refresh.next();
        alert('Réunion supprimée avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Échec de la suppression de la réunion');
      }
    });
}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
}



