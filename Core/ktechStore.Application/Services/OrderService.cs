using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using ktechStore.Core.Entities;
using ktechStore.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderGroupRepository _orderGroupRepo;
        private readonly IProductRepository _productRepo;
        private readonly IOrderRepository _orderRepo;
        //private readonly IJazzCashService _jazzCashService;

        public OrderService(
            IOrderGroupRepository orderGroupRepo,
            IProductRepository productRepo,
            IOrderRepository orderRepo)

            //IJazzCashService jazzCashService)
        {
            _orderGroupRepo = orderGroupRepo;
            _productRepo = productRepo;
            _orderRepo = orderRepo;
            //_jazzCashService = jazzCashService;
        }
        public async Task<CheckoutResultDto> PlaceOrderAsync(CheckoutDto dto)
        {
            var orderGroup = new OrderGroup
            {
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                CustomerPhone = dto.CustomerPhone,
                ShippingAddress = dto.ShippingAddress,
        
                PaymentStatus = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            decimal grandTotal = 0;

            var vendorGroups = new Dictionary<int?, List<(Product product, int qty)>>();

            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);

                if (product == null) continue;

                if (!vendorGroups.ContainsKey(product.VendorId))
                    vendorGroups[product.VendorId] = new List<(Product, int)>();

                vendorGroups[product.VendorId].Add((product, item.Quantity));
            }

            foreach (var group in vendorGroups)
            {
                var order = new Order
                {
                    VendorId = group.Key,
                    Status = OrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                decimal orderSubTotal = 0;

                foreach (var (product, qty) in group.Value)
                {
                    Console.WriteLine($"  Product: {product.Name}, ProductId: {product.Id}, Qty: {qty}");

                    var lineTotal = product.Price * qty;
                    orderSubTotal += lineTotal;

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        UnitPrice = product.Price,
                        Quantity = qty,
                        LineTotal = lineTotal
                    });
                }

                order.SubTotal = orderSubTotal;
                grandTotal += orderSubTotal;
                orderGroup.Orders.Add(order);
            }

            orderGroup.TotalAmount = grandTotal;

            await _orderGroupRepo.AddAsync(orderGroup);

            return new CheckoutResultDto
            {
                OrderGroupId = orderGroup.Id,
                Message = "Order placed successfully. Pay on delivery."
            };
        }
        public async Task<CheckoutResultDto> InitiateCheckoutAsync(CheckoutDto dto)
        {
            var orderGroup = new OrderGroup
            {
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                CustomerPhone = dto.CustomerPhone,
                ShippingAddress = dto.ShippingAddress,
                PaymentStatus = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            decimal grandTotal = 0;

            // 🔥 Cart items ko Vendor-wise group karo (splitting logic)
            var vendorGroups = new Dictionary<int?, List<(Product product, int qty)>>();

            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product == null) continue;

                if (!vendorGroups.ContainsKey(product.VendorId))
                    vendorGroups[product.VendorId] = new List<(Product, int)>();

                vendorGroups[product.VendorId].Add((product, item.Quantity));
            }

            foreach (var group in vendorGroups)
            {
                var order = new Order
                {
                    VendorId = group.Key,
                    Status = OrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                decimal orderSubTotal = 0;

                foreach (var (product, qty) in group.Value)
                {
                    var lineTotal = product.Price * qty;
                    orderSubTotal += lineTotal;

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        UnitPrice = product.Price,
                        Quantity = qty,
                        LineTotal = lineTotal
                    });
                }

                order.SubTotal = orderSubTotal;
                grandTotal += orderSubTotal;
                orderGroup.Orders.Add(order);
            }

            orderGroup.TotalAmount = grandTotal;

            await _orderGroupRepo.AddAsync(orderGroup);

            // 🔥 JazzCash payment request banao
            //var formFields = _jazzCashService.BuildPaymentRequest(orderGroup.Id, grandTotal, dto.CustomerPhone);

            return new CheckoutResultDto
            {
                OrderGroupId = orderGroup.Id,
                Message = "Order placed successfully. Pay on delivery."
                //JazzCashPostUrl = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform",
                //FormFields = formFields
            };
        }

        public async Task<bool> ConfirmPaymentAsync(Dictionary<string, string> callbackParams)
        {
            //if (!_jazzCashService.VerifyResponseHash(callbackParams))
            //    return false;

            if (!callbackParams.TryGetValue("pp_BillReference", out var billRef))
                return false;

            var orderGroupId = int.Parse(billRef.Replace("OrderGroup", ""));
            var orderGroup = await _orderGroupRepo.GetByIdAsync(orderGroupId);
            if (orderGroup == null) return false;

            var responseCode = callbackParams.GetValueOrDefault("pp_ResponseCode");

            if (responseCode == "000") 
            {
                orderGroup.PaymentStatus = PaymentStatus.Paid;
                orderGroup.StripePaymentIntentId = callbackParams.GetValueOrDefault("pp_TxnRefNo");

                foreach (var order in orderGroup.Orders)
                {
                    order.Status = OrderStatus.Processing;
                }
            }
            else
            {
                orderGroup.PaymentStatus = PaymentStatus.Failed;
            }

            await _orderGroupRepo.UpdateAsync(orderGroup);
            return responseCode == "000";
        }
        public async Task<List<Order>> GetOrdersByVendorAsync(int vendorId)
        {
            return await _orderRepo.GetOrdersByVendorAsync(vendorId);
        }
    }
}
