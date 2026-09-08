using ktechStore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMvcFull.ViewComponents
{
  public class VendorRequestCountViewComponent : ViewComponent
  {
    private readonly IVendorService _vendorService;
    public VendorRequestCountViewComponent(IVendorService vendorService)
    {
      _vendorService = vendorService;
    }
    public async Task<IViewComponentResult> InvokeAsync()
    {
      int count = await _vendorService.CountVendorApporvalAsync();

      Console.WriteLine("+++++++++++++++++++++++++++");
      Console.WriteLine($"Total Vendor Approvals Count Components: {count}");

      return View(count);
    }

  }
}
