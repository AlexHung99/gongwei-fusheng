using GongWei.Admin.Models;
using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[Authorize(Policy = AdminPolicies.ContentEditor)]
public sealed class SceneActivitiesController(IAdminUiApplication application) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken) =>
        View(await application.GetSceneActivitiesAsync(cancellationToken));

    public async Task<IActionResult> Edit(string id, CancellationToken cancellationToken)
    {
        var model = await application.GetSceneActivityAsync(id, cancellationToken);
        return model is null ? NotFound() : View(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateActivity(UpdateSceneActivityInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return RedirectWith(false, "欄位格式不正確，請檢查後再試。", input.Id);
        var result = await application.UpdateSceneActivityAsync(input, Actor(), cancellationToken);
        return RedirectWith(result.Success, result.Message, input.Id);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateOption(UpdateSceneOptionInput input, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return RedirectWith(false, "籤的欄位或效果格式不正確。", input.ActivityId);
        var result = await application.UpdateSceneOptionAsync(input, Actor(), cancellationToken);
        return RedirectWith(result.Success, result.Message, input.ActivityId);
    }

    [HttpPost]
    public async Task<IActionResult> Publish(string id, long version, string reason, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(reason) || reason.Trim().Length < 3)
            return RedirectWith(false, "發布理由至少需要 3 個字。", id);
        var result = await application.PublishSceneActivityAsync(id, version, reason, Actor(), cancellationToken);
        return RedirectWith(result.Success, result.Message, id);
    }

    private string Actor() => User.Identity?.Name ?? "unknown-admin";

    private IActionResult RedirectWith(bool success, string message, string id)
    {
        TempData[success ? "Success" : "Error"] = message;
        return RedirectToAction(nameof(Edit), new { id });
    }
}
