# PowerShell Git 自動バックアップスクリプト
param (
    [string]$CustomMessage = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir = Split-Path -Parent $ScriptDir

Set-Location $RepoDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  GitHub 自動バックアップを開始します...   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 未コミットの変更があるかチェック
$status = git status --porcelain
$hasUncommittedChanges = ($status | Measure-Object).Count -gt 0

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$tagTimestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tagName = "backup-$tagTimestamp"

if ($hasUncommittedChanges) {
    Write-Host "[1/3] 変更されたファイルをステージング中..." -ForegroundColor Yellow
    git add -A

    $commitMsg = if ($CustomMessage) {
        "backup: $timestamp - $CustomMessage"
    } else {
        "backup: $timestamp (自動バックアップ)"
    }

    Write-Host "[2/3] コミットを作成中: $commitMsg" -ForegroundColor Yellow
    git commit -m $commitMsg

    Write-Host "[3/3] 復元用タグを作成中: $tagName" -ForegroundColor Yellow
    git tag -a $tagName -m "Backup created at $timestamp"
} else {
    Write-Host "ローカルファイルの変更はありません。" -ForegroundColor Gray
}

# 未プッシュのコミットまたはタグがあるかチェック
$unpushed = git log origin/master..HEAD --oneline 2>$null
if ($unpushed -or $hasUncommittedChanges) {
    Write-Host "GitHub (origin master) へプッシュ中..." -ForegroundColor Cyan
    try {
        git push origin master --tags
        Write-Host ""
        Write-Host "バックアップが正常にGitHubに保存されました！" -ForegroundColor Green
        if ($hasUncommittedChanges) {
            Write-Host "  コミット日時: $timestamp" -ForegroundColor Green
            Write-Host "  復元用タグ:   $tagName" -ForegroundColor Green
        }
    } catch {
        Write-Host "GitHubへのプッシュ中にエラーが発生しました: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "すでに最新の状態がGitHubに保存されています。バックアップ不要です。" -ForegroundColor Green
}

Write-Host "==========================================" -ForegroundColor Cyan
