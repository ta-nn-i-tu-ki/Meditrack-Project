FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MediTrack.WebAPI/MediTrack.WebAPI.csproj", "MediTrack.WebAPI/"]
COPY ["MediTrack.Application/MediTrack.Application.csproj", "MediTrack.Application/"]
COPY ["MediTrack.Domain/MediTrack.Domain.csproj", "MediTrack.Domain/"]
COPY ["MediTrack.Infrastructure/MediTrack.Infrastructure.csproj", "MediTrack.Infrastructure/"]
RUN dotnet restore "MediTrack.WebAPI/MediTrack.WebAPI.csproj"
COPY . .
WORKDIR "/src/MediTrack.WebAPI"
RUN dotnet build "MediTrack.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MediTrack.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MediTrack.WebAPI.dll"]
