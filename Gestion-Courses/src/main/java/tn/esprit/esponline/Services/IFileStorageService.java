package tn.esprit.esponline.Services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileStorageService {
    String uploadFile(MultipartFile file) throws IOException;

    void deleteFile(String fileUrl);

    // New resource methods
    String uploadDocument(MultipartFile file) throws IOException;
    String uploadVideo(MultipartFile file) throws IOException;
    void deleteDocument(String fileUrl);
    void deleteVideo(String fileUrl);
}
