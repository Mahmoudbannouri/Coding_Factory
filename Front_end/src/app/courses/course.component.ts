import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../models/courses';
import { CourseResourceService } from '../services/course-resource.service';
import { CourseResource } from '../models/CourseResource';
import { CategoryEnum } from '../models/CategoryEnum';
import { User } from '../models/User';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  videoUrl: any;
  categoryEnum = ["WEB_DEVELOPMENT", "DATA_SCIENCE", "SECURITY", "AI", "CLOUD"];
  courses: Course[] ;
  filteredCourses: Course[] = [];
  newCourse: Course = new Course();
  selectedCourse: Course | null = null;
  trainers: User[] = [];
  showModal: boolean = false;
  showAddResourceModal: boolean = false;
  showResourcesModal: boolean = false;
  expandedResource: CourseResource | null = null;
  newResource: CourseResource = new CourseResource();
  resource!: CourseResource;
  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(
    private courseService: CourseService,
    private courseResourceService: CourseResourceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getAllCourses();
    this.newCourse.trainer = new User();
    this.newCourse.resources = [];
  }

  getAllCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data) => {
        this.courses = data.map(course => ({
          ...course,
          isExpanded: false // Initialize isExpanded as false for each course
        }));
        this.filterCourses();
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      (this.searchQuery === '' || course.title.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedCategory === '' || course.categoryCourse.toLowerCase().includes(this.selectedCategory.toLowerCase()))
    );
  }

  openAddResourceModal(course: Course): void {
    this.selectedCourse = course;  // Ensure selected course is set
    this.showAddResourceModal = true;
    this.showResourcesModal = false;
  }

  openAddCourseModal(): void {
    this.showModal = true;
    this.newCourse = new Course();
  }

  addCourse(): void {
    this.courseService.addCourse(this.newCourse).subscribe(
      (course) => {
        this.courses.push(course);
        this.filterCourses();
        this.closeAddCourseModal();
      },
      (error) => {
        console.error('Error adding course:', error);
      }
    );
  }

  closeAddCourseModal(): void {
    this.showModal = false;
    this.newCourse = new Course();
  }

  addResourceToCourse(): void {
    const newResource = new CourseResource();
    newResource.title = this.newResource.title;
    newResource.resourceType = this.newResource.resourceType;
    newResource.link_video = this.newResource.link_video;
    newResource.link_document = this.newResource.link_document;
    newResource.description = this.newResource.description;
    newResource.uploadDate = new Date();

    // Ensure the selected course is properly set and has an ID
    if (this.selectedCourse && this.selectedCourse.id) {
      newResource.course = this.selectedCourse;  // Assign the course to the new resource

      // Call service to add the resource to the database
      this.courseResourceService.addResource(newResource).subscribe(
        (response) => {
          // Handle success
          console.log('Resource added successfully:', response);
          // Update the resources list in the selected course
          if (this.selectedCourse.resources) {
            this.selectedCourse.resources.push(response); // Add the response to the course's resources
          }
          this.closeAddResourceModal(); // Close modal after adding the resource
        },
        (error) => {
          console.error('Error adding resource:', error);
        }
      );
    } else {
      console.error('Selected course is not available.');
    }
  }

  closeAddResourceModal(): void {
    this.showAddResourceModal = false;
    this.newResource = new CourseResource();
  }

  addNewResourceToCourse(): void {
    const newResource = new CourseResource();
    newResource.title = '';
    newResource.resourceType = '';
    newResource.link_video = '';
    newResource.link_document = '';
    newResource.description = '';
    newResource.uploadDate = new Date();

    this.newCourse.resources.push(newResource);
  }

  removeResource(index: number): void {
    this.newCourse.resources.splice(index, 1);
  }

  toggleResourceDetails(resource: any) {
    if (this.expandedResource?.id === resource.id) {
      this.expandedResource = null;
    } else {
      this.expandedResource = resource;
    }
  }

  toggleDescription(course: Course): void {
    course.isExpanded = !course.isExpanded;
  }

  openResourcesModal(course: Course): void {
    this.showResourcesModal = true;
    this.showAddResourceModal = false;
    this.showModal = false;
    this.selectedCourse = course;

    this.courseResourceService.getResourcesForCourse(course.id).subscribe(
      (resources) => {
        this.selectedCourse.resources = resources;
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  }

  closeResourcesModal(): void {
    this.showResourcesModal = false;
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      this.getAllCourses();
    });
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'WEB_DEVELOPMENT':
        return '#4CAF50';
      case 'DATA_SCIENCE':
        return '#FF5733';
      case 'SECURITY':
        return '#C70039';
      case 'AI':
        return '#FFC107';
      case 'CLOUD':
        return '#1E90FF';
      default:
        return '#808080';
    }
  }

  sanitizeYouTubeUrl(url: string): SafeResourceUrl {
    // Convert YouTube watch URL to embed URL
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/");
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }
}
