using GongWei.Admin.Models;

namespace GongWei.Admin.Services;

public interface IAdminUiApplication
{
    Task<DashboardViewModel> GetDashboardAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<SceneActivitySummary>> GetSceneActivitiesAsync(CancellationToken cancellationToken);
    Task<SceneActivityEditor?> GetSceneActivityAsync(string id, CancellationToken cancellationToken);
    Task<AdminOperationResult> UpdateSceneActivityAsync(UpdateSceneActivityInput input, string actor, CancellationToken cancellationToken);
    Task<AdminOperationResult> UpdateSceneOptionAsync(UpdateSceneOptionInput input, string actor, CancellationToken cancellationToken);
    Task<AdminOperationResult> PublishSceneActivityAsync(string id, long version, string reason, string actor, CancellationToken cancellationToken);
    Task<IReadOnlyList<CharacterApplicationRow>> GetCharacterApplicationsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<RankApplicationOptionRow>> GetRankApplicationOptionsAsync(CancellationToken cancellationToken);
    Task<AdminOperationResult> UpdateRankApplicationOptionAsync(UpdateRankApplicationOptionInput input, string actor, CancellationToken cancellationToken);
    Task<IReadOnlyList<NpcContentRow>> GetNpcsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<AdminAuditRow>> GetAuditAsync(CancellationToken cancellationToken);
    Task<GameSettingsViewModel> GetGameSettingsAsync(CancellationToken cancellationToken);
}
