    package tn.esprit.esponline.Services;

    import com.itextpdf.kernel.colors.ColorConstants;
    import com.itextpdf.kernel.pdf.PdfDocument;
    import com.itextpdf.kernel.pdf.PdfWriter;
    import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
    import com.itextpdf.layout.Document;
    import com.itextpdf.layout.element.*;
    import com.itextpdf.layout.properties.TextAlignment;
    import com.itextpdf.layout.element.Image;
    import com.itextpdf.io.image.ImageDataFactory;
    import com.itextpdf.io.image.ImageData;

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

        @Autowired
        private CourseRepository courseRepository;

        public byte[] generateCoursePdf(int courseId) throws IOException {
            Course course = courseRepository.findById((long) courseId)
                    .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Add the logo from the cloud server URL and make it bigger
            String logoUrl = "https://wbptqnvcpiorvwjotqwx.supabase.co/storage/v1/object/public/course-images//Design_sans_titre__1_-removebg-preview_enhanced.png";
            ImageData logoData = ImageDataFactory.create(logoUrl);
            Image logo = new Image(logoData);
            logo.setWidth(250)  // Adjusted width for a larger logo
                    .setHeight(125)  // Adjust the height proportionally (or you can set to null to auto-adjust based on width)
                    .setFixedPosition(30, 750); // Adjust position

            document.add(logo);

            // Add title
            Paragraph title = new Paragraph(course.getTitle())
                    .setFontSize(22)
                    .setBold()
                    .setFontColor(ColorConstants.BLUE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(60); // Add margin to move the title down a bit from the logo
            document.add(title);

            // Add course details in a styled table
            Table detailsTable = new Table(2).useAllAvailableWidth();
            addStyledTableRow(detailsTable, "Level", course.getLevel());
            addStyledTableRow(detailsTable, "Description", course.getDescription());
            addStyledTableRow(detailsTable, "Category", course.getCategoryCourse().name());
            document.add(detailsTable);

            // Add content (same as your previous content, but replace "Resources" with "Content")
            List<CourseResource> resources = course.getResources();
            if (resources != null && !resources.isEmpty()) {
                Paragraph contentHeader = new Paragraph("Content:")
                        .setFontSize(16)
                        .setBold()
                        .setFontColor(ColorConstants.DARK_GRAY)
                        .setMarginTop(10);
                document.add(contentHeader);

                Table contentTable = new Table(3).useAllAvailableWidth();
                contentTable.addHeaderCell(new Cell().setBackgroundColor(ColorConstants.LIGHT_GRAY).add(new Paragraph("Title").setBold()));
                contentTable.addHeaderCell(new Cell().setBackgroundColor(ColorConstants.LIGHT_GRAY).add(new Paragraph("Type").setBold()));
                contentTable.addHeaderCell(new Cell().setBackgroundColor(ColorConstants.LIGHT_GRAY).add(new Paragraph("Description").setBold()));

                // Table Content Styling
                for (CourseResource resource : resources) {
                    contentTable.addCell(new Cell().add(new Paragraph(resource.getTitle())));
                    contentTable.addCell(new Cell().add(new Paragraph(resource.getResourceType())));
                    contentTable.addCell(new Cell().add(new Paragraph(resource.getDescription())));
                }

                document.add(contentTable);
            }

            // Add footer with a colorful border
            SolidLine solidLine = new SolidLine();
            solidLine.setColor(ColorConstants.BLUE);
            solidLine.setLineWidth(2);

            LineSeparator lineSeparator = new LineSeparator(solidLine);
            lineSeparator.setWidth(400);
            lineSeparator.setMarginTop(10);
            document.add(lineSeparator);

            // Add footer text
            Paragraph footer = new Paragraph("Course Summary Document")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();
        }

        private void addStyledTableRow(Table table, String header, String value) {
            // Styled header row with background color
            table.addCell(new Cell().setBackgroundColor(ColorConstants.CYAN).add(new Paragraph(header).setBold()));
            table.addCell(new Cell().setPadding(8).setBackgroundColor(ColorConstants.WHITE).add(new Paragraph(value != null ? value : "N/A")));
        }
    }
