import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://wbptqnvcpiorvwjotqwx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicHRxbnZjcGlvcnZ3am90cXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDE0MDcsImV4cCI6MjA1NTgxNzQwN30.VC8h-3JynU2mJghOlzKa8XSsKsrTchcCTKy1hdI6W6c'
    );
  }

  // Method to upload a file to Supabase storage
  async uploadFile(fileName: string, file: File): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .from('course-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        return { error: error.message }; // Make sure error is returned properly
      }

      // Log the uploaded file data and path
      console.log('Uploaded file data:', data);

      // Get the public URL of the uploaded file
      const publicUrl = await this.getPublicUrl(data.path);

      if (!publicUrl) {
        console.error('Error retrieving public URL');
        return { error: 'Error retrieving public URL' };
      }

      console.log('Public URL:', publicUrl);  // Log the public URL
      return { path: data.path, publicUrl: publicUrl };  // Ensure you return the correct URL
    } catch (err) {
      console.error('Error in uploadFile method:', err);
      return { error: err.message };
    }
  }

  // Method to get the public URL of the uploaded file
  async getPublicUrl(filePath: string): Promise<string | null> {
    try {
      const response = await this.supabase.storage.from('course-images').getPublicUrl(filePath);

      if (!response.data || !response.data.publicUrl) {
        console.error('Error: Public URL is not available for path:', filePath);
        return null;
      }

      console.log('Retrieved public URL:', response.data.publicUrl);  // Log the URL
      return response.data.publicUrl;
    } catch (err) {
      console.error('Error in getPublicUrl method:', err);
      return null;
    }
  }

  // Method to check if a file exists in Supabase storage
  async fileExists(fileName: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage.from('course-images').list();

      if (error) {
        console.error('Error checking file existence:', error);
        return false;
      }

      // Check if any file matches the fileName
      return data.some(file => file.name === fileName);
    } catch (err) {
      console.error('Error in fileExists method:', err);
      return false;
    }
  }
}
