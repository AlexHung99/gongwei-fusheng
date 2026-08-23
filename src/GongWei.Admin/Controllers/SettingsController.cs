using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.SystemConfigManager)]
public sealed class SettingsController(IAdminUiApplication application) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        View(await application.GetGameSettingsAsync(cancellationToken));
}
