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
  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (data: Event[]) => {
        // Map over the events and create the new event array
        this.events = data.map(event => ({
          ...event,
          timestamp: new Date(event.eventDate).getTime(),
          isExpanded: false,
        }));

        // Fetch eventCreator name for each event
        this.events.forEach(event => {
          if (event.eventCreator) {
            console.log(event.eventCreator);
            this.eventService.getUserCreator(event.eventCreator).subscribe(
              user => {
                // Run inside NgZone to ensure change detection
                this.zone.run(() => {
                  event.eventCreatorName = user.name;  // ✅ Assign name here
                  this.cdr.detectChanges(); // Trigger change detection if needed
                });
                console.log(event.eventCreatorName);
              },
              error => {
                console.error(`Error fetching user with ID ${event.eventCreator}`, error);
                this.zone.run(() => {
                  event.eventCreatorName = 'Unknown';
                  this.cdr.detectChanges();
                });
              }
            );
          } else {
            event.eventCreatorName = 'Unknown';
          }
        });

        // After updating eventCreatorName, run change detection for the whole list
        this.calculatePagination(); 
        this.filterEvents();
        this.cdr.detectChanges();
        console.log(this.events);
      },
      (error) => {
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
  filterEvents(): void {
    // Prepare query parameters
    const params = {
      searchQuery: this.searchQuery,
      selectedCategory: this.selectedCategory, // This should hold the selected category value
      startDate: this.startDate,
      endDate: this.endDate,
      selectedTimePeriod: this.selectedTimePeriod,
    };
  
    // Make an HTTP call to your backend filter function
    this.eventService.getFilteredEvents(params).subscribe((events: any[]) => {
      this.events = events;
      console.log(this.selectedCategory);
      // Recalculate total pages
      this.totalPaginationPages = Math.ceil(this.events.length / this.eventsPerPage);
  
      // Adjust current page if needed
      if (this.currentPage >= this.totalPaginationPages) {
        this.currentPage = this.totalPaginationPages > 0 ? this.totalPaginationPages - 1 : 0;
      }
  
      // Slice for current page
      const startIndex = this.currentPage * this.eventsPerPage;
      const endIndex = startIndex + this.eventsPerPage;
      this.filteredEvents = this.events.slice(startIndex, endIndex);
      this.cdr.detectChanges();
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
    this.newEvent.centre = {
      centreID: this.newEvent.centre.centreID,
      centreName: this.newEvent.centre.centreName,
      centreDescription: this.newEvent.centre.centreDescription
    };
    
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
        if (event.centre && event.centre.centreID) {
          this.newEvent.centre = this.centers.find(centre => centre.centreID === event.centre.centreID);
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
  getCenters(): void {
    this.eventService.getAllCenters().subscribe(
      (data: Centre[]) => {
        this.centers = data;
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
    title: 'Enrolling...',
    text: 'Sending confirmation email. Please wait.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  this.eventService.enrollToEvent(eventId,accessToken,this.currentUser.id).subscribe({
    next: (response) => {
      console.log(`User enrolled successfully in event ${eventId}`);
      // ✅ Backend responded successfully — close loading and show success
      Swal.fire({
        icon: 'success',
        title: 'Enrolled Successfully!',
        text:  'You will receive an email shortly.',
        showConfirmButton: false,
        timer: 3000
      });
      //this.loadGoogleClientAndCreateEvent(eventId);
      
      this.cdr.detectChanges();
      // Refresh the participants list for the event
      this.getParticipants(eventId);
    },
    error: (error) => {
      console.error(`Error enrolling to event ${eventId}:`, error);
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
    return event.participants.some(participant => participant === this.currentUser.idUser);
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
}
