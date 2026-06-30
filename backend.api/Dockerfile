FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["backend.api.csproj", "."]
RUN dotnet restore --no-cache
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
# Tell .NET GC to be conservative with heap size — important on Render's 512 MB free tier
ENV DOTNET_GCConserveMemory=9
ENV DOTNET_GCHeapHardLimit=400000000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.api.dll"]
