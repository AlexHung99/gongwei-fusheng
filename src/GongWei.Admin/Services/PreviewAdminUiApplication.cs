using GongWei.Admin.Models;

namespace GongWei.Admin.Services;

/// <summary>
/// Development-only specimen data for rendering and interaction review. The
/// production backend must replace this registration with GongWei.Application
/// queries/commands; preview mutations are memory-only and never authoritative.
/// </summary>
public sealed class PreviewAdminUiApplication : IAdminUiApplication
{
    private readonly object _sync = new();
    private readonly List<SceneActivityEditor> _activities = CreateActivities();
    private readonly List<AdminAuditRow> _audit =
    [
        new(18342, DateTimeOffset.Now.AddMinutes(-18), "服主・Max", "scene.option.update", "太醫院／千澈",
            "體質 +4", "體質 +5", "依最新場景籤規則校正", "req_8C2F"),
        new(18341, DateTimeOffset.Now.AddHours(-1), "掌事・顧和", "character.application.approve", "沈知微",
            "submitted", "approved", "人設與立繪審核通過", "req_73AD"),
        new(18340, DateTimeOffset.Now.AddHours(-3), "司庫・林月", "economy.adjust", "蘇明徽",
            "銀兩 1,540", "銀兩 1,840", "事件 E-102 漏發補償", "req_65B1")
    ];
    private long _nextAuditId = 18343;

