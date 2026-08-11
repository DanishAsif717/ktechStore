using ktechStore.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Interfaces
{
    public interface IOrderService
    {
        Task<CheckoutResultDto> PlaceOrderAsync(CheckoutDto dto);
        //Task<bool> ConfirmPaymentAsync(Dictionary<string, string> callbackParams);
    }
}
