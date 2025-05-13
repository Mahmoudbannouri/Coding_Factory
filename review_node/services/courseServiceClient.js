// services/courseServiceClient.js
const axios = require('axios');

class CourseServiceClient {
    constructor() {
        this.baseUrl = 'http://localhost:8090/courses';
    }

    async updateCourseRate(courseId, rate) {
        try {
            await axios.put(`${this.baseUrl}/${courseId}/update-rate`, { rate });
            console.log(`Successfully updated course rate for ${courseId}`);
        } catch (error) {
            console.error(`Failed to update course rate for ${courseId}:`, error.message);
            throw error; // Re-throw to let the caller handle it
        }
    }
}

// Export an instance of the class
module.exports = new CourseServiceClient();
