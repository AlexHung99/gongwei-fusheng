using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.Auditor)]
public sealed class AuditController(IAdminUiApplication application) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        View(await application.GetAuditAsync(cancellationToken));
}
