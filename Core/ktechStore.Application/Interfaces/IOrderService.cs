using ktechStore.Application.DTOs;
using ktechStore.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Interfaces
{
    public interface IOrderService
    {
        Task<CheckoutResultDto> PlaceOrderAsync(CheckoutDto dto);
        Task<List<Order>> GetOrdersByVendorAsync(int vendorId);
        Task<Order?> GetVendorOrderDetailsAsync(int orderId, int vendorId);

        //Task<bool> ConfirmPaymentAsync(Dictionary<string, string> callbackParams);
    }
}
