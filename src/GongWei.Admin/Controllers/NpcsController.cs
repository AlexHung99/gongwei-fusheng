using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.ContentEditor)]
public sealed class NpcsController(IAdminUiApplication application) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        View(await application.GetNpcsAsync(cancellationToken));
}
