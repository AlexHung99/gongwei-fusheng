using GongWei.Admin.Models;
using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.SystemConfigManager)]
public sealed class RanksController(IAdminUiApplication application) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        View(await application.GetRankApplicationOptionsAsync(cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Update(UpdateRankApplicationOptionInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            TempData["Error"] = "位號名稱、初始能力或異動理由格式不正確。";
            return RedirectToAction(nameof(Index));
        }

        var result = await application.UpdateRankApplicationOptionAsync(
            input, User.Identity?.Name ?? "unknown-admin", cancellationToken);
        TempData[result.Success ? "Success" : "Error"] = result.Message;
        return RedirectToAction(nameof(Index));
    }
}
