FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CheckApi.Api/CheckApi.Api.csproj", "CheckApi.Api/"]
COPY ["CheckApi.Infrastructure/CheckApi.Infrastructure.csproj", "CheckApi.Infrastructure/"]
COPY ["CheckApi.Domain/CheckApi.Domain.csproj", "CheckApi.Domain/"]
COPY ["CheckApi.Api/appsettings.Sample.json" , "CheckApi.Api/appsettings.json"]
RUN dotnet restore "CheckApi.Api/CheckApi.Api.csproj"

COPY . .
WORKDIR "/src/CheckApi.Api"
RUN dotnet build "CheckApi.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CheckApi.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CheckApi.Api.dll"]
