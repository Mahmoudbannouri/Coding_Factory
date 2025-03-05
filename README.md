## Course Management System

### Overview
This project is a Course Management System developed as part of the coursework for CS404 - Software Engineering at Esprit School of Engineering. The system allows for the management of courses and their resources, including videos, documents, and images. It provides a user-friendly interface with advanced features such as pagination, filtering, search, and file uploads to Subabase cloud storage. The backend is built using Spring Boot with a microservice architecture and an SQL database, while the frontend uses Angular.

### Features
#### Course Management:
- Manage courses and course resources.
- Organize courses with key details such as course name, description, and related resources.

#### Pagination:
- Efficiently browse through courses and resources with pagination.

#### Search and Filters:
- Search for courses and resources by keywords.
- Filter by categories, tags, or other criteria.

#### File Upload:
- Upload course resources (e.g., documents, images) to Subabase cloud storage.
- Support for image and video uploads.
- Subabase serves as the cloud storage server for saving files and resources.

#### Video Reader:
- Built-in video player for viewing course-related videos.

#### Microservice Architecture:
- Backend services are divided into microservices for scalability and ease of maintenance.

#### Microservice Review:
- Each course has a rating system for users to rate the course.
- Users can leave comments with suggestions or feedback about the course.

#### AI Review Suggestion:
- Implemented AI-powered suggestions using Gemini AI to generate improvement recommendations for course content.
- Every review with a comment automatically triggers the AI to generate a suggestion for the professor to enhance the course material.

#### User Experience:
- Designed with a focus on providing a smooth and intuitive user experience.

### Tech Stack
#### Frontend
- Angular: For building the user interface with TypeScript.
- Bootstrap: For responsive design and UI components.

#### Backend
- Spring Boot: For building the backend API and managing business logic.
- JPA (Java Persistence API) with Hibernate: For interacting with the SQL database.
- MySQL: For storing course and resource data in an SQL database.
- Subabase: For cloud storage, including file uploads for course resources, serving as the cloud server.

#### Microservices
- Spring Cloud: For microservices communication and service discovery.

