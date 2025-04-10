package tn.esprit.esponline.Services;

import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.CourseResource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ZipService {

    @Autowired
    private CourseService courseService;

    private String supabaseUrl = "https://wbptqnvcpiorvwjotqwx.supabase.co";

    public byte[] createCourseResourcesZip(int courseId) throws IOException {
        Course course = courseService.getCourseById(courseId);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
            // Add each resource to ZIP
            for (CourseResource resource : course.getResources()) {
                addResourceToZip(zipOut, resource);
            }
        }
        return baos.toByteArray();
    }

    private void addResourceToZip(ZipOutputStream zipOut, CourseResource resource) throws IOException {
        // Download document if exists
        if (resource.getLink_doccument() != null) {
            addUrlToZip(zipOut, resource.getLink_doccument(), "documents/" + resource.getTitle() + ".pdf");
        }

        // Download video if exists
        if (resource.getLink_video() != null) {
            addUrlToZip(zipOut, resource.getLink_video(), "videos/" + resource.getTitle() + ".mp4");
        }
    }

    private void addUrlToZip(ZipOutputStream zipOut, String fileUrl, String entryName) throws IOException {
        URL url = new URL(fileUrl);
        try (InputStream in = url.openStream()) {
            ZipEntry zipEntry = new ZipEntry(entryName);
            zipOut.putNextEntry(zipEntry);

            byte[] buffer = new byte[1024];
            int len;
            while ((len = in.read(buffer)) > 0) {
                zipOut.write(buffer, 0, len);
            }
            zipOut.closeEntry();
        }
    }
}
