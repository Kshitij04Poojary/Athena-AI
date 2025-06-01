import { jsPDF } from 'jspdf';

const MakeCertificate = ({ course, user, bestAssessmentScore }) => {
    const generateCertificate = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Add background color
        doc.setFillColor(240, 248, 255); // Light blue background
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Add elegant border with rounded corners
        doc.setDrawColor(65, 105, 225); // Royal blue border
        doc.setLineWidth(3);
        // Using lines to create a border with more margin space
        const margin = 15;
        doc.roundedRect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 5, 5, 'S');
        
        // Add decorative corner elements
        addCornerDecorations(doc, margin);
        
        // Add certificate title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(25, 25, 112); // Dark blue
        doc.text('Certificate of Completion', pageWidth / 2, 45, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 80, 52, pageWidth / 2 + 80, 52);
        
        // Add certificate text with better spacing
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });
        
        // Add name - limit length if needed
        const userName = user?.name || 'Student Name';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(25, 25, 112);
        doc.text(limitTextLength(userName, 40), pageWidth / 2, 85, { align: 'center' });
        
        // Add completion text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('has successfully completed the course', pageWidth / 2, 105, { align: 'center' });
        
        // Add course name - limit length if needed
        const courseName = limitTextLength(course.courseName, 50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(25, 25, 112);
        
        // Handle long course names by splitting if necessary
        if (courseName.length > 30) {
            const words = courseName.split(' ');
            let line1 = '';
            let line2 = '';
            
            let i = 0;
            while (i < words.length) {
                if ((line1 + words[i] + ' ').length <= 30) {
                    line1 += words[i] + ' ';
                } else {
                    break;
                }
                i++;
            }
            
            while (i < words.length) {
                line2 += words[i] + ' ';
                i++;
            }
            
            doc.text(line1.trim(), pageWidth / 2, 125, { align: 'center' });
            if (line2.trim()) {
                doc.text(line2.trim(), pageWidth / 2, 135, { align: 'center' });
            }
        } else {
            doc.text(courseName, pageWidth / 2, 125, { align: 'center' });
        }
        
        // Add score if available with adjusted position
        const scoreY = courseName.length > 30 ? 150 : 140;
        if (bestAssessmentScore !== null) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`with a score of ${bestAssessmentScore}%`, pageWidth / 2, scoreY, { align: 'center' });
        }
        
        // Add date
        const currentDate = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
        
        // Position date based on whether score is displayed
        const dateY = bestAssessmentScore !== null ? scoreY + 20 : scoreY + 5;
        doc.setFontSize(14);
        doc.text(`Issued on: ${formattedDate}`, pageWidth / 2, dateY, { align: 'center' });
        
        // Add signature line
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 50, pageHeight - 50, pageWidth / 2 + 50, pageHeight - 50);
        
        // Add issuer text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Issued By:', pageWidth / 2, pageHeight - 40, { align: 'center' });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(65, 105, 225);
        doc.text('AthenaAI', pageWidth / 2, pageHeight - 30, { align: 'center' });
        
        // Save the PDF with sanitized filename
        doc.save(`${sanitizeFilename(course.courseName)}_Certificate.pdf`);
    };
    
    // Helper function to limit text length
    function limitTextLength(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + '...';
    }
    
    // Helper function to sanitize filename
    function sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    
    // Function to add decorative corners
    function addCornerDecorations(doc, margin) {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const cornerSize = 10;
        
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(1);
        
        // Top-left corner
        doc.line(margin - 5, margin + cornerSize, margin - 5, margin - 5); // Vertical line
        doc.line(margin - 5, margin - 5, margin + cornerSize, margin - 5); // Horizontal line
        
        // Top-right corner
        doc.line(pageWidth - margin + 5, margin + cornerSize, pageWidth - margin + 5, margin - 5); // Vertical line
        doc.line(pageWidth - margin + 5, margin - 5, pageWidth - margin - cornerSize, margin - 5); // Horizontal line
        
        // Bottom-left corner
        doc.line(margin - 5, pageHeight - margin - cornerSize, margin - 5, pageHeight - margin + 5); // Vertical line
        doc.line(margin - 5, pageHeight - margin + 5, margin + cornerSize, pageHeight - margin + 5); // Horizontal line
        
        // Bottom-right corner
        doc.line(pageWidth - margin + 5, pageHeight - margin - cornerSize, pageWidth - margin + 5, pageHeight - margin + 5); // Vertical line
        doc.line(pageWidth - margin + 5, pageHeight - margin + 5, pageWidth - margin - cornerSize, pageHeight - margin + 5); // Horizontal line
    }

    return { generateCertificate };
};

export default MakeCertificate;