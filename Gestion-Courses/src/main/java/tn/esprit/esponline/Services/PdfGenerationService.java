package tn.esprit.esponline.Services;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.io.image.ImageDataFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.CourseResource;
import tn.esprit.esponline.DAO.repositories.CourseRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PdfGenerationService {

    // Custom color palette
    private static final Color PRIMARY_COLOR = new DeviceRgb(63, 81, 181); // Indigo
    private static final Color SECONDARY_COLOR = new DeviceRgb(233, 30, 99); // Pink
    private static final Color ACCENT_COLOR = new DeviceRgb(255, 193, 7); // Amber
    private static final Color LIGHT_BG = new DeviceRgb(250, 250, 250);
    private static final Color DARK_TEXT = new DeviceRgb(33, 33, 33);
    private static final Color LIGHT_TEXT = new DeviceRgb(117, 117, 117);

    @Autowired
    private CourseRepository courseRepository;

    public byte[] generateCoursePdf(int courseId) throws IOException {
        Course course = courseRepository.findById((long) courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Set document margins
        document.setMargins(40, 40, 60, 40);

        // Add header with logo and title
        addDocumentHeader(document, course);

        // Add course details section
        addCourseDetailsSection(document, course);

        // Add course content section
        addCourseContentSection(document, course);

        // Add footer
        addDocumentFooter(document);

        document.close();
        return outputStream.toByteArray();
    }

    private void addDocumentHeader(Document document, Course course) {
        // Title with modern styling
        Paragraph title = new Paragraph(course.getTitle())
                .setFontSize(24)
                .setBold()
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20)
                .setMarginBottom(30);
        document.add(title);

        // Divider line
        addDivider(document, PRIMARY_COLOR, 1.5f);
    }

    private void addCourseDetailsSection(Document document, Course course) {
        // Section header
        Paragraph sectionHeader = new Paragraph("Course Details")
                .setFontSize(18)
                .setBold()
                .setFontColor(SECONDARY_COLOR)
                .setMarginTop(15)
                .setMarginBottom(10);
        document.add(sectionHeader);

        // Details table with modern styling
        Table detailsTable = new Table(2).useAllAvailableWidth();

        // Table header style
        Cell headerCell = new Cell()
                .setBackgroundColor(PRIMARY_COLOR)
                .setFontColor(new DeviceRgb(255, 255, 255))
                .setPadding(8)
                .setTextAlignment(TextAlignment.LEFT);

        // Table content style
        Cell contentCell = new Cell()
                .setBackgroundColor(LIGHT_BG)
                .setFontColor(DARK_TEXT)
                .setPadding(8);

        addStyledTableRow(detailsTable, "Level", course.getLevel(), headerCell, contentCell);
        addStyledTableRow(detailsTable, "Description", course.getDescription(), headerCell, contentCell);
        addStyledTableRow(detailsTable, "Category", course.getCategoryCourse().name(), headerCell, contentCell);

        document.add(detailsTable);
        document.add(new Paragraph("\n")); // Add some space after the table
    }

    private void addCourseContentSection(Document document, Course course) {
        List<CourseResource> resources = course.getResources();
        if (resources == null || resources.isEmpty()) {
            return;
        }

        // Section header
        Paragraph contentHeader = new Paragraph("Course Content")
                .setFontSize(18)
                .setBold()
                .setFontColor(SECONDARY_COLOR)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(contentHeader);

        // Content table with modern styling
        Table contentTable = new Table(3).useAllAvailableWidth();

        // Header style
        Cell headerCell = new Cell()
                .setBackgroundColor(SECONDARY_COLOR)
                .setFontColor(new DeviceRgb(255, 255, 255))
                .setPadding(8)
                .setTextAlignment(TextAlignment.CENTER);

        // Content style
        Cell contentCell = new Cell()
                .setBackgroundColor(LIGHT_BG)
                .setFontColor(DARK_TEXT)
                .setPadding(6)
                .setTextAlignment(TextAlignment.LEFT);

        // Add headers
        contentTable.addHeaderCell(headerCell.clone(false).add(new Paragraph("Title")));
        contentTable.addHeaderCell(headerCell.clone(false).add(new Paragraph("Type")));
        contentTable.addHeaderCell(headerCell.clone(false).add(new Paragraph("Description")));

        // Add content rows with alternating colors
        boolean alternate = false;
        for (CourseResource resource : resources) {
            Color rowColor = alternate ? new DeviceRgb(245, 245, 245) : new DeviceRgb(255, 255, 255);

            contentTable.addCell(contentCell.clone(false)
                    .setBackgroundColor(rowColor)
                    .add(new Paragraph(resource.getTitle())));

            contentTable.addCell(contentCell.clone(false)
                    .setBackgroundColor(rowColor)
                    .add(new Paragraph(resource.getResourceType())));

            contentTable.addCell(contentCell.clone(false)
                    .setBackgroundColor(rowColor)
                    .add(new Paragraph(resource.getDescription())));

            alternate = !alternate;
        }

        document.add(contentTable);
    }

    private void addDocumentFooter(Document document) {
        // Add space before footer
        document.add(new Paragraph("\n\n"));

        // Divider line
        addDivider(document, LIGHT_TEXT, 0.5f);

        // Footer text
        Paragraph footer = new Paragraph("© " + java.time.Year.now().getValue() + " ESPRIT Online Learning Platform")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10)
                .setFontColor(LIGHT_TEXT)
                .setMarginTop(5);
        document.add(footer);
    }

    private void addDivider(Document document, Color color, float width) {
        SolidLine line = new SolidLine();
        line.setColor(color);
        line.setLineWidth(width);
        document.add(new LineSeparator(line).setMarginTop(10).setMarginBottom(10));
    }

    private void addStyledTableRow(Table table, String header, String value, Cell headerStyle, Cell contentStyle) {
        table.addCell(headerStyle.clone(false).add(new Paragraph(header)));
        table.addCell(contentStyle.clone(false).add(new Paragraph(value != null ? value : "N/A")));
    }
}