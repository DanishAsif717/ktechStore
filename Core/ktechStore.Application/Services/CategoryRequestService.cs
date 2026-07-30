using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Enums;


namespace ktechStore.Application.Services
{
    public class CategoryRequestService : ICategoryRequestService
    {
        private readonly ICategoryRequestRepository _categoryRequestRepo;
        private readonly ICategoryRepository _categoryRepo;

        public CategoryRequestService(
            ICategoryRequestRepository categoryRequestRepo,
            ICategoryRepository categoryRepo)
        {
            _categoryRequestRepo = categoryRequestRepo;
            _categoryRepo = categoryRepo;
        }

        public async Task SubmitRequestAsync(CategoryRequestCreateDto dto, int vendorId)
        {
            var request = new CategoryRequest
            {
                Name = dto.Name,
                Description = dto.Description,
                RequestedByVendorId = vendorId,
                Status = CategoryRequestStatus.Pending,
                RequestedAt = DateTime.UtcNow
            };
            await _categoryRequestRepo.AddAsync(request);
        }

        public async Task<IEnumerable<CategoryRequestListDto>> GetAllAsync()
        {
            var requests = await _categoryRequestRepo.GetAllAsync();
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<CategoryRequestListDto>> GetByVendorAsync(int vendorId)
        {
            var requests = await _categoryRequestRepo.GetByVendorIdAsync(vendorId);
            return requests.Select(MapToDto);
        }

        public async Task ApproveAsync(int requestId, string reviewedBy)
        {
            var request = await _categoryRequestRepo.GetByIdAsync(requestId);
            if (request == null) throw new KeyNotFoundException("Category request not found");

            if (request.Status != CategoryRequestStatus.Pending)
                throw new InvalidOperationException("This request has already been reviewed.");

            // 🔥 Asal Category create karo
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description ?? string.Empty,
                Status = Core.Enums.CategoryStatus.Active,
                CreatedAt = DateTime.UtcNow
            };
            await _categoryRepo.AddAsync(category);

            request.Status = CategoryRequestStatus.Approved;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewedBy = reviewedBy;
            request.ApprovedCategoryId = category.Id;
            await _categoryRequestRepo.UpdateAsync(request);
        }

        public async Task RejectAsync(int requestId, string reviewedBy)
        {
            var request = await _categoryRequestRepo.GetByIdAsync(requestId);
            if (request == null) throw new KeyNotFoundException("Category request not found");

            if (request.Status != CategoryRequestStatus.Pending)
                throw new InvalidOperationException("This request has already been reviewed.");

            request.Status = CategoryRequestStatus.Rejected;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewedBy = reviewedBy;
            await _categoryRequestRepo.UpdateAsync(request);
        }

        private CategoryRequestListDto MapToDto(CategoryRequest cr)
        {
            return new CategoryRequestListDto
            {
                Id = cr.Id,
                Name = cr.Name,
                Description = cr.Description,
                Status = cr.Status.ToString(),
                RequestedByShopName = cr.RequestedByVendor?.ShopName,
                RequestedAt = cr.RequestedAt
            };
        }
    }
}
