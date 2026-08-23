namespace GongWei.Admin.Security;

public static class AdminPolicies
{
    public const string AuthenticationScheme = "GongWeiAdminCookie";
    public const string RoleClaim = "gongwei_admin_role";
    public const string PreviewClaim = "gongwei_preview_user";
    public const string AnyManager = "Admin.AnyManager";
    public const string ContentEditor = "Admin.ContentEditor";
    public const string CharacterReviewer = "Admin.CharacterReviewer";
    public const string SystemConfigManager = "Admin.SystemConfigManager";
    public const string Auditor = "Admin.Auditor";
}
