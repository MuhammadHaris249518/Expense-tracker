from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
import datetime
import re

def parse_markdown(text):
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    text = text.replace("- ", "• ")
    return text

def generate_pdf(summary, insights, filename="report.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle', parent=styles['Heading1'], fontName='Helvetica-Bold',
        fontSize=24, textColor=colors.HexColor("#2C3E50"), alignment=TA_CENTER, spaceAfter=10
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading', parent=styles['Heading2'], fontName='Helvetica-Bold',
        fontSize=16, textColor=colors.HexColor("#34495E"), spaceBefore=20, spaceAfter=15,
        borderPadding=10
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal', parent=styles['Normal'], fontName='Helvetica',
        fontSize=11, textColor=colors.HexColor("#333333"), leading=16, alignment=TA_JUSTIFY,
    )

    date_style = ParagraphStyle(
        'DateStyle', parent=styles['Normal'], fontName='Helvetica-Oblique',
        fontSize=10, textColor=colors.gray, alignment=TA_CENTER, spaceAfter=30
    )
    
    content = []
    
    # Title
    content.append(Paragraph("Financial Summary Report", title_style))
    current_date = datetime.datetime.now().strftime("%B %d, %Y")
    content.append(Paragraph(f"Generated on {current_date}", date_style))
    
    # Summary Table
    content.append(Paragraph("Account Overview", heading_style))
    
    try:
        inc = float(summary.get('income', 0))
        exp = float(summary.get('expense', 0))
        bal = float(summary.get('balance', 0))
        table_data = [
            ['Metric', 'Amount'],
            ['Total Income', f"${inc:,.2f}"],
            ['Total Expenses', f"${exp:,.2f}"],
            ['Net Balance', f"${bal:,.2f}"]
        ]
    except:
        table_data = [
            ['Metric', 'Amount'],
            ['Total Income', str(summary.get('income', 0))],
            ['Total Expenses', str(summary.get('expense', 0))],
            ['Net Balance', str(summary.get('balance', 0))]
        ]

    summary_table = Table(table_data, colWidths=[220, 180])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2980B9")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#F8F9F9")),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('GRID', (0, 0), (-1, -1), 1, colors.white),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, -1), (-1, -1), 2, colors.HexColor("#2980B9")) # Accent line at bottom
    ]))
    
    content.append(summary_table)
    content.append(Spacer(1, 20))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey, spaceBefore=10, spaceAfter=20))
    
    # AI Insights
    content.append(Paragraph("AI Financial Insights", heading_style))
    
    if isinstance(insights, str):
        paragraphs = insights.split('\n')
        for p in paragraphs:
            p_clean = p.strip()
            if p_clean:
                parsed_text = parse_markdown(p_clean)
                content.append(Paragraph(parsed_text, normal_style))
                content.append(Spacer(1, 8))
    else:
        content.append(Paragraph(str(insights), normal_style))
        
    doc.build(content)
    return filename
