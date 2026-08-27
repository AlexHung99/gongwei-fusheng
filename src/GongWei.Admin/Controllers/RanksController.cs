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

    [HttpGet]
    public IActionResult Create() => View(new CreateRankInput());

    [HttpPost]
    public async Task<IActionResult> Create(CreateRankInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return View(input);

        var result = await application.CreateRankAsync(
            input, User.Identity?.Name ?? "unknown-admin", cancellationToken);
        if (!result.Success)
        {
            ModelState.AddModelError(string.Empty, result.Message);
            return View(input);
        }

        TempData["Success"] = result.Message;
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(string id, CancellationToken cancellationToken)
    {
        var rank = await application.GetRankAsync(id, cancellationToken);
        return rank is null ? NotFound() : View(rank);
    }

    [HttpPost]
    public async Task<IActionResult> Update(UpdateRankApplicationOptionInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            TempData["Error"] = "位號名稱、初始能力或異動理由格式不正確。";
            var invalidRank = await application.GetRankAsync(input.Id, cancellationToken);
            return invalidRank is null ? NotFound() : View("Edit", invalidRank);
        }

        var result = await application.UpdateRankApplicationOptionAsync(
            input, User.Identity?.Name ?? "unknown-admin", cancellationToken);
        TempData[result.Success ? "Success" : "Error"] = result.Message;
        if (result.Success) return RedirectToAction(nameof(Index));

        TempData.Remove("Error");
        ModelState.AddModelError(string.Empty, result.Message);
        var rank = await application.GetRankAsync(input.Id, cancellationToken);
        return rank is null ? NotFound() : View("Edit", rank);
    }

    [HttpPost]
    public async Task<IActionResult> Delete(DeleteRankInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            TempData["Error"] = "刪除位號必須填寫至少 3 個字的異動理由。";
            return RedirectToAction(nameof(Edit), new { id = input.Id });
        }

        var result = await application.DeleteRankAsync(
            input, User.Identity?.Name ?? "unknown-admin", cancellationToken);
        TempData[result.Success ? "Success" : "Error"] = result.Message;
        return result.Success
            ? RedirectToAction(nameof(Index))
            : RedirectToAction(nameof(Edit), new { id = input.Id });
    }
}
