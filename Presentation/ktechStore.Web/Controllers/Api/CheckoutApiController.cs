using ktechStore.Application.DTOs;
using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ktechStore.Web.Controllers.Api
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutApiController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public CheckoutApiController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckoutDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _orderService.PlaceOrderAsync(dto);
            return Ok(result);
        }

        //[HttpPost("initiate")]
        //public async Task<IActionResult> Initiate([FromBody] CheckoutDto dto)
        //{
        //    if (!ModelState.IsValid) return BadRequest(ModelState);

        //    var result = await _orderService.InitiateCheckoutAsync(dto);
        //    return Ok(result);
        //}

        //[HttpPost("callback")]
        //public async Task<IActionResult> Callback()
        //{
        //    var callbackParams = Request.Form.ToDictionary(f => f.Key, f => f.Value.ToString());

        //    var success = await _orderService.ConfirmPaymentAsync(callbackParams);

        //    var redirectUrl = success
        //        ? "/checkout/success"
        //        : "/checkout/failed";

        //    return Redirect(redirectUrl);
        //}


    }
}
