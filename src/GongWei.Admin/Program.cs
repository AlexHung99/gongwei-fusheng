using System.Security.Claims;
using GongWei.Admin.Security;
using GongWei.Admin.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddAuthentication(AdminPolicies.AuthenticationScheme)
    .AddCookie(AdminPolicies.AuthenticationScheme, options =>
    {
        options.Cookie.Name = "gw_admin_session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.Path = "/";
        options.LoginPath = "/Account/AccessDenied";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.SlidingExpiration = false;
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AdminPolicies.AnyManager, policy => policy.RequireClaim(AdminPolicies.RoleClaim));
    options.AddPolicy(AdminPolicies.ContentEditor, policy => policy.RequireClaim(AdminPolicies.RoleClaim,
        "content_editor", "game_master", "super_admin"));
    options.AddPolicy(AdminPolicies.CharacterReviewer, policy => policy.RequireClaim(AdminPolicies.RoleClaim,
        "character_reviewer", "game_master", "super_admin"));
    options.AddPolicy(AdminPolicies.SystemConfigManager, policy => policy.RequireClaim(AdminPolicies.RoleClaim,
        "system_config_manager", "game_master", "super_admin"));
    options.AddPolicy(AdminPolicies.Auditor, policy => policy.RequireClaim(AdminPolicies.RoleClaim,
        "auditor", "game_master", "super_admin"));
});

builder.Services.AddControllersWithViews(options =>
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));

// The backend repository replaces this preview adapter with an adapter that
// invokes GongWei.Application use cases directly. Production Admin must not call
// GongWei.Api over HTTP.
builder.Services.AddSingleton<IAdminUiApplication, PreviewAdminUiApplication>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();

var previewUserEnabled = app.Environment.IsDevelopment()
    && app.Configuration.GetValue<bool>("AdminUi:EnablePreviewUser");

if (previewUserEnabled)
{
    app.Use(async (context, next) =>
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "development-preview"),
                new Claim(ClaimTypes.Name, "Max・開發預覽"),
                new Claim(AdminPolicies.RoleClaim, "super_admin"),
                new Claim(AdminPolicies.PreviewClaim, "true")
            };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(
                claims, AdminPolicies.AuthenticationScheme, ClaimTypes.Name, AdminPolicies.RoleClaim));
        }
        await next();
    });
}

app.UseAuthorization();
app.MapStaticAssets();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();

public partial class Program;
