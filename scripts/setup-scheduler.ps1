# Windows 定期自動バックアップ スケジューラ設定スクリプト
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir = Split-Path -Parent $ScriptDir
$BackupScript = "$ScriptDir\backup.ps1"
$TaskName = "FortuneApp_AutoBackup"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  GitHub 定期自動バックアップ 設定ツール  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "タスク名: $TaskName" -ForegroundColor Gray
Write-Host "実行スクリプト: $BackupScript" -ForegroundColor Gray
Write-Host ""
Write-Host "実行する操作を選択してください:" -ForegroundColor Cyan
Write-Host "  [1] 1時間ごとに自動バックアップを登録（推奨）"
Write-Host "  [2] 30分ごとに自動バックアップを登録"
Write-Host "  [3] 毎日定時（23:00）に自動バックアップを登録"
Write-Host "  [4] 定期自動バックアップを解除（停止・削除）"
Write-Host "  [5] 現在の登録状態を確認"
Write-Host "  [Q] 終了"
Write-Host ""

$choice = Read-Host "選択してください (1-5 または Q) [既定: 1]"

if ($choice -eq "Q" -or $choice -eq "q") {
    Write-Host "終了しました。" -ForegroundColor Gray
    exit 0
}

$taskRun = "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$BackupScript`""

switch ($choice) {
    "2" {
        Write-Host "30分ごとの定期バックアップを登録中..." -ForegroundColor Yellow
        schtasks.exe /create /tn $TaskName /tr $taskRun /sc minute /mo 30 /f
        Write-Host "30分ごとの自動バックアップが正常に登録されました！" -ForegroundColor Green
    }
    "3" {
        Write-Host "毎日23:00の定期バックアップを登録中..." -ForegroundColor Yellow
        schtasks.exe /create /tn $TaskName /tr $taskRun /sc daily /st 23:00 /f
        Write-Host "毎日23:00の自動バックアップが正常に登録されました！" -ForegroundColor Green
    }
    "4" {
        Write-Host "定期バックアップタスクを削除中..." -ForegroundColor Yellow
        schtasks.exe /delete /tn $TaskName /f 2>$null
        Write-Host "定期自動バックアップを解除しました。" -ForegroundColor Green
    }
    "5" {
        Write-Host "登録状態を確認中..." -ForegroundColor Yellow
        schtasks.exe /query /tn $TaskName /fo LIST 2>$null
    }
    Default {
        Write-Host "1時間ごとの定期バックアップを登録中..." -ForegroundColor Yellow
        schtasks.exe /create /tn $TaskName /tr $taskRun /sc minute /mo 60 /f
        Write-Host "1時間ごとの自動バックアップが正常に登録されました！" -ForegroundColor Green
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
