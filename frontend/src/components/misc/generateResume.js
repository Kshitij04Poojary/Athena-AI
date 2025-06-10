import { jsPDF } from "jspdf";
import { format } from 'date-fns';

export default function generateResume(user) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = margin;

    const {
        name,
        email,
        phoneNumber,
        education,
        futureGoals,
        progress,
        internships,
        achievements,
        extracurricular,
        preferences,
        skills,
    } = user;

    doc.setFont("helvetica");

    // Header
    const headerHeight = 45;
    doc.setFillColor(41, 65, 122);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setFillColor(55, 89, 150);
    doc.rect(0, headerHeight - 5, pageWidth, 5, 'F');

    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(name, margin, headerHeight / 2 + 2);

    doc.setFontSize(10);
    doc.setTextColor(220, 220, 220);
    const contactInfo = [
        `Email: ${email}`,
        `Phone: ${phoneNumber || 'Not specified'}`,
        `Location: ${preferences?.location?.join(', ') || 'Not specified'}`
    ];
    doc.text(contactInfo, pageWidth - margin, headerHeight / 2, { align: 'right' });

    y = headerHeight + 15;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Education
    y = addSectionHeader(doc, 'Education', margin, y + 5);
    const educations = [
        {
            degree: 'Class 10',
            institution: education?.class10?.school,
            details: `${education?.class10?.percentage}% | ${education?.class10?.yearOfCompletion}`
        },
        {
            degree: 'Class 12',
            institution: education?.class12?.school,
            details: `${education?.class12?.percentage}% | ${education?.class12?.yearOfCompletion}`
        },
        {
            degree: education?.currentEducation?.course,
            institution: education?.currentEducation?.institution,
            details: `Specialization: ${education?.currentEducation?.specialization} | CGPA: ${education?.currentEducation?.cgpa} | Year: ${education?.currentEducation?.yearOfStudy}`
        }
    ];

    educations.forEach(edu => {
        if (edu.institution) {
            y = addTimelineItem(doc, edu.degree, edu.institution, edu.details, margin, y);
        }
    });

    // Skills
    if (skills?.length > 0) {
        y = addSectionHeader(doc, 'Skills', margin, y + 10);
        y = addSkillBars(doc, skills, margin, y);
    }

    // Internships
    if (internships?.length > 0) {
        y = addSectionHeader(doc, 'Internships', margin, y + 15);
        internships.forEach(intern => {
            y = checkPageBreak(doc, y);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(intern.company, margin, y);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.text(intern.duration, pageWidth - margin, y, { align: 'right' });
            y += 6;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(intern.role, margin, y);
            y += 6;
            if (intern.description) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const descLines = doc.splitTextToSize(intern.description, pageWidth - 2 * margin);
                doc.text(descLines, margin, y);
                y += descLines.length * 5 + 3;
            }
        });
    }

    // Achievements
    if (achievements?.length > 0) {
        y = addSectionHeader(doc, 'Achievements', margin, y + 10);
        y = addBulletList(doc, achievements.map(a => `${a.title} - ${a.description}`), margin, y);
    }

    // Extracurricular
    if (extracurricular?.length > 0) {
        y = addSectionHeader(doc, 'Extracurricular Activities', margin, y + 10);
        y = addBulletList(doc, extracurricular.map(e => `${e.activity} - ${e.role}`), margin, y);
    }

    // Future Goals
    if (futureGoals) {
        y = addSectionHeader(doc, 'Future Goals', margin, y + 10);
        if (futureGoals.shortTerm) {
            y = addBulletList(doc, [`Short-term: ${futureGoals.shortTerm}`], margin, y);
        }
        if (futureGoals.longTerm) {
            y = addBulletList(doc, [`Long-term: ${futureGoals.longTerm}`], margin, y);
        }
        if (futureGoals.dreamCompanies?.length > 0) {
            y = addBulletList(doc, [`Dream Companies: ${futureGoals.dreamCompanies.join(', ')}`], margin, y);
        }
    }

    // Progress
    if (progress?.length > 0) {
        y = addSectionHeader(doc, 'Progress', margin, y + 10);
        y = addBulletList(doc, progress.map(p => `${p.title}: ${p.details}`), margin, y);
    }

    // Preferences
    if (preferences?.domain || preferences?.location) {
        y = addSectionHeader(doc, 'Preferences', margin, y + 10);
        if (preferences?.domain?.length > 0) {
            y = addBulletList(doc, [`Domains: ${preferences.domain.join(', ')}`], margin, y);
        }
        if (preferences?.location?.length > 0) {
            y = addBulletList(doc, [`Preferred Locations: ${preferences.location.join(', ')}`], margin, y);
        }
    }

    // Footer
    const footerY = doc.internal.pageSize.height - 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')} • Resume powered by OdysseyAI`, pageWidth / 2, footerY, { align: 'center' });

    doc.save(`${name.replace(/\s+/g, '_')}_Resume.pdf`);
}

function addSectionHeader(doc, text, x, y) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 122);
    doc.text(text, x, y);
    return y + 5;
}

function addTimelineItem(doc, title, subtitle, details, x, y) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(title, x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, doc.internal.pageSize.width - x, y, { align: 'right' });
    if (details) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(details, x + 5, y + 7);
        return y + 15;
    }
    return y + 8;
}

function addBulletList(doc, items, x, y, maxWidth = 170) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    let currentY = y;
    items.forEach((item) => {
        doc.setFillColor(41, 65, 122);
        doc.circle(x + 2, currentY - 2, 1.2, 'F');
        const lines = doc.splitTextToSize(item, maxWidth);
        doc.text(lines, x + 7, currentY);
        currentY += lines.length * 5 + 3;
    });
    return currentY;
}

function addSkillBars(doc, skills, x, y) {
    const pageWidth = doc.internal.pageSize.width;
    const barWidth = pageWidth - (x * 2);
    const barHeight = 5;
    let currentY = y;
    skills.forEach(skill => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text(skill.name, x, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${skill.proficiency}%`, pageWidth - x, currentY, { align: 'right' });
        currentY += 5;
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(x, currentY, barWidth, barHeight, 1, 1, 'F');
        const fillWidth = (skill.proficiency / 100) * barWidth;
        doc.setFillColor(41, 65, 122);
        if (fillWidth > 0) {
            doc.roundedRect(x, currentY, fillWidth, barHeight, 1, 1, 'F');
        }
        currentY += barHeight + 8;
    });
    return currentY;
}

function checkPageBreak(doc, y, margin = 20) {
    if (y > doc.internal.pageSize.height - 50) {
        doc.addPage();
        return margin;
    }
    return y;
}
