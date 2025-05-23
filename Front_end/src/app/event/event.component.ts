import { Component, OnInit } from '@angular/core';
import { CategoryEnum } from 'app/models/CategoryEnum';
import { Centre } from 'app/models/Centre';
import { Event } from 'app/models/Event';
import { EventService } from 'app/services/event.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { User } from 'app/models/User';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StorageService } from 'app/shared/auth/storage.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MainCategory } from 'app/models/MainCategory';

declare var gapi: any;
declare const google: any;


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  private clientId = '57784083667-pg9ubhorjbdi2go9ra6mooe57act5vje.apps.googleusercontent.com';
  private apiKey = 'AIzaSyDNY6TmXi8zYR1yIOFJvQLd4zet6GHQlcE';
  private scope = 'https://www.googleapis.com/auth/calendar.events';

  currentUserId: number = 1;
  isEnrolled=false;
  participants: User[] = []; // Array to hold participants
  events: Event[]=[];
  searchQuery: string = '';
  selectedCategory: string = '';
  categoryEnum:string[] = [];
  filteredEvents: Event[] = [];
  showModal: boolean = false;
  newEvent: Event = new Event();
  showAddResourceModal: boolean = false;
  centers: Centre[] = [];
  isEditMode: boolean = false;
  editingEvent: Event | null = null;
  successMessage: string | null = null;
  messageVisible: boolean = false;
  currentPage: number = 0; // Start at page 0
  eventsPerPage: number = 6; // Number of events per page
  totalPaginationPages: number = 1; // Default value, will be calculated later
  isEnrolledMap: Map<number, boolean> = new Map();
  minDate: string;
  startDate: string | null = null;
  endDate: string | null = null;
  selectedTimePeriod: string = '';
  timePeriod: string = ''; // Added property to fix the error
  selectedFile: File | null = null;
  selectedImage: File | null = null;
  imageUrlMap: Map<number, SafeUrl> = new Map();
  currentUser: any;
  userRole: string = '';
  isLoggedIn: boolean = false;
  enrolledFilter: any;
  createdBy:any;
  filterType: string = 'all';

