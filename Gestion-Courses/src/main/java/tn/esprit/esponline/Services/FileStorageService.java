package tn.esprit.esponline.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService implements IFileStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket.images}")
    private String imagesBucket = "course-images"; // Default value

    @Value("${supabase.bucket.resources}")
    private String resourcesBucket = "course-resources"; // Default value

    private final RestTemplate restTemplate = new RestTemplate();

    // Existing course image methods (unchanged)
    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        return uploadToSupabase(file, imagesBucket, "");
    }

    @Override
    public void deleteFile(String fileUrl) {
        deleteFromSupabase(fileUrl, imagesBucket);
    }

    // New resource methods
    @Override
    public String uploadDocument(MultipartFile file) throws IOException {
        return uploadToSupabase(file, resourcesBucket, "documents/");
    }

    @Override
    public String uploadVideo(MultipartFile file) throws IOException {
        return uploadToSupabase(file, resourcesBucket, "videos/");
    }

    @Override
    public void deleteDocument(String fileUrl) {
        deleteFromSupabase(fileUrl, resourcesBucket);
    }

    @Override
    public void deleteVideo(String fileUrl) {
        deleteFromSupabase(fileUrl, resourcesBucket);
    }

    // Common upload method
    private String uploadToSupabase(MultipartFile file, String bucket, String folder) throws IOException {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            String fileName = UUID.randomUUID() + "_" + sanitizeFileName(file.getOriginalFilename());
            String fullPath = folder + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf(file.getContentType()));
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                    supabaseUrl, bucket, fullPath);

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Supabase upload failed: " + response.getBody());
            }

            return String.format("%s/storage/v1/object/public/%s/%s",
                    supabaseUrl, bucket, fullPath);
        } catch (Exception e) {
            throw new IOException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    // Common delete method
    private void deleteFromSupabase(String fileUrl, String bucket) {
        String filePath = fileUrl.replace(supabaseUrl + "/storage/v1/object/public/" + bucket + "/", "");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                supabaseUrl, bucket, filePath);

        restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                requestEntity,
                String.class
        );
    }

    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}