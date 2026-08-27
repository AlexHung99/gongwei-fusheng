using System.ComponentModel.DataAnnotations;

namespace GongWei.Admin.Models;

public sealed record DashboardViewModel(
    int PendingApplications,
    int PendingPosts,
    int ActiveSceneActivities,
    int AuditEventsToday,
    IReadOnlyList<DashboardQueueItem> Queue,
    IReadOnlyList<AdminAuditRow> RecentAudit);

public sealed record DashboardQueueItem(string Kind, string Title, string Detail, string Age, string Tone);

public sealed record SceneActivitySummary(
    string Id, string Code, string LocationName, string DisplayName, string AttendantLabel,
    int MinimumApprovedWords, int OptionCount, int EnabledOptionCount, string Status, long Version);

public sealed record SceneEffectEditor(string Type, string Code, int Amount);

public sealed record SceneOptionEditor(
    string Id, string Code, string DisplayName, string ResultRevealText,
    IReadOnlyList<SceneEffectEditor> Effects, int SortOrder, bool IsEnabled, long Version);

public sealed record SceneActivityEditor(
    string Id, string Code, string LocationName, string DisplayName, string AttendantLabel,
    string IntroMarkdown, int MinimumApprovedWords, string RewardPreview, int? DailyLimit,
    string Status, long Version, IReadOnlyList<SceneOptionEditor> Options);

public sealed class UpdateSceneActivityInput
{
    [Required] public string Id { get; set; } = "";
    [Required, StringLength(100)] public string DisplayName { get; set; } = "";
    [Required, StringLength(40)] public string AttendantLabel { get; set; } = "";
    [StringLength(10_000)] public string IntroMarkdown { get; set; } = "";
    [Range(0, 100_000)] public int MinimumApprovedWords { get; set; }
    [StringLength(1_000)] public string RewardPreview { get; set; } = "";
    [Range(1, 365)] public int? DailyLimit { get; set; }
    [Required, StringLength(500, MinimumLength = 3)] public string ChangeReason { get; set; } = "";
    [Range(1, long.MaxValue)] public long Version { get; set; }
}

public sealed class SceneEffectInput
{
    [Required] public string Type { get; set; } = "stat";
    [Required] public string Code { get; set; } = "vitality";
    [Range(1, 100_000)] public int Amount { get; set; } = 1;
}

public sealed class UpdateSceneOptionInput
{
    [Required] public string ActivityId { get; set; } = "";
    [Required] public string OptionId { get; set; } = "";
    [Required, StringLength(100)] public string DisplayName { get; set; } = "";
    [Required, StringLength(500)] public string ResultRevealText { get; set; } = "";
    [MinLength(1)] public List<SceneEffectInput> Effects { get; set; } = [];
    [Range(0, 100_000)] public int SortOrder { get; set; }
    public bool IsEnabled { get; set; }
    [Required, StringLength(500, MinimumLength = 3)] public string ChangeReason { get; set; } = "";
    [Range(1, long.MaxValue)] public long Version { get; set; }
}

public sealed record CharacterApplicationRow(
    string Id, string DisplayName, string Role, string PortraitUrl, string Status,
    DateTimeOffset SubmittedAt, int Revision, string? ReviewNote);

public sealed record RankApplicationOptionRow(
    string Id, string Code, string Role, string GradeCode, string DisplayName,
    int Ordinal, long PrestigeRequired, long MonthlyStipend, long SourceAnnualStipend,
    int? Capacity, bool IsLead,
    bool IsApplicationOption, int Vitality, int Appearance, int Strategy, int Luck,
    bool IsActive, long Version);

public sealed class CreateRankInput
{
    [Required, StringLength(50), RegularExpression("^[a-z0-9][a-z0-9-]*$")]
    public string Code { get; set; } = "";
    [Required, RegularExpression("^(consort|prince|princess)$")]
    public string Role { get; set; } = "consort";
    [Required, StringLength(20)] public string GradeCode { get; set; } = "";
    [Required, StringLength(80)] public string DisplayName { get; set; } = "";
    [Range(0, int.MaxValue)] public int Ordinal { get; set; }
    [Range(0, long.MaxValue)] public long PrestigeRequired { get; set; }
    [Range(0, long.MaxValue)] public long MonthlyStipend { get; set; }
    [Range(0, long.MaxValue)] public long SourceAnnualStipend { get; set; }
    [Range(1, int.MaxValue)] public int? Capacity { get; set; }
    public bool IsLead { get; set; }
    public bool IsApplicationOption { get; set; }
    public bool IsActive { get; set; } = true;
    [Range(0, 1000)] public int Vitality { get; set; }
    [Range(0, 1000)] public int Appearance { get; set; }
    [Range(0, 1000)] public int Strategy { get; set; }
    [Range(0, 1000)] public int Luck { get; set; }
    [Required, StringLength(500, MinimumLength = 3)] public string ChangeReason { get; set; } = "";
}

public sealed class UpdateRankApplicationOptionInput
{
    [Required] public string Id { get; set; } = "";
    [Required, StringLength(20)] public string GradeCode { get; set; } = "";
    [Required, StringLength(80)] public string DisplayName { get; set; } = "";
    [Range(0, int.MaxValue)] public int Ordinal { get; set; }
    [Range(0, long.MaxValue)] public long PrestigeRequired { get; set; }
    [Range(0, long.MaxValue)] public long MonthlyStipend { get; set; }
    [Range(0, long.MaxValue)] public long SourceAnnualStipend { get; set; }
    [Range(1, int.MaxValue)] public int? Capacity { get; set; }
    public bool IsLead { get; set; }
    public bool IsApplicationOption { get; set; }
    public bool IsActive { get; set; }
    [Range(0, 1000)] public int Vitality { get; set; }
    [Range(0, 1000)] public int Appearance { get; set; }
    [Range(0, 1000)] public int Strategy { get; set; }
    [Range(0, 1000)] public int Luck { get; set; }
    [Required, StringLength(500, MinimumLength = 3)] public string ChangeReason { get; set; } = "";
    [Range(1, long.MaxValue)] public long Version { get; set; }
}

public sealed class DeleteRankInput
{
    [Required] public string Id { get; set; } = "";
    [Range(1, long.MaxValue)] public long Version { get; set; }
    [Required, StringLength(500, MinimumLength = 3)] public string ChangeReason { get; set; } = "";
}

public sealed record NpcContentRow(
    string Id, string Code, string DisplayName, string Title, string Status,
    string PortraitUrl, DateTimeOffset UpdatedAt, long Version);

public sealed record AdminAuditRow(
    long Id, DateTimeOffset OccurredAt, string Actor, string Action, string Target,
    string BeforeSummary, string AfterSummary, string Reason, string RequestId);

public sealed record GameSettingsViewModel(
    bool ReproductionOpen, int ConceptionRatePercent, int PregnancyDurationDays,
    string MiscarriageMode, bool SupportEnabled, string? SupportUrl, long Version);

public sealed record AdminOperationResult(bool Success, string Message, long? NewVersion = null);