// Recommendation-related properties
  showRecommendModal: boolean = false;
  recommendationData: {
    eventDifficulty: string;
    developerCommunity: string;
    hackathons: string;
    programmingLanguages: string;
    volunteerGroups: string;
    activeDeveloperCommunities: string;
    achievementCount: number;
    pitchedIdea: string;
    softwareProjects: string;
    githubExposure: string;
    specificTechnology: string;
    totalProjects: number;
    techInvolvement: number;
    communityHackathon: number;
  } = {
    eventDifficulty: '',
    developerCommunity: '',
    hackathons: '',
    programmingLanguages: '',
    volunteerGroups: '',
    activeDeveloperCommunities: '',
    achievementCount: 0,
    pitchedIdea: '',
    softwareProjects: '',
    githubExposure: '',
    specificTechnology: '',
    totalProjects: 0,
    techInvolvement: 1,
    communityHackathon: 0
  };

  constructor(private zone: NgZone ,private storageService: StorageService,private eventService: EventService,private datePipe: DatePipe,private cdr: ChangeDetectorRef,private ngZone: NgZone,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      // Get the logged-in user
      this.currentUser = this.storageService.getUser();
      // Get the user's role
      this.userRole = StorageService.getUserRole();
    }

    this.getAllEvents();
    this.getCenters();
    console.log("test",this.centers);
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

  }

  // Method to check if the user is an admin
  isAdmin(): boolean {
    return StorageService.isAdminLoggedIn();
  }

  // Method to check if the user is a student
  isStudent(): boolean {
    return StorageService.isStudentLoggedIn();
  }

  // Method to check if the user is a trainer
  isTrainer(): boolean {
    return StorageService.isTrainerLoggedIn();
  }
  isPartner():boolean{
    return StorageService.isPartnerLoggedIn();
  }
  // Add these methods to your component
  isCurrentUserCreator(event: any): boolean {
    if (!this.currentUser || !event) return false;

    // Check if eventCreator is an object with id
    if (event.eventCreator && typeof event.eventCreator === 'object') {
      return event.eventCreator.id === this.currentUser.id;
    }
    // Check if eventCreator is the ID itself
    else if (event.eventCreator && typeof event.eventCreator === 'number') {
      return event.eventCreator === this.currentUser.id;
    }
    // Check if eventCreatorId exists
    else if (event.eventCreatorId) {
      return event.eventCreatorId === this.currentUser.id;
    }

    return false;
  }
  isCreator(): boolean {
    return this.isAdmin()||this.isTrainer()||this.isPartner();
  }
  // Method to check edit permissions
  canEditEvent(event: any): boolean {
    if (!event) return false;

    // Admins can edit any event
    if (this.isAdmin()) return true;

    // Trainers and Partners can only edit their own events
    if (this.isTrainer() || this.isPartner()) {
      return this.isCurrentUserCreator(event);
    }

    return false;
  }

  canDeleteEvent(event: any): boolean {
    return this.isAdmin() || (this.isTrainer() && this.isCurrentUserCreator(event)) ||
      (this.isPartner() && this.isCurrentUserCreator(event));
  }

  canAddEvent(): boolean {
    return this.isAdmin() || this.isTrainer() || this.isPartner();
  }

  canEnroll(event: any): boolean {
    // Users can enroll if they're not the creator and the event is valid
    return !this.isCurrentUserCreator(event) && this.isEventDateValid(event.eventDate);
  }
  // Method to fetch creator's name based on event creator's ID
  getEventCreatorName(creatorId: number): Observable<string> {
    return this.eventService.getUserCreator(creatorId).pipe(
      map((user: User) => {

        return user.name;
      }),
      catchError(() => {
        console.error(`Error fetching user with ID ${creatorId}`);
        return of('Unknown');
      })
    );
  }
  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (data: Event[]) => {
        this.events = data.map(event => ({
          ...event,
          timestamp: new Date(event.eventDate).getTime(),
          isExpanded: false,
          eventCreatorName: null,
        }));

        // 🔁 Build an array of observables to fetch names
        const nameObservables = this.events.map(event => {
          if (event.eventCreator) {
            return this.getEventCreatorName(event.eventCreator).pipe(
              map(name => ({ id: event.eventCreator, name })),
              catchError(() => of({ id: event.eventCreator, name: 'Unknown' }))
            );
          } else {
            return of({ id: null, name: 'Unknown' });
          }
        });

        // 🧠 Wait until all names are fetched
        forkJoin(nameObservables).subscribe(results => {
          // Assign the correct names back to the events
          this.events.forEach(event => {
            const match = results.find(res => res.id === event.eventCreator);
            if (match) {
              event.eventCreatorName = match.name;
            }
          });
          console.log('Events after name mapping:', this.events);
          this.calculatePagination();
          this.filterEvents();
          this.cdr.detectChanges(); // 💡 Now safe to re-render
        });
      },
      error => {
        console.error('Error fetching Events:', error);
      }
    );
  }



  calculatePagination(): void {
    this.totalPaginationPages = Math.ceil(this.events.length / this.eventsPerPage);
  }
  // Function to change the page
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPaginationPages) {
      this.currentPage = page;
      this.filterEvents(); // Update the filtered events for the new page
    }
  }
  // Store creator names in a map
