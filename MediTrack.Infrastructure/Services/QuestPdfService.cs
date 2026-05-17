using MediTrack.Application.Interfaces;
using MediTrack.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MediTrack.Infrastructure.Services;

public class QuestPdfService : IPdfService
{
    public QuestPdfService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GeneratePrescriptionPdf(MedicalRecord record)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Element(ComposeHeader);
                page.Content().Element(x => ComposeContent(x, record));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        }).GeneratePdf();
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("MediTrack Clinic").FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);
                column.Item().Text("123 Healthcare Avenue, Wellness City");
                column.Item().Text("Phone: +1 234 567 890");
            });
        });
    }

    private void ComposeContent(IContainer container, MedicalRecord record)
    {
        container.PaddingVertical(1, Unit.Centimetre).Column(column =>
        {
            column.Spacing(5);
            
            column.Item().Text("Prescription Details").FontSize(16).SemiBold();
            
            column.Item().Row(row =>
            {
                row.RelativeItem().Text($"Date: {record.CreatedAt:d}");
            });

            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
            column.Item().PaddingVertical(10);

            column.Item().Text("Diagnosis:").SemiBold();
            column.Item().Text(record.Diagnosis);
            
            column.Item().PaddingVertical(5);

            column.Item().Text("Prescription:").SemiBold();
            column.Item().Text(record.Prescription);

            column.Item().PaddingVertical(5);

            column.Item().Text("Notes:").SemiBold();
            column.Item().Text(record.Notes);
        });
    }
}
