
# 🚀 ktechStore - Architecture & Routing Cheat Sheet

Yeh tumhaare project ka quick reference guide hai takay break ke baad wapis aate hi sab dimaag mein saaf ho.

---

## 📂 1. Clean Architecture Structure (Where is what?)

Humne code duplication khatam karne ke liye Services aur Repositories ko centralize kar diya hai:

*   **`ktechStore.Core`**: Entities, Models, aur Repository Interfaces (Contracts).
*   **`ktechStore.Infrastructure`**: DbContext, Migrations, aur actual Repositories implementation.
    *   📄 `DependencyInjection.cs` (Root par): Saari Data/DB services yahan register hoti hain.
*   **`ktechStore.Application`**: DTOs, Mapping logic, aur Business Services (Logic).
    *   📄 `DependencyInjection.cs` (Root par): Saari Application/Core logic services yahan register hoti hain.
*   **`Presentation Layers`** (`Admin` & `ktechStore.Web`): Dono projects bina code repeat kiye direct Core, Infra, aur Application ko call karte hain.

---

## 🔌 2. Dependency Injection (DI) Flow

Ab dono `Program.cs` files mein aik-aik line register karne ki zaroorat nahi hai. 

```text
[ktechStore.Infrastructure] ──► AddInfrastructureServices() ──┐
                                                               ├──► Call both in Admin & Web Program.cs
[ktechStore.Application]    ──► AddApplicationServices()    ──┘