// Store creator names in a map
  private creatorNameMap: Map<number, string> = new Map();

  filterEvents(): void {
    let enrolledUserId: number | null = null;
    let createdBy: number | null = null;

    if (this.filterType === 'enrolled') {
      enrolledUserId = this.currentUser.id;
    } else if (this.filterType === 'my') {
      createdBy = this.currentUser.id;
    }

    // Prepare query parameters
    const params = {
      searchQuery: this.searchQuery,
      selectedCategory: this.selectedCategory,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedTimePeriod: this.selectedTimePeriod,
      enrolledUserId,
      createdBy,
    };

    // Make an HTTP call to your backend filter function
    this.eventService.getFilteredEvents(params).subscribe((events: any[]) => {
      // Collect creator IDs from all events
      const creatorIds = new Set<number>();
      events.forEach(event => {
        if (event.eventCreator) {
          creatorIds.add(event.eventCreator);
        }
      });

      // Fetch names for all creators that are not already in the map
      const creatorRequests = Array.from(creatorIds).map(creatorId => {
        if (!this.creatorNameMap.has(creatorId)) {
          return this.getEventCreatorName(creatorId).toPromise().then(name => {
            this.creatorNameMap.set(creatorId, name);
          });
        }
        return Promise.resolve();
      });

      // Once all names are fetched, map the events
      Promise.all(creatorRequests).then(() => {
        this.events = events.map(event => {
          return {
            ...event,
            timestamp: new Date(event.eventDate).getTime(),
            isExpanded: false, // Adjust based on your needs
            eventCreatorName: this.creatorNameMap.get(event.eventCreator) ?? 'Unknown', // Use 'Unknown' if name is not available
          };
        });

        // Recalculate pagination
        this.totalPaginationPages = Math.ceil(this.events.length / this.eventsPerPage);

        // Adjust current page if needed
        if (this.currentPage >= this.totalPaginationPages) {
          this.currentPage = this.totalPaginationPages > 0 ? this.totalPaginationPages - 1 : 0;
        }

        // Slice for current page
        const startIndex = this.currentPage * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        this.filteredEvents = this.events.slice(startIndex, endIndex);

        // Trigger change detection
        this.cdr.detectChanges();
      });
    });
  }


  clearDateRangeFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.filterEvents(); // Reapply filters
  }

  combineDateTime(): string {
    if (this.newEvent.eventDateOnly && this.newEvent.eventTimeOnly) {
      return `${this.newEvent.eventDateOnly}T${this.newEvent.eventTimeOnly}:00`;
    }
    return '';
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      // If a file is selected, convert it to base64 and set it as the image URL
      this.convertToBase64(file).then((base64String) => {
        this.newEvent.imageUrl = base64String; // Set the base64-encoded image
      });
    } else if (this.isEditMode && !file) {
      // If the form is in edit mode and no new file is selected, use the existing image URL from the database
      if (this.newEvent.imageUrl === null || this.newEvent.imageUrl === "") {
        // If there's no image URL, set it to the existing one
        this.newEvent.imageUrl = this.editingEvent.imageUrl; // Use the existing image URL from the database
      }
      // If the image URL has already been set, don't change it
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  addEvent(): void {
    const formData = new FormData();
    /* this.newEvent.centre = {
       centreID: this.newEvent.centre.centreID,
       centreName: this.newEvent.centre.centreName,
       centreDescription: this.newEvent.centre.centreDescription
     };*/

    this.newEvent.eventDate = this.combineDateTime();



    this.eventService.addEvent(this.newEvent,this.currentUser.id).subscribe(
      (event) => {
        this.events.push(event);
        this.newEvent = new Event();
        this.selectedFile = null; // Clear the selected file
        this.selectedImage = null; // Clear the selected image
        this.ngZone.run(() => {
          console.log("Inside ngZone");
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Event added successfully!',
            timer: 2000,
            showConfirmButton: false
          });
        });
        this.getAllEvents();
        this.filterEvents();
        this.closeAddEventModal(); // Reset modal fields
        // Show success message

        console.log("Message Visible: ", this.messageVisible);

      },
      (error) => {
        console.error('Error adding Event:', error);
      }
    );
  }
  closeAddEventModal(): void {
    this.showModal = false;
    this.newEvent = new Event();
    this.isEditMode = false;
    this.editingEvent = null;
    this.cdr.detectChanges();

  }

  openAddEventModal(): void {
    this.showModal = true;
    this.isEditMode = false;
    this.newEvent = new Event();
    this.cdr.detectChanges();

  }
  openEditEventModal(eventId: number): void {
    this.isEditMode = true;  // Set to true for updating
    this.eventService.getEventById(eventId).subscribe(
      (event: Event) => {
        this.editingEvent = event;
        this.newEvent = { ...event }; // Populate modal fields with event data
        this.newEvent.eventDateOnly = this.datePipe.transform(event.eventDate, 'yyyy-MM-dd');  // Format date
        this.newEvent.eventTimeOnly = this.datePipe.transform(event.eventDate, 'HH:mm');  // Format time
        this.newEvent.imageUrl = event.imageUrl;
        if (event.centre && event.centre) {
          const foundCentre = this.centers.find(centre => centre.idCenter === event.centre);
          this.newEvent.centre = foundCentre ? foundCentre.idCenter : null;
        } else {
          this.newEvent.centre = event.centre; // If already an object, just use it directly
        }

        this.cdr.detectChanges();
        this.showModal = true;
      },
      (error) => {
        console.error('Error fetching event:', error);
      }
    );
  }
  updateEvent(): void {

    if (this.newEvent.idEvent) {
      this.ngZone.run(() => {
        console.log("Inside ngZone");
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event Updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      });
      if (!this.newEvent.imageUrl) {
        this.newEvent.imageUrl = this.editingEvent.imageUrl;
      }
      this.newEvent.eventDate = this.combineDateTime();
      this.eventService.updateEvent(this.newEvent.idEvent, this.newEvent).subscribe(
        (response) => {

          console.log('Event updated:', response);
          this.getAllEvents();
          this.filterEvents(); // Refresh event list
          this.closeAddEventModal(); // Reset modal fields
        },
        (error) => {
          console.error('Error updating event:', error);
        }
      );
    }
  }

  getCategoryEnumValues(): string[] {
    return Object.keys(CategoryEnum).map(key => CategoryEnum[key as keyof typeof CategoryEnum]);
  }
  getMainCategoryValues(): string[] {
    return Object.keys(MainCategory).map(key => MainCategory[key as keyof typeof MainCategory]);
  }
  getCenters(): void {
    this.eventService.getAllCenters().subscribe(
      (data: Centre[]) => {
        this.centers = data,
          console.log('Centers:', this.centers);

      },
      (error) => {
        console.error('Error fetching Centers:', error);
      }
    );
  }
  deleteEvent(id: number): void {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Show success message immediately after user confirms
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The event has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });

        // Proceed with deletion if user clicked "Yes"
        this.eventService.deleteEvent(id).subscribe(
          () => {
            // Remove the event from the list after deletion
            this.events = this.events.filter(event => event.idEvent !== id);
            this.getAllEvents();
            this.filterEvents();

            if (this.currentPage > 0 && this.filteredEvents.length === 0) {
              this.currentPage--; // Move to the previous page
              this.filterEvents(); // Reapply the filter and pagination
            }

            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error deleting Event:', error);
          }
        );
      } else {
        // Optionally, you can log that the deletion was canceled
        console.log('Deletion was canceled');
      }
    });
  }

  getEvent(id: number): void {
    this.eventService.getEventById(id).subscribe(
      (event: Event) => {
        this.newEvent = event; // Assign the retrieved event to the form variable
      },
      (error) => {
        console.error('Error fetching event:', error);
      }
    );
  }
  // Enroll to an event
  enrollToEvent(eventId: number, accessToken: string): void {
    Swal.fire({
      title: 'Enrolling…',
      text: 'Sending confirmation email. Please wait.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.eventService
      .enrollToEvent(eventId, accessToken, this.currentUser.id)
      .subscribe({
        next: () => {
          // ─── ① PATCH YOUR IN‑MEMORY MODELS ───
          // find it in the full list
          const full = this.events.find(e => e.idEvent === eventId);
          if (full) {
            full.participants = [...(full.participants || []), this.currentUser.id];
          }

          // find it in the paged slice
          const paged = this.filteredEvents.find(e => e.idEvent === eventId);
          if (paged) {
            paged.participants = [...(paged.participants || []), this.currentUser.id];
          }

          // ─── ② TRIGGER ANGULAR TO RE‑RENDER ───
          // if you’re on the default CD strategy this is enough:
          this.cdr.detectChanges();
          // if you use OnPush, you may need this instead:
          // this.cdr.markForCheck();

          // ─── ③ SHOW SUCCESS TOAST ───
          Swal.fire({
            icon: 'success',
            title: 'Enrolled!',
            text:  'You’ll get an email shortly.',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: err => {
          console.error('Enroll failed', err);
          Swal.fire({
            icon: 'error',
            title: 'Enrollment Failed',
            text:  err.message || 'Please try again later.'
          });
        }
      });
  }

  deroll(event: Event): void {
    this.eventService.deroll(event.idEvent,this.currentUser.id).subscribe({
      next: () => {
        console.log(`User derolled successfully from event ${event.idEvent}`);

        // Remove the current user from the participants list
        event.participants = event.participants.filter(
          participant => participant !== this.currentUser.idUser
        );
        this.cdr.detectChanges();
        this.getAllEvents();
      },
      error: (error) => {
        console.error(`Error derolling from event ${event.idEvent}:`, error);
      }
    });
  }
  loadGoogleClient(eventId: number): void {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scope,
      callback: (response) => {
        if (response && response.access_token) {
          console.log('OAuth token received:', response);
          // Send the access token to the backend
          this.enrollToEvent(eventId, response.access_token);
        }
      },
    });

    // Request the access token
    client.requestAccessToken();
  }
  downloadIcsFile(eventId: number): void {
    this.eventService.downloadIcs(eventId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'event.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  chooseCalendarOption(eventId: number): void {
    Swal.fire({
      title: 'Choose Calendar Option',
      text: 'How do you want to save this event?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Use Google Calendar',
      cancelButtonText: 'Download .ics File',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // 🟢 User chose Google
        this.loadGoogleClient(eventId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 📥 User chose .ics
        this.downloadIcsFile(eventId); // optional if you want download feature
        this.enrollToEvent(eventId, null); // send null token
      }
    });
  }
  getParticipants(eventId: number): void {
    this.eventService.getParticipants(eventId).subscribe(
      (data: User[]) => {
        // Find the event and update its participants array
        const event = this.events.find(e => e.idEvent === eventId);
        if (event) {
          event.participants = data.map(participant => participant.id);
        }
        console.log('Participants:', data);
      },
      (error) => {
        console.error('Error fetching participants:', error);
      }
    );
  }

  isUserEnrolled(event: Event): boolean {
    return event.participants.some(participant => participant === this.currentUser.id);
  }

  isEventDateValid(eventDate: string | Date): boolean {
    const currentDate = new Date(); // Get the current system date
    const eventDateObj = new Date(eventDate); // Convert event date to Date object

    // Check if the event date is today or in the future
    return eventDateObj >= currentDate;
  }
  generateDescription() {
    this.newEvent.eventDate = this.combineDateTime();
    console.log(this.newEvent);

    if (!this.newEvent.eventName || !this.newEvent.eventDate) {
      console.error('Event name and date are required');
      return;
    }

    this.eventService.generateEventDescription(this.newEvent).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.newEvent.eventDescription = response.description; // Ensure it's an object
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error generating description:', error);
      }
    );
  }


// Get the safe image URL for a specific event
  getSafeImageUrl(imageUrl: string): string {
    let imagePath = '';
    this.eventService.getEventImageUrl(imageUrl).subscribe(url => {
      imagePath = url;
    });
    return imagePath;
  }

  isImageFile(file: File): boolean {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return file && acceptedImageTypes.includes(file.type);
  }

  isFormValid: boolean = false; // Tracks overall form validity
  isImageValid: boolean = false;
  validateForm(): void {
    // Check if all required fields are filled and the image is valid
    this.isFormValid =
      !!this.newEvent.eventName &&
      !!this.newEvent.eventDescription &&
      !!this.newEvent.eventDate &&
      !!this.newEvent.eventCategory &&
      !!this.newEvent.centre &&
      this.isImageValid;
  }

  showViewMoreModal: boolean = false; // To control the visibility of the modal
  selectedEvent: any; // To store the event that the user wants to view

// Open the "View More" modal and set the selected event
  openViewMoreModal(event: any) {
    this.selectedEvent = event;
    this.showViewMoreModal = true;
  }

// Close the "View More" modal
  closeViewMoreModal() {
    this.showViewMoreModal = false;
    this.selectedEvent = null; // Clear the selected event
  }

  openRecommendModal(): void {
    this.showRecommendModal = true;
    this.recommendationData = {
      eventDifficulty: '',
      developerCommunity: '',
      hackathons: '',
      programmingLanguages: '',
      volunteerGroups: '',
      activeDeveloperCommunities: '',
      achievementCount: 0,
      pitchedIdea: '',
      softwareProjects: '',
      githubExposure: '',
      specificTechnology: '',
      totalProjects: 0,
      techInvolvement: 1,
      communityHackathon: 0
    };
    this.cdr.detectChanges();
  }

  closeRecommendModal(): void {
    this.showRecommendModal = false;
    this.cdr.detectChanges();
  }

  getRecommendedEvents(): void {
    const features: Record<string, string> = {
      '5. Are you associated with any developer Community?': this.recommendationData.developerCommunity,
      '7. Participating in Hackathons and other competitions?': this.recommendationData.hackathons,
      '1. How many programming languages do you know? ': this.recommendationData.programmingLanguages,
      '9. Involved in additional volunteer groups?(NCC,NSS, Social Welfare Groups  or any other)': this.recommendationData.volunteerGroups,
      '6. Active in developer Communities': this.recommendationData.activeDeveloperCommunities,
      achievement_count: this.recommendationData.achievementCount.toString(),
      '10. Have you ever pitched any idea?': this.recommendationData.pitchedIdea,
      '8. Have you made any Software based projects?': this.recommendationData.softwareProjects,
      '4. Exposure to GitHub ?': this.recommendationData.githubExposure,
      '2.  Actively involved in Specific technology?': this.recommendationData.specificTechnology || 'None',
      total_projects: this.recommendationData.totalProjects.toString(),
      tech_involvement: this.recommendationData.techInvolvement.toString(),
      community_hackathon: this.recommendationData.communityHackathon.toString()
    };

    console.log('Sending features to backend:', features);

    this.eventService.getRecommendedEvents(features).subscribe(
      (events: Event[]) => {
        console.log('Received recommended events:', events);
        if (events.length === 0) {
          this.ngZone.run(() => {
            Swal.fire({
              icon: 'info',
              title: 'No Events Found',
              text: 'No events match your preferences.',
              timer: 2000,
              showConfirmButton: false
            });
          });
          this.events = [];
          this.filteredEvents = [];
          this.totalPaginationPages = 1;
          this.currentPage = 0;
          this.cdr.detectChanges();
          this.closeRecommendModal();
          return;
        }

        this.events = events.map(event => ({
          ...event,
          timestamp: new Date(event.eventDate).getTime(),
          isExpanded: false,
          eventCreatorName: null
        }));

        console.log('Mapped events:', this.events);

        const nameObservables = this.events.map(event => {
          if (event.eventCreator) {
            return this.getEventCreatorName(event.eventCreator).pipe(
              map(name => ({ id: event.eventCreator, name })),
              catchError(() => of({ id: event.eventCreator, name: 'Unknown' }))
            );
          } else {
            return of({ id: null, name: 'Unknown' });
          }
        });

        forkJoin(nameObservables).subscribe(results => {
          this.events.forEach(event => {
            const match = results.find(res => res.id === event.eventCreator);
            if (match) {
              event.eventCreatorName = match.name;
            }
          });
          console.log('Events with creator names:', this.events);
          this.totalPaginationPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.currentPage = 0; // Reset to first page
          this.filteredEvents = this.events.slice(0, this.eventsPerPage);
          console.log('Updated filteredEvents:', this.filteredEvents);
          this.closeRecommendModal();
          this.ngZone.run(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Recommended events loaded successfully!',
              timer: 2000,
              showConfirmButton: false
            });
          });
          this.cdr.detectChanges();
        });
      },
      error => {
        console.error('Error fetching recommended events:', error);
        this.ngZone.run(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load recommended events: ' + (error.message || 'Unknown error'),
            timer: 3000,
            showConfirmButton: false
          });
        });
      }
    );
  }

  currentStep: number = 1;
  totalSteps: number = 10;
  chatHistory: { question: string, answer: string }[] = [];

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep === this.totalSteps) {
        this.getRecommendedEvents();
        return;
      }
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.chatHistory.pop();
    }
  }

  setResponse(field: string, value: any): void {
    this.recommendationData[field] = value;
    this.chatHistory.push({
      question: this.getCurrentQuestion(),
      answer: typeof value === 'string' ? value : value.toString()
    });
    if (this.currentStep !== 6) { // Skip auto-advance for number input
      this.nextStep();
    }
  }

  private validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 1: return !!this.recommendationData.developerCommunity;
      case 2: return !!this.recommendationData.programmingLanguages;
      case 3: return !!this.recommendationData.hackathons;
      case 4: return !!this.recommendationData.volunteerGroups;
      case 5: return !!this.recommendationData.activeDeveloperCommunities;
      case 6: return this.recommendationData.achievementCount >= 0;
      case 7: return !!this.recommendationData.pitchedIdea;
      case 8: return !!this.recommendationData.softwareProjects;
      case 9: return !!this.recommendationData.githubExposure;
      case 10: return !!this.recommendationData.specificTechnology;
      default: return true;
    }
  }

  private getCurrentQuestion(): string {
    const questions = [
      'Are you associated with any developer community?',
      'How many programming languages do you know?',
      'Have you participated in hackathons?',
      'Are you part of any volunteer groups?',
      'How active are you in developer communities?',
      'How many achievements have you earned?',
      'Have you ever pitched a tech idea?',
      'Have you created software projects?',
      'What\'s your GitHub experience?',
      'Which technology interests you most?'
    ];
    return questions[this.currentStep - 1] || '';
  }

}
