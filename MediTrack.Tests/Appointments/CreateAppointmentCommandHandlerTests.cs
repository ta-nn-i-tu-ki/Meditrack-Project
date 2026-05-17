using MediTrack.Application.Appointments.Commands;
using MediTrack.Application.Interfaces;
using MediTrack.Domain.Entities;
using MediTrack.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Moq;
using Moq.EntityFrameworkCore;
using Xunit;

namespace MediTrack.Tests.Appointments;

public class CreateAppointmentCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly Mock<ICacheService> _cacheServiceMock;

    public CreateAppointmentCommandHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _cacheServiceMock = new Mock<ICacheService>();
    }

    [Fact]
    public async Task Handle_WithValidRequest_ShouldCreateAppointment()
    {
        // Arrange
        _contextMock.Setup(c => c.Appointments).ReturnsDbSet(new List<Appointment>());
        var handler = new CreateAppointmentCommandHandler(_contextMock.Object, _cacheServiceMock.Object);
        var command = new CreateAppointmentCommand(
            Guid.NewGuid(), 
            Guid.NewGuid(), 
            DateTime.UtcNow.Date, 
            new TimeSpan(10, 0, 0), 
            "Headache"
        );

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _contextMock.Verify(c => c.Appointments.Add(It.IsAny<Appointment>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _cacheServiceMock.Verify(c => c.RemoveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithConflict_ShouldThrowException()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var date = DateTime.UtcNow.Date;
        var startTime = new TimeSpan(10, 0, 0);

        var existingAppointments = new List<Appointment>
        {
            new Appointment
            {
                Id = Guid.NewGuid(),
                DoctorId = doctorId,
                PatientId = Guid.NewGuid(),
                AppointmentDate = date,
                StartTime = startTime,
                Status = AppointmentStatus.Confirmed
            }
        };

        _contextMock.Setup(c => c.Appointments).ReturnsDbSet(existingAppointments);
        
        var handler = new CreateAppointmentCommandHandler(_contextMock.Object, _cacheServiceMock.Object);
        var command = new CreateAppointmentCommand(Guid.NewGuid(), doctorId, date, startTime, "Fever");

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => handler.Handle(command, CancellationToken.None));
    }
}