    public Task<DashboardViewModel> GetDashboardAsync(CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            return Task.FromResult(new DashboardViewModel(
                PendingApplications: 8,
                PendingPosts: 4,
                ActiveSceneActivities: _activities.Count(x => x.Status == "published"),
                AuditEventsToday: _audit.Count(x => x.OccurredAt.Date == DateTimeOffset.Now.Date),
                Queue:
                [
                    new("角色審核", "沈知微・嬪妃申請", "人設與玩家立繪等待覆核", "12 分鐘前", "rose"),
                    new("事件投稿", "奉天樓・春祭祈福", "共 6 篇戲文等待審核", "31 分鐘前", "jade"),
                    new("場景籤", "太醫院設定已更新", "請確認 9 支大夫籤皆為啟用", "1 小時前", "gold")
                ],
                RecentAudit: _audit.OrderByDescending(x => x.OccurredAt).Take(5).ToArray()));
        }
    }

    public Task<IReadOnlyList<SceneActivitySummary>> GetSceneActivitiesAsync(CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            IReadOnlyList<SceneActivitySummary> result = _activities.Select(x => new SceneActivitySummary(
                x.Id, x.Code, x.LocationName, x.DisplayName, x.AttendantLabel,
                x.MinimumApprovedWords, x.Options.Count, x.Options.Count(o => o.IsEnabled), x.Status, x.Version)).ToArray();
            return Task.FromResult(result);
        }
    }

    public Task<SceneActivityEditor?> GetSceneActivityAsync(string id, CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            return Task.FromResult(_activities.FirstOrDefault(x => x.Id == id));
        }
    }

    public Task<AdminOperationResult> UpdateSceneActivityAsync(UpdateSceneActivityInput input, string actor, CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            var index = _activities.FindIndex(x => x.Id == input.Id);
            if (index < 0) return Task.FromResult(new AdminOperationResult(false, "找不到場景活動。"));
            var current = _activities[index];
            if (current.Version != input.Version) return Task.FromResult(new AdminOperationResult(false, "版本已更新，請重新載入後再編輯。"));

            var updated = current with
            {
                DisplayName = input.DisplayName.Trim(),
                AttendantLabel = input.AttendantLabel.Trim(),
                IntroMarkdown = input.IntroMarkdown.Trim(),
                MinimumApprovedWords = input.MinimumApprovedWords,
                RewardPreview = input.RewardPreview.Trim(),
                DailyLimit = input.DailyLimit,
                Version = current.Version + 1
            };
            _activities[index] = updated;
            AddAudit(actor, "scene.activity.update", current.DisplayName,
                $"v{current.Version}", $"v{updated.Version}", input.ChangeReason);
            return Task.FromResult(new AdminOperationResult(true, "場景設定草稿已儲存。", updated.Version));
        }
    }

    public Task<AdminOperationResult> UpdateSceneOptionAsync(UpdateSceneOptionInput input, string actor, CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            var activityIndex = _activities.FindIndex(x => x.Id == input.ActivityId);
            if (activityIndex < 0) return Task.FromResult(new AdminOperationResult(false, "找不到場景活動。"));
            var activity = _activities[activityIndex];
            var optionIndex = activity.Options.ToList().FindIndex(x => x.Id == input.OptionId);
            if (optionIndex < 0) return Task.FromResult(new AdminOperationResult(false, "找不到指定籤。"));
            var options = activity.Options.ToList();
            var current = options[optionIndex];
            if (current.Version != input.Version) return Task.FromResult(new AdminOperationResult(false, "籤的版本已更新，請重新載入。"));
            if (input.Effects.Count == 0) return Task.FromResult(new AdminOperationResult(false, "至少需要一個能力或道具效果。"));

            var updated = current with
            {
                DisplayName = input.DisplayName.Trim(),
                ResultRevealText = input.ResultRevealText.Trim(),
                Effects = input.Effects.Select(x => new SceneEffectEditor(x.Type, x.Code, x.Amount)).ToArray(),
                SortOrder = input.SortOrder,
                IsEnabled = input.IsEnabled,
                Version = current.Version + 1
            };
            options[optionIndex] = updated;
            _activities[activityIndex] = activity with { Options = options, Version = activity.Version + 1 };
            AddAudit(actor, "scene.option.update", $"{activity.DisplayName}／{current.DisplayName}",
                current.ResultRevealText, updated.ResultRevealText, input.ChangeReason);
            return Task.FromResult(new AdminOperationResult(true, $"「{updated.DisplayName}」的隱藏效果已儲存。", updated.Version));
        }
    }

    public Task<AdminOperationResult> PublishSceneActivityAsync(string id, long version, string reason, string actor, CancellationToken cancellationToken)
    {
        lock (_sync)
        {
            var index = _activities.FindIndex(x => x.Id == id);
            if (index < 0) return Task.FromResult(new AdminOperationResult(false, "找不到場景活動。"));
            var current = _activities[index];
            if (current.Version != version) return Task.FromResult(new AdminOperationResult(false, "版本衝突，請重新載入。"));
            if (current.Options.All(x => !x.IsEnabled)) return Task.FromResult(new AdminOperationResult(false, "至少要啟用一支籤才能發布。"));
            var updated = current with { Status = "published", Version = current.Version + 1 };
            _activities[index] = updated;
            AddAudit(actor, "scene.activity.publish", current.DisplayName, current.Status, "published", reason);
            return Task.FromResult(new AdminOperationResult(true, "場景籤設定已發布。", updated.Version));
        }
    }

    public Task<IReadOnlyList<CharacterApplicationRow>> GetCharacterApplicationsAsync(CancellationToken cancellationToken)
        => Task.FromResult<IReadOnlyList<CharacterApplicationRow>>(
        [
            new("A-0214", "蕭景珩", "皇子・待生", "/images/portrait-prince.svg", "submitted", DateTimeOffset.Now.AddMinutes(-12), 2, null),
            new("A-0213", "林照月", "嬪妃・良女", "/images/portrait-consort.svg", "under_review", DateTimeOffset.Now.AddMinutes(-38), 3, null),
            new("A-0212", "蕭令儀", "帝姬・待生", "/images/portrait-princess.svg", "needs_revision", DateTimeOffset.Now.AddHours(-1), 4, "性格欄位尚未達最低字數")
        ]);

    public Task<IReadOnlyList<NpcContentRow>> GetNpcsAsync(CancellationToken cancellationToken)
        => Task.FromResult<IReadOnlyList<NpcContentRow>>(
        [
            new("npc-01", "lan-ronghua", "陸馥錦", "嵐容華", "published", "/images/npc-lan.svg", DateTimeOffset.Now.AddDays(-1), 4),
            new("npc-02", "li-liangren", "黎栖璇", "黎良人", "published", "/images/npc-li.svg", DateTimeOffset.Now.AddDays(-2), 3),
            new("npc-03", "jinhui-taifei", "君疏鳶", "瑾惠太妃", "review", "/images/npc-jun.svg", DateTimeOffset.Now.AddHours(-3), 6)
        ]);

    public Task<IReadOnlyList<AdminAuditRow>> GetAuditAsync(CancellationToken cancellationToken)
    {
        lock (_sync) return Task.FromResult<IReadOnlyList<AdminAuditRow>>(_audit.OrderByDescending(x => x.OccurredAt).ToArray());
    }

    public Task<GameSettingsViewModel> GetGameSettingsAsync(CancellationToken cancellationToken)
        => Task.FromResult(new GameSettingsViewModel(true, 100, 10, "event_only", true,
            "https://buymeacoffee.com/", 8));

    private void AddAudit(string actor, string action, string target, string before, string after, string reason)
        => _audit.Add(new AdminAuditRow(_nextAuditId++, DateTimeOffset.Now, actor, action, target,
            before, after, reason.Trim(), $"preview_{Guid.NewGuid():N}"[..17]));

    private static List<SceneActivityEditor> CreateActivities() =>
    [
        Activity("taiyi-doctors", "taiyi-doctors", "太醫院", "太醫院", "大夫", 0,
            "太醫院諸位大夫今日當值，請小主指定一支大夫籤；效果將在抽籤完成後揭示。", "",
            O("qianche", "千澈", "體質 +5 點", 10, S("vitality", 5)), O("jingyan", "景衍", "體質 +3 點", 20, S("vitality", 3)),
            O("yunchuan", "云川", "體質 +7 點", 30, S("vitality", 7)), O("qingchen", "卿塵", "體質 +6 點", 40, S("vitality", 6)),
            O("yingxi", "應析", "體質 +2 點", 50, S("vitality", 2)), O("huaishu", "淮書", "體質 +3 點", 60, S("vitality", 3)),
            O("yancheng", "硯城", "體質 +1 點", 70, S("vitality", 1)), O("yiyun", "逸云", "體質 +2 點", 80, S("vitality", 2)),
            O("jinglan", "景欄", "體質 +4 點", 90, S("vitality", 4))),
        Activity("yueshu-teachers", "yueshu-teachers", "閱書院", "閱書院", "先生", 0,
            "閱書院今日開講，請小主指定一支先生籤；效果將在抽籤完成後揭示。", "",
            O("qinghe", "清河", "心計 +2 點", 10, S("strategy", 2)), O("xiyun", "溪云", "心計 +5 點", 20, S("strategy", 5)),
            O("yanzhi", "宴之", "心計 +2 點", 30, S("strategy", 2)), O("jingzhi", "景之", "心計 +6 點", 40, S("strategy", 6)),
            O("ange", "安歌", "心計 +2 點", 50, S("strategy", 2)), O("yuming", "逾明", "心計 +1 點", 60, S("strategy", 1)),
            O("huaijin", "懷暻", "心計 +3 點", 70, S("strategy", 3)), O("yicheng", "奕丞", "心計 +2 點", 80, S("strategy", 2)),
            O("junqi", "君迄", "心計 +5 點", 90, S("strategy", 5)), O("yunjian", "云澗", "心計 +3 點", 100, S("strategy", 3))),
        Activity("fengtian-immortals", "fengtian-immortals", "奉天樓", "奉天樓", "仙者", 0,
            "奉天樓香煙繚繞，請小主指定一支仙者籤；祝福能力與數值將在抽籤完成後揭示。", "",
            O("jiangzhiyu", "江梔予", "福氣 +2 點", 10, S("luck", 2)), O("shenjingan", "沈鏡安", "福氣 +4 點", 20, S("luck", 4)),
            O("chifuying", "池扶盈", "福氣 +1 點", 30, S("luck", 1)), O("chengshiqing", "程時清", "福氣 +7 點", 40, S("luck", 7)),
            O("yuwandi", "虞綰笛", "福氣 +5 點", 50, S("luck", 5)), O("chuzhenxi", "楚枕溪", "福氣 +3 點", 60, S("luck", 3)),
            O("heliyang", "何黎漾", "福氣 +5 點", 70, S("luck", 5)), O("fuzeling", "傅則靈", "福氣 +3 點", 80, S("luck", 3)),
            O("quzhining", "曲知寧", "福氣 +2 點", 90, S("luck", 2)), O("jingyiluo", "景亦絡", "福氣 +2 點", 100, S("luck", 2))),
        Activity("taiye-draw", "taiye-draw", "觀仙台・太液池", "太液池", "宮女", 100,
            "抽籤前請記得繳交自戲，主系統通過才可指定籤。", "優惠券或威望增加 50～100。",
            O("gongxi", "貢溪", "威望 +70", 10, S("prestige", 70)),
            O("yuwu", "諭霧", "優惠券 ×1、威望 +50", 20, I("coupon", 1), S("prestige", 50)),
            O("lanying", "藍英", "威望 +80", 30, S("prestige", 80)), O("jiamu", "嘉穆", "威望 +100", 40, S("prestige", 100)),
            O("liuhua", "流華", "威望 +80", 50, S("prestige", 80))),
        Activity("yuhua-draw", "yuhua-draw", "觀仙台・御花園", "御花園", "籤使", 300,
            "抽籤前請記得繳交自戲，主系統通過才可指定籤。", "體質／容貌增加 1～5 點，或威望增加 100～300。",
            O("yaocao", "瑤草", "體質 +3 點、容貌 +3 點", 10, S("vitality", 3), S("appearance", 3)),
            O("suiwan", "歲晚", "威望 +250", 20, S("prestige", 250)), O("wenyu", "聞語", "體質 +5 點", 30, S("vitality", 5)),
            O("siyao", "思遙", "威望 +300", 40, S("prestige", 300)), O("yechu", "葉初", "容貌 +5 點", 50, S("appearance", 5))),
        Activity("shanglin-draw", "shanglin-draw", "觀仙台・上林苑", "上林苑", "籤使", 500,
            "抽籤前請記得繳交自戲，主系統通過才可指定籤。", "四項能力增加 1～8 點，或威望增加 150～450。",
            O("yujin", "渝矜", "心計 +4、容貌 +4、威望 +200", 10, S("strategy", 4), S("appearance", 4), S("prestige", 200)),
            O("yixian", "意弦", "體質 +5、福氣 +5、威望 +200", 20, S("vitality", 5), S("luck", 5), S("prestige", 200)),
            O("yanqi", "言柒", "四項能力各 +6", 30, S("vitality", 6), S("appearance", 6), S("luck", 6), S("strategy", 6)),
            O("gantang", "甘棠", "威望 +400、體質 +5、心計 +5", 40, S("prestige", 400), S("vitality", 5), S("strategy", 5)),
            O("mujin", "穆瑾", "威望 +300、容貌 +5、福氣 +5", 50, S("prestige", 300), S("appearance", 5), S("luck", 5)))
    ];

    private static SceneActivityEditor Activity(string id, string code, string location, string name, string label,
        int words, string intro, string preview, params SceneOptionEditor[] options)
        => new(id, code, location, name, label, intro, words, preview, null, "published", 1, options);

    private static SceneOptionEditor O(string code, string name, string reveal, int sort, params SceneEffectEditor[] effects)
        => new(code, code, name, reveal, effects, sort, true, 1);

    private static SceneEffectEditor S(string code, int amount) => new("stat", code, amount);
    private static SceneEffectEditor I(string code, int amount) => new("inventory", code, amount);
}
