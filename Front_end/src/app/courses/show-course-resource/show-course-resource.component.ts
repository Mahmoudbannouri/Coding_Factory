import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Course } from '../../models/courses';
import { CourseResource } from '../../models/CourseResource';
import { CourseResourceService } from '../../services/course-resource.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-course-resource',
  templateUrl: './show-course-resource.component.html',
  styleUrls: ['./show-course-resource.component.scss']
})
export class ShowCourseResourceComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedCourse: Course | null = null;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() resourceAdded = new EventEmitter<CourseResource>();

  expandedResource: CourseResource | null = null;
  resources: CourseResource[] = [];
  searchTerm: string = ''; // Added for search functionality

  constructor(
    private courseResourceService: CourseResourceService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCourse'] && this.selectedCourse) {
      this.fetchResources();
    }
  }

  handleResourceAdded(newResource: CourseResource): void {
    this.resources.push(newResource);
    this.cdr.detectChanges();
  }

  fetchResources(): void {
    if (this.selectedCourse && this.selectedCourse.id) {
      this.courseResourceService.getResourcesForCourse(this.selectedCourse.id).subscribe(
        (resources) => {
          this.resources = [...resources];
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching resources:', error);
        }
      );
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  toggleResourceDetails(resource: CourseResource): void {
    this.expandedResource = this.expandedResource?.id === resource.id ? null : resource;
  }

  getDocumentUrl(documentUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(documentUrl);
  }

  deleteResource(resourceId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this resource!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseResourceService.deleteResource(resourceId).subscribe(
          () => {
            this.resources = this.resources.filter(resource => resource.id !== resourceId);
            Swal.fire('Deleted!', 'The resource has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting resource:', error);
            Swal.fire('Error!', 'Something went wrong while deleting the resource.', 'error');
          }
        );
      }
    });
  }

  get filteredResources(): CourseResource[] {
    return this.resources.filter(resource =>
      resource.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
