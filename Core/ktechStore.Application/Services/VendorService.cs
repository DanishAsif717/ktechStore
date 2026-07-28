using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Services
{
    public class VendorService : IVendorService
    {
        private readonly IVendorApplicationRepository _vendorApplicationRepo;
        private readonly IVendorRepository _vendorRepo;
        private readonly UserManager<ApplicationUser> _userManager;

        public VendorService(
            IVendorApplicationRepository vendorApplicationRepo,
            IVendorRepository vendorRepo,
            UserManager<ApplicationUser> userManager)
        {
            _vendorApplicationRepo = vendorApplicationRepo;
            _vendorRepo = vendorRepo;
            _userManager = userManager;
        }

        public async Task SubmitApplicationAsync(VendorApplicationDto dto)
        {
            var alreadyExists = await _vendorApplicationRepo.EmailExistsAsync(dto.Email);
            if (alreadyExists)
            {
                throw new InvalidOperationException("An application with this email is already pending or approved.");
            }

            var application = new VendorApplication
            {
                ShopName = dto.ShopName,
                Email = dto.Email,
                ContactPhone = dto.ContactPhone,
                BusinessDescription = dto.BusinessDescription,
                Status = Core.Enums.VendorStatus.Pending,
                AppliedAt = DateTime.UtcNow
            };

            await _vendorApplicationRepo.AddAsync(application);
        }

        public async Task<IEnumerable<VendorApplicationListDto>> GetAllApplicationsAsync()
        {
            var applications = await _vendorApplicationRepo.GetAllAsync();
            return applications.Select(a => new VendorApplicationListDto
            {
                Id = a.Id,
                ShopName = a.ShopName,
                Email = a.Email,
                ContactPhone = a.ContactPhone,
                BusinessDescription = a.BusinessDescription,
                Status = a.Status.ToString(),
                AppliedAt = a.AppliedAt
            });
        }

        public async Task<VendorApprovalResultDto> ApproveApplicationAsync(int applicationId, string reviewedBy)
        {
            var application = await _vendorApplicationRepo.GetByIdAsync(applicationId);
            if (application == null)
                throw new KeyNotFoundException("Application not found");

            if (application.Status != VendorStatus.Pending)
                throw new InvalidOperationException("This application has already been reviewed.");

            // 🔥 Random password generate karo
            var generatedPassword = GenerateRandomPassword();

            // 🔥 Identity User banao
            var user = new ApplicationUser
            {
                UserName = application.Email,
                Email = application.Email,
                FullName = application.ShopName,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user, generatedPassword);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create vendor account: {errors}");
            }

            await _userManager.AddToRoleAsync(user, "Vendor");

            // 🔥 Vendor entity banao
            var vendor = new Vendor
            {
                ApplicationUserId = user.Id,
                ShopName = application.ShopName,
                BusinessDescription = application.BusinessDescription,
                ContactPhone = application.ContactPhone,
                Status = VendorStatus.Approved,
                AppliedAt = application.AppliedAt,
                ApprovedAt = DateTime.UtcNow
            };

            await _vendorRepo.AddAsync(vendor);

            // 🔥 Application status update karo
            application.Status = VendorStatus.Approved;
            application.ReviewedAt = DateTime.UtcNow;
            application.ReviewedBy = reviewedBy;
            await _vendorApplicationRepo.UpdateAsync(application);

            return new VendorApprovalResultDto
            {
                Email = application.Email,
                GeneratedPassword = generatedPassword
            };
        }

        public async Task RejectApplicationAsync(int applicationId, string reviewedBy)
        {
            var application = await _vendorApplicationRepo.GetByIdAsync(applicationId);
            if (application == null)
                throw new KeyNotFoundException("Application not found");

            if (application.Status != VendorStatus.Pending)
                throw new InvalidOperationException("This application has already been reviewed.");

            application.Status = VendorStatus.Rejected;
            application.ReviewedAt = DateTime.UtcNow;
            application.ReviewedBy = reviewedBy;
            await _vendorApplicationRepo.UpdateAsync(application);
        }

        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
            var random = new Random();
            var password = new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            return password;
        }
    }
}
