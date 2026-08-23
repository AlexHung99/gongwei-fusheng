using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GongWei.Admin.Models;
using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.AnyManager)]
public class HomeController : Controller
{
    private readonly IAdminUiApplication _application;

    public HomeController(IAdminUiApplication application) => _application = application;

    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        return View(await _application.GetDashboardAsync(cancellationToken));
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
