using MediTrack.Application.Documents.Models;
using MediTrack.Application.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MediTrack.Infrastructure.Services;

public class PdfGeneratorService : IPdfGeneratorService
{
    public PdfGeneratorService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GenerateAppointmentLetter(AppointmentPdfRequest request)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                page.Header().Element(ComposeHeader);
                page.Content().Element(x => ComposeAppointmentContent(x, request));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    public byte[] GeneratePrescription(PrescriptionPdfRequest request)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                page.Header().Element(ComposeHeader);
                page.Content().Element(x => ComposePrescriptionContent(x, request));
                page.Footer().Element(ComposePrescriptionFooter);
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("MediTrack Clinic").FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);
                column.Item().Text("123 Health Ave, Wellness City");
                column.Item().Text("Email: support@meditrack.com | Phone: +1 800 123 4567");
            });
        });
    }

    private void ComposeAppointmentContent(IContainer container, AppointmentPdfRequest request)
    {
        container.PaddingVertical(1, Unit.Centimetre).Column(column =>
        {
            column.Spacing(20);

            column.Item().Text("Appointment Confirmation Letter").FontSize(16).SemiBold().AlignCenter();

            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(120);
                    columns.RelativeColumn();
                });

                table.Cell().Text("Reference Number:");
                table.Cell().Text(request.ReferenceNumber).SemiBold();

                table.Cell().Text("Patient Name:");
                table.Cell().Text(request.PatientName).SemiBold();

                table.Cell().Text("Doctor:");
                table.Cell().Text($"Dr. {request.DoctorName}");

                table.Cell().Text("Department:");
                table.Cell().Text(request.Department);

                table.Cell().Text("Date & Time:");
                table.Cell().Text(request.AppointmentDate.ToString("f"));
            });

            column.Item().PaddingTop(20).Text("Please arrive 15 minutes before your scheduled appointment time. Bring any relevant medical records or ID.");
        });
    }

    private void ComposePrescriptionContent(IContainer container, PrescriptionPdfRequest request)
    {
        container.PaddingVertical(1, Unit.Centimetre).Column(column =>
        {
            column.Spacing(15);

            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Patient: {request.PatientName}").SemiBold();
                    col.Item().Text($"Age: {request.Age}");
                });
                row.RelativeItem().AlignRight().Column(col =>
                {
                    col.Item().Text($"Date: {request.Date:d}");
                    col.Item().Text($"Dr. {request.DoctorName}").SemiBold();
                });
            });

            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Vitals").FontSize(12).SemiBold();
                    col.Item().Text($"Blood Pressure: {request.BloodPressure}");
                    col.Item().Text($"Heart Rate: {request.HeartRate}");
                });
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Symptoms").FontSize(12).SemiBold();
                    col.Item().Text(request.Symptoms);
                });
            });

            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

            column.Item().Text("Rx").FontSize(18).SemiBold().Italic();

            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3);
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(2);
                });

                table.Header(header =>
                {
                    header.Cell().Text("Medicine").SemiBold();
                    header.Cell().Text("Dosage").SemiBold();
                    header.Cell().Text("Duration").SemiBold();
                });

                foreach (var med in request.Medicines)
                {
                    table.Cell().PaddingVertical(2).Text(med.Name);
                    table.Cell().PaddingVertical(2).Text(med.Dosage);
                    table.Cell().PaddingVertical(2).Text(med.Duration);
                }
            });

            if (!string.IsNullOrWhiteSpace(request.Notes))
            {
                column.Item().PaddingTop(10).Text("Notes/Advice:").SemiBold();
                column.Item().Text(request.Notes);
            }
        });
    }

    private void ComposePrescriptionFooter(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
            column.Item().PaddingTop(5).Text("DISCLAIMER: This is a provisional/AI-assisted prescription for reference purposes. Please consult a physical doctor before taking any medication.").FontSize(9).FontColor(Colors.Red.Medium).Italic().AlignCenter();
            column.Item().AlignCenter().Text(x =>
            {
                x.Span("Page ");
                x.CurrentPageNumber();
                x.Span(" of ");
                x.TotalPages();
            });
        });
    }
}
