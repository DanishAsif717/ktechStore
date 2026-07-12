## 📁 Project Structure

This project follows the principles of **Clean Architecture**, ensuring a decoupling of core business logic from databases, UI frameworks, and external third-party integrations.

```text
ktechStore/                                  # Main Solution Root Folder
│
├── 📄 ktechStore.sln                        # Main .NET Core Enterprise Solution File
├── 📄 .gitignore                            # Root Level rules to block sharedsettings.json, node_modules, etc.
│
├── 📁 ktechStore.Core/                      # 1. Domain / Core Layer (Zero Dependencies)
│   ├── 📁 Entities/                         # Database Models (Product.cs, ProductDetail.cs, Category.cs)
│   └── 📁 Interfaces/                       # Core Repository Contracts (IProductRepository.cs)
│
├── 📁 ktechStore.Application/               # 2. Application Business Logic Layer
│   ├── 📁 DTOs/                             # Data Transfer Objects (ProductUpsertDto.cs, AiRequestDto.cs)
│   ├── 📁 Interfaces/                       # Application Services Contracts (IProductService.cs)
│   ├── 📁 Services/                         # Core Services Implementation (ProductService.cs)
│   ├── 📁 Extensions/                       # C# Extension Methods (ProductImageExtensions.cs)
│   └── 📁 Helpers/                          # Custom Mappers or Utilities
│
├── 📁 ktechStore.Infrastructure/            # 3. Infrastructure Layer (External Integrations)
│   ├── 📁 Persistence/                      # DbContext, Migrations (PostgreSQL / SQL Server)
│   ├── 📁 Repositories/                     # DB Data Handlers Implementation (ProductRepository.cs)
│   ├── 📁 ThirdParty/                       # Gateways to External Providers
│   │   ├── 📁 Mistral/                      # AI Engine Isolation (IMistralService.cs, MistralService.cs)
│   │   └── 📁 Cloudinary/                   # Image Upload Handlers (IImageService.cs)
│   └── 📄 DependencyInjection.cs            # Service Container Registrations for Infra
│
└── 📁 4. Presentation Layers/               # 🌐 Dunya ke samne khulne wale projects
    │
    ├── 📁 ktechStore.Web/                   # 🔥 Main Root Project (Serves Next.js + APIs)
    │   ├── 📁 Controllers/                  # API Controllers (Products API, Categories API)
    │   ├── 📁 Frontend/                     # Next.js Source Project (App Router, Tailwind CSS, components)
    │   ├── 📁 wwwroot/                      # Next.js Built static assets (index.html, css, js) served by .NET
    │   ├── 📄 Program.cs                    # Main Server Bootstrapper (Configures SPA/Static File Serving)
    │   ├── 📄 sharedsettings.json           # Sensitive API Configuration Keys (Local Backup Only!) ⚠️ [Git Ignored]
    │   └── 📄 appsettings.json              # Public Configurations
    │
    └── 📁 AdminPanelProject/                # 🛠️ Dedicated MVC Admin Panel
        ├── 📁 Controllers/                  # Admin Flow Controllers (ProductManagementController, etc.)
        ├── 📁 Views/                        # Blade/Razor Templates for Admin UI (Edit.cshtml, Index.cshtml)
        └── 📄 Program.cs                    # Admin Panel Bootstrapper