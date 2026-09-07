using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMvcFull.ViewComponents
{
  public class VendorRequestCountViewComponent
  {
    private readonly IVendorService _vendorService;
    public VendorRequestCountViewComponent(IVendorService vendorService)
    {
      _vendorService = vendorService;
    }
    public async Task<IViewComponentResult> InvokeAsync()
    {
      int count = await _vendorService.CountVendorApporvalAsync();

      return View(count);
    }

  }
}
