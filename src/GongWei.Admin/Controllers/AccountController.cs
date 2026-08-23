using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GongWei.Admin.Controllers;

[AllowAnonymous]
public sealed class AccountController : Controller
{
    public IActionResult AccessDenied() => View();
}
