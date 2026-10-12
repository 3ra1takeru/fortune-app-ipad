# PowerShell バックアップ復元（ロールバック）スクリプト
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir = Split-Path -Parent $ScriptDir

Set-Location $RepoDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     GitHub バックアップ復元ツール        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# リモートの最新情報を取得
Write-Host "GitHubから最新の履歴とバックアップタグを取得中..." -ForegroundColor Gray
git fetch origin --tags 2>$null

# 未コミットの変更があるか確認
$status = git status --porcelain
if (($status | Measure-Object).Count -gt 0) {
    Write-Host ""
    Write-Host "【警告】未コミットの編集中のファイルがあります！" -ForegroundColor Yellow
    Write-Host "復元前に現在の変更を自動バックアップして安全に退避しますか？" -ForegroundColor Yellow
    Write-Host "  [Y] はい（現在の変更をバックアップしてから復元に進む - 推奨）"
    Write-Host "  [N] いいえ（変更を破棄して復元に進む）"
    Write-Host "  [C] キャンセルして中止"
    $ans = Read-Host "選択してください (Y/N/C) [既定: Y]"
    if ($ans -eq "C" -or $ans -eq "c") {
        Write-Host "処理を中断しました。" -ForegroundColor Gray
        exit 0
    }
    if ($ans -ne "N" -and $ans -ne "n") {
        & "$ScriptDir\backup.ps1" -CustomMessage "復元前の作業自動退避"
    } else {
        git reset --hard HEAD
        git clean -fd
    }
}

# バックアップタグ一覧を取得（新しい順）
$tags = git tag -l "backup-*" --sort=-creatordate
$tagList = @($tags)

Write-Host ""
Write-Host "利用可能なバックアップ履歴:" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"

if ($tagList.Count -eq 0) {
    # タグがない場合は直近のコミット一覧を表示
    Write-Host "バックアップタグがまだ見つかりません。直近のコミット履歴を表示します:" -ForegroundColor Yellow
    $commits = git log -n 10 --pretty=format:"%h|%ad|%s" --date=format:"%Y-%m-%d %H:%M:%S"
    $commitList = @($commits)

    for ($i = 0; $i -lt $commitList.Count; $i++) {
        $parts = $commitList[$i] -split '\|'
        $hash = $parts[0]
        $date = $parts[1]
        $msg = $parts[2]
        Write-Host "  [$($i + 1)] $date ($hash) - $msg" -ForegroundColor White
    }
} else {
    $maxShow = [Math]::Min(15, $tagList.Count)
    for ($i = 0; $i -lt $maxShow; $i++) {
        $t = $tagList[$i]
        $commitInfo = git log -1 $t --pretty=format:"%ad | %s" --date=format:"%Y-%m-%d %H:%M:%S"
        Write-Host "  [$($i + 1)] $commitInfo ($t)" -ForegroundColor White
    }
}

Write-Host "------------------------------------------------------------"
Write-Host "  [M] 最新状態（masterの最新）に戻す" -ForegroundColor Green
Write-Host "  [Q] 何もせず終了" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "戻りたい番号または [M / Q] を入力してください"

if ($choice -eq "Q" -or $choice -eq "q" -or [string]::IsNullOrWhiteSpace($choice)) {
    Write-Host "終了しました。" -ForegroundColor Gray
    exit 0
}

if ($choice -eq "M" -or $choice -eq "m") {
    Write-Host "最新の master ブランチへ切り替えます..." -ForegroundColor Cyan
    git checkout master
    git pull origin master
    Write-Host "最新の状態に復帰しました！" -ForegroundColor Green
    exit 0
}

$index = [int]$choice - 1
$targetRef = ""

if ($tagList.Count -gt 0) {
    if ($index -ge 0 -and $index -lt $tagList.Count) {
        $targetRef = $tagList[$index]
    }
} else {
    if ($index -ge 0 -and $index -lt $commitList.Count) {
        $targetRef = ($commitList[$index] -split '\|')[0]
    }
}

if (-not $targetRef) {
    Write-Host "無効な番号が入力されました。" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "復元方法を選択してください:" -ForegroundColor Cyan
Write-Host "  [1] 【推奨・安全】確認用ブランチを作成して過去の状態を復元"
Write-Host "      (masterは壊れず、いつでも 'git checkout master' で最新に戻せます)"
Write-Host "  [2] 【完全巻き戻し】masterブランチそのものをこの時点まで強制ロールバック"
Write-Host "      (過去の状態を正として今後開発を続ける場合)"
$restoreMode = Read-Host "選択してください (1 または 2) [既定: 1]"

if ($restoreMode -eq "2") {
    $confirm = Read-Host "本当にmasterを巻き戻しますか？ GitHub上の最新履歴も上書きされます (yes/no)"
    if ($confirm -eq "yes") {
        # 安全のため現在の最新も念のためタグ保存
        $safetyTag = "pre-reset-" + (Get-Date -Format "yyyyMMdd-HHmmss")
        git tag -a $safetyTag -m "Safety tag before hard reset to $targetRef"
        git push origin $safetyTag 2>$null

        git checkout master
        git reset --hard $targetRef
        git push origin master --force
        Write-Host ""
        Write-Host "master を $targetRef の時点に完全ロールバックしました！" -ForegroundColor Green
        Write-Host "※リセット前の最新状態もタグ '$safetyTag' に退避してあります。" -ForegroundColor Gray
    } else {
        Write-Host "ロールバックをキャンセルしました。" -ForegroundColor Gray
    }
} else {
    $branchName = "restore-" + (Get-Date -Format "yyyyMMdd-HHmmss")
    git checkout -b $branchName $targetRef
    Write-Host ""
    Write-Host "過去のバージョン ($targetRef) に切り替えました！" -ForegroundColor Green
    Write-Host "  現在のブランチ: $branchName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "【ヒント】" -ForegroundColor Yellow
    Write-Host "・動作確認やコードの閲覧・編集が可能です。"
    Write-Host "・最新の状態に戻りたい時は、いつでも下記を実行してください:"
    Write-Host "    npm run restore (または git checkout master)" -ForegroundColor White
}

Write-Host "==========================================" -ForegroundColor Cyan
