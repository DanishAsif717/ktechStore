using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMvcFull.ViewComponents
{
  public class PendingProductsCountViewComponent : ViewComponent
  {
    private readonly IProductService _productService;

    public PendingProductsCountViewComponent(IProductService productService)
    {
      _productService = productService;
    }
    public async Task<IViewComponentResult> InvokeAsync()
    {
      int count = await _productService.CountApprovalsProductsAsync();

      return View(count);
    }

  }
}
