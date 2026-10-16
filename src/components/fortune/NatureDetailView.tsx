"use client";

import React, { useState } from 'react';
import { 
  FortuneResult, 
  NineStarNatureDetail, 
  FourPillarsNatureDetail, 
  ReisuiNatureDetail, 
  OverallNatureDetail,
  YearFlowDetail,
  AgePeriodLifeStage
} from '@/lib/fortune';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Sparkles, Compass, BookOpen, Heart, Briefcase, ShieldAlert, 
  Lightbulb, Coins, Users, Activity, Clock, CheckCircle2, 
  AlertCircle, Calendar, MapPin, Flame, Droplets, Trees, Sun, 
  Award, ArrowRight, Star, UserCheck, MessageCircle, Info
} from 'lucide-react';

interface NatureDetailViewProps {
  result: FortuneResult;
  method: 'overall' | 'fourPillars' | 'nineStar' | 'reisui';
  isCompatibilityMode?: boolean;
}

export function NatureDetailView({ result, method, isCompatibilityMode = false }: NatureDetailViewProps) {
  const { overall, fourPillars, nineStar, reisui } = result.nature;

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {method === 'nineStar' && <NineStarSection detail={nineStar} />}
      {method === 'fourPillars' && <FourPillarsSection detail={fourPillars} />}
      {method === 'reisui' && <ReisuiSection detail={reisui} />}
      {method === 'overall' && (
        <OverallSection 
          overall={overall} 
          nineStar={nineStar} 
          fourPillars={fourPillars} 
          reisui={reisui} 
        />
      )}
    </div>
  );
}

// ============================================================================
// 1. 九星気学セクション
// ============================================================================
function NineStarSection({ detail }: { detail: NineStarNatureDetail }) {
  const [selectedYearTab, setSelectedYearTab] = useState<'2025' | '2026' | '2027'>('2026');

  const currentYearFlow: YearFlowDetail = 
    selectedYearTab === '2025' ? detail.yearFlows.lastYear :
    selectedYearTab === '2026' ? detail.yearFlows.thisYear :
    detail.yearFlows.nextYear;

  return (
    <div className="space-y-3">
      {/* 命式ヘッダーカード */}
      <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-white border border-amber-100/70">
        <CardHeader className="pb-3 sm:pb-4 pt-5 sm:pt-6 px-4 sm:px-6 md:px-8 border-b border-amber-100/50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-700/80 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 九星気学・先天命盤
            </span>
            <span className="text-[11px] sm:text-xs text-amber-600 bg-amber-100/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
              本命・月命・日命・傾斜
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-light text-zinc-800 mt-2" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            星回りの本質と潜在能力
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs sm:text-sm">
            あなたの人生を導く4つの星と、天から授かった資質
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5">
          {/* 4つの星バナー */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 mb-0.5 sm:mb-1 tracking-wider">本命星（年）</span>
              <span className="text-[11px] sm:text-xs text-zinc-400 mb-1 sm:mb-1.5">社会性・基本性格</span>
              <span className="text-base sm:text-lg md:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.honmeiStar}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 mb-0.5 sm:mb-1 tracking-wider">月命星（月）</span>
              <span className="text-[11px] sm:text-xs text-zinc-400 mb-1 sm:mb-1.5">精神性・内面の気質</span>
              <span className="text-base sm:text-lg md:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.getsumeiStar}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 mb-0.5 sm:mb-1 tracking-wider">日命星（日）</span>
              <span className="text-[11px] sm:text-xs text-zinc-400 mb-1 sm:mb-1.5">日常行動・とっさの反応</span>
              <span className="text-base sm:text-lg md:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.nichimeiStar}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/60 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 mb-0.5 sm:mb-1 tracking-wider">傾斜宮</span>
              <span className="text-[11px] sm:text-xs text-zinc-400 mb-1 sm:mb-1.5">潜在能力・裏の才能</span>
              <span className="text-base sm:text-lg md:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.keisha}
              </span>
            </div>
          </div>

          {/* 傾斜宮の潜在能力 */}
          <div className="bg-amber-100/40 border border-amber-200/70 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-800 block mb-1">
                【傾斜宮が示す隠れた才能】{detail.keisha}
              </span>
              <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
                {detail.keishaMeaning}。普段はあまり表に出ませんが、いざという決断時や人生の岐路において、あなたを救う最大の突破力となります。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 性格・長所・短所・癖カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> 性格の本質と長所
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
              {detail.personality}
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-500 block mb-2">天から授かった長所</span>
              <div className="flex flex-wrap gap-2">
                {detail.strengths.map((str, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {str}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" /> 気を付ける点と「無意識の癖」
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="bg-rose-50/40 border border-rose-100 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <span className="font-bold text-rose-700 block mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 気を付けるべき点
              </span>
              {detail.cautions}
            </div>

            <div>
              <span className="text-xs font-semibold text-orange-700 block mb-1">【無意識の癖・思考パターン】</span>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {detail.habits}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-zinc-500 block mb-1">陥りやすい弱点</span>
              <div className="flex flex-wrap gap-1.5">
                {detail.weaknesses.map((w, idx) => (
                  <span key={idx} className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-md">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 適職・コミュニケーション・相性カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-blue-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-blue-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-500" /> 向いてる仕事（適職）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.suitableJobs.map((job, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {job}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.suitableJobDetail}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-emerald-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-emerald-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-500" /> コミュニケーションの取り方
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
              {detail.communication}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-rose-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-rose-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" /> 相性の良い相手（星）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.goodAffinity.map((star, idx) => (
                <span key={idx} className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {star}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.affinityDetail}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 去年・今年・来年の年盤からの詳細な流れ */}
      <YearFlowSection 
        selectedYearTab={selectedYearTab}
        setSelectedYearTab={setSelectedYearTab}
        flow={currentYearFlow}
        astrologyTitle="九星気学の年盤運勢"
      />

      {/* 〇才〜〇才の人生サイクル */}
      <LifeStagesSection stages={detail.lifeStages} astrologyName="九星気学" />
    </div>
  );
}

// ============================================================================
// 2. 四柱推命セクション
// ============================================================================
function FourPillarsSection({ detail }: { detail: FourPillarsNatureDetail }) {
  const [selectedYearTab, setSelectedYearTab] = useState<'2025' | '2026' | '2027'>('2026');

  const currentYearFlow: YearFlowDetail = 
    selectedYearTab === '2025' ? detail.yearFlows.lastYear :
    selectedYearTab === '2026' ? detail.yearFlows.thisYear :
    detail.yearFlows.nextYear;

  return (
    <div className="space-y-3">
      {/* 命式ヘッダーカード */}
      <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50/70 via-indigo-50/30 to-white border border-purple-100/70">
        <CardHeader className="pb-3 sm:pb-4 pt-5 sm:pt-6 px-4 sm:px-6 md:px-8 border-b border-purple-100/50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-purple-700/80 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 四柱推命・宿命鑑定
            </span>
            <span className="text-[11px] sm:text-xs text-purple-600 bg-purple-100/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
              日干・通変星・十二運
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-light text-zinc-800 mt-2" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            魂の本質と命式の骨格
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs sm:text-sm">
            自然界のエネルギーと十干十二支が織りなす宿命
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5">
          {/* 三柱表示 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center bg-white/80 backdrop-blur-sm p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs">
            <div className="flex justify-around w-full max-w-md">
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] text-zinc-400 mb-1 sm:mb-2 tracking-wider sm:tracking-widest font-semibold">年柱（ルーツ）</span>
                <span className="text-2xl sm:text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                  {detail.pillars.year}
                </span>
              </div>
              <div className="w-[1px] bg-purple-100 mx-1.5 sm:mx-2"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] text-zinc-400 mb-1 sm:mb-2 tracking-wider sm:tracking-widest font-semibold">月柱（社会性）</span>
                <span className="text-2xl sm:text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                  {detail.pillars.month}
                </span>
              </div>
              <div className="w-[1px] bg-purple-100 mx-1.5 sm:mx-2"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] text-purple-600 mb-1 sm:mb-2 tracking-wider sm:tracking-widest font-semibold">日柱（魂の核）</span>
                <span className="text-2xl sm:text-3xl text-purple-900 font-normal" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                  {detail.pillars.day}
                </span>
              </div>
            </div>
          </div>

          {/* 日干・中心星・十二運星 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-purple-100/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-200/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 block mb-0.5 sm:mb-1">日干（魂の核）</span>
              <span className="text-lg sm:text-xl font-bold text-purple-900 block">{detail.dayStem}（{detail.dayStemNature}）</span>
              <span className="text-xs text-purple-600 mt-0.5 sm:mt-1 block font-medium">{detail.dayStemElement}</span>
            </div>

            <div className="bg-purple-100/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-200/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 block mb-0.5 sm:mb-1">中心星（主星・通変星）</span>
              <span className="text-lg sm:text-xl font-bold text-purple-900 block">{detail.centerStar}</span>
              <span className="text-xs text-purple-600 mt-0.5 sm:mt-1 block font-medium">一生の仕事と生き様を司る星</span>
            </div>

            <div className="bg-purple-100/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-200/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 block mb-0.5 sm:mb-1">十二運（四柱推命）</span>
              <span className="text-lg sm:text-xl font-bold text-purple-900 block">{detail.twelveFate}</span>
              <span className="text-xs text-purple-600 mt-0.5 sm:mt-1 block font-medium">行動力と人生の推進力</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 性格・長所・短所・癖 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> 性格と本質
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {detail.personality}
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-500 block mb-2">四柱推命が示す最大の長所</span>
              <div className="flex flex-wrap gap-2">
                {detail.strengths.map((str, idx) => (
                  <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-500" /> {str}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-500" /> 気を付ける点・癖
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="bg-purple-50/50 border border-purple-100 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <span className="font-bold text-purple-800 block mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-purple-600" /> 人生における留意点
              </span>
              {detail.cautions}
            </div>

            <div>
              <span className="text-xs font-semibold text-purple-800 block mb-1">【思考と行動の癖】</span>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {detail.habits}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-zinc-500 block mb-1">注意すべき傾向</span>
              <div className="flex flex-wrap gap-1.5">
                {detail.weaknesses.map((w, idx) => (
                  <span key={idx} className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-md">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 適職・コミュニケーション・相性 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-indigo-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-indigo-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-500" /> 適職とビジネス才能
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.suitableJobs.map((job, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {job}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.suitableJobDetail}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-purple-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-purple-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-purple-500" /> 対人関係とコミュニケーション
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
              {detail.communication}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-pink-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-pink-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500" /> 相性の良い干支・タイプ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.goodAffinity.map((star, idx) => (
                <span key={idx} className="bg-pink-50 text-pink-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {star}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.affinityDetail}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 流年（2025、2026、2027年） */}
      <YearFlowSection 
        selectedYearTab={selectedYearTab}
        setSelectedYearTab={setSelectedYearTab}
        flow={currentYearFlow}
        astrologyTitle="四柱推命の流年運勢"
      />

      {/* 大運・年代別人生ドラマ */}
      <LifeStagesSection stages={detail.lifeStages} astrologyName="四柱推命・大運" />
    </div>
  );
}

// ============================================================================
// 3. 令翠学セクション
// ============================================================================
function ReisuiSection({ detail }: { detail: ReisuiNatureDetail }) {
  const [selectedYearTab, setSelectedYearTab] = useState<'2025' | '2026' | '2027'>('2026');

  const currentYearFlow: YearFlowDetail = 
    selectedYearTab === '2025' ? detail.yearFlows.lastYear :
    selectedYearTab === '2026' ? detail.yearFlows.thisYear :
    detail.yearFlows.nextYear;

  return (
    <div className="space-y-3">
      {/* 宿星ヘッダー */}
      <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50/70 via-emerald-50/30 to-white border border-teal-100/70">
        <CardHeader className="pb-3 sm:pb-4 pt-5 sm:pt-6 px-4 sm:px-6 md:px-8 border-b border-teal-100/50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-teal-700/80 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 運命分析学・令翠学
            </span>
            <span className="text-[11px] sm:text-xs text-teal-600 bg-teal-100/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
              六令星・十二宿星・運命周期
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-light text-zinc-800 mt-2" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            十二宿星の本質と運命周期
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs sm:text-sm">
            生まれ持った本質を表す宿星と、人生の四季を巡る十二の時期
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-teal-200/60 shadow-xs text-center">
              <span className="text-[10px] sm:text-xs font-semibold text-teal-600 block mb-0.5 sm:mb-1">あなたの宿星（十二宿星）</span>
              <span className="text-xl sm:text-2xl font-bold text-teal-900 block" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.star}
              </span>
              <span className="text-[11px] sm:text-xs text-teal-600 mt-0.5 sm:mt-1 block">{detail.yinYang}</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-teal-200/60 shadow-xs text-center">
              <span className="text-[10px] sm:text-xs font-semibold text-teal-600 block mb-0.5 sm:mb-1">本質の源（六令星）</span>
              <span className="text-xl sm:text-2xl font-bold text-teal-900 block" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                {detail.reiStar || '六令星'}
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 block">対を成す宿星：{detail.subStar}</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-teal-200/60 shadow-xs text-center">
              <span className="text-[10px] sm:text-xs font-semibold text-teal-600 block mb-0.5 sm:mb-1">現在の運命周期</span>
              <span className="text-base sm:text-lg font-bold text-teal-900 block mt-0.5 sm:mt-1">
                {detail.yearFlows.thisYear.starOrStage.replace('令翠学運命周期：', '').replace(/【|】/g, '') || '好調期'}
              </span>
              <span className="text-[11px] sm:text-xs text-teal-600 mt-0.5 sm:mt-1 block">人生の四季のリズム</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 性格・長所・短所・癖 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" /> 宿星の本質と長所
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {detail.personality}
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-500 block mb-2">際立った才能と強み</span>
              <div className="flex flex-wrap gap-2">
                {detail.strengths.map((str, idx) => (
                  <span key={idx} className="bg-teal-50 text-teal-700 border border-teal-100 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-500" /> {str}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-zinc-50/60 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-zinc-100">
            <CardTitle className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-500" /> 気を付ける点と癖
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="bg-teal-50/50 border border-teal-100 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <span className="font-bold text-teal-800 block mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-teal-600" /> 開運の留意点
              </span>
              {detail.cautions}
            </div>

            <div>
              <span className="text-xs font-semibold text-teal-800 block mb-1">【無意識の癖・行動パターン】</span>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {detail.habits}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-zinc-500 block mb-1">注意すべき傾向</span>
              <div className="flex flex-wrap gap-1.5">
                {detail.weaknesses.map((w, idx) => (
                  <span key={idx} className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-md">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 適職・対人・相性 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-teal-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-teal-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-teal-600" /> 適職と才能の活かし方
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.suitableJobs.map((job, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {job}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.suitableJobDetail}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-teal-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-teal-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-teal-600" /> コミュニケーションの極意
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
              {detail.communication}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
          <CardHeader className="bg-teal-50/40 pb-2.5 sm:pb-3 pt-4 sm:pt-5 px-4 sm:px-6 border-b border-teal-100/50">
            <CardTitle className="text-xs sm:text-sm font-medium text-zinc-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-teal-600" /> 相性の良い相手
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {detail.goodAffinity.map((star, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  {star}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {detail.affinityDetail}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* バイオリズム（2025、2026、2027年） */}
      <YearFlowSection 
        selectedYearTab={selectedYearTab}
        setSelectedYearTab={setSelectedYearTab}
        flow={currentYearFlow}
        astrologyTitle="令翠学の年運バイオリズム"
      />

      {/* 年代別サイクル */}
      <LifeStagesSection stages={detail.lifeStages} astrologyName="令翠学" />
    </div>
  );
}

// ============================================================================
// 4. 総合セクション（共通点を強調した統合鑑定書）
// ============================================================================
function OverallSection({ 
  overall, 
  nineStar, 
  fourPillars, 
  reisui 
}: { 
  overall: OverallNatureDetail; 
  nineStar: NineStarNatureDetail; 
  fourPillars: FourPillarsNatureDetail; 
  reisui: ReisuiNatureDetail; 
}) {
  const [selectedYearTab, setSelectedYearTab] = useState<'2025' | '2026' | '2027'>('2026');

  const currentYearFlow: YearFlowDetail = 
    selectedYearTab === '2025' ? overall.yearFlows.lastYear :
    selectedYearTab === '2026' ? overall.yearFlows.thisYear :
    overall.yearFlows.nextYear;

  return (
    <div className="space-y-3">
      {/* 統合鑑定書ヘッダー */}
      <Card className="border-0 shadow-md rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/80 via-rose-50/30 to-white border border-amber-200/80">
        <CardHeader className="pb-3 sm:pb-4 pt-5 sm:pt-7 px-4 sm:px-8 md:px-10 border-b border-amber-100/60 bg-amber-50/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-800 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" /> プロ鑑定士 総合統合鑑定書
            </span>
            <span className="text-[11px] sm:text-xs text-amber-700 bg-amber-200/50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
              四柱推命 × 九星気学 × 令翠学
            </span>
          </div>
          <CardTitle className="text-lg sm:text-2xl md:text-3xl font-light text-zinc-800 mt-2 tracking-wide" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            3大占術が一致して示す「真のあなた」
          </CardTitle>
          <CardDescription className="text-amber-800/80 text-xs sm:text-sm font-medium mt-1">
            人生の根本テーマ: {overall.lifeTheme}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-7 md:p-10 space-y-5 sm:space-y-8">
          {/* 3つの占術の要約バナー */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 block mb-0.5 sm:mb-1">四柱推命</span>
              <span className="text-sm sm:text-base font-bold text-zinc-800 block">日干：{fourPillars.dayStem}（{fourPillars.dayStemNature}）</span>
              <span className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 block">中心星：{fourPillars.centerStar} / {fourPillars.twelveFate}</span>
            </div>

            <div className="bg-white/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 block mb-0.5 sm:mb-1">九星気学</span>
              <span className="text-sm sm:text-base font-bold text-zinc-800 block">本命：{nineStar.honmeiStar}</span>
              <span className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 block">月命：{nineStar.getsumeiStar} / {nineStar.keisha}</span>
            </div>

            <div className="bg-white/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 block mb-0.5 sm:mb-1">令翠学</span>
              <span className="text-sm sm:text-base font-bold text-zinc-800 block">宿星：{reisui.star}</span>
              <span className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 block">六令星：{reisui.reiStar || '令星'}（{reisui.yinYang}）</span>
            </div>
          </div>

          {/* 3占術共通の真の強み */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-zinc-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              各種占術が口を揃えて強調する「天性の強み」
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {overall.coreStrengths.map((str, idx) => (
                <div key={idx} className="bg-white/90 border border-emerald-100/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                    {str}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 共通して警告される落とし穴・癖 */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-zinc-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              各種占術が共通して警告する「無意識の落とし穴・癖」
            </h3>
            <div className="space-y-2 sm:space-y-2.5">
              {overall.commonPitfalls.map((pit, idx) => (
                <div key={idx} className="bg-rose-50/50 border border-rose-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-zinc-700 leading-relaxed flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{pit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* プロ鑑定士からの真心の総合メッセージ */}
          <div className="bg-gradient-to-br from-amber-100/40 via-orange-50/30 to-amber-50/60 border border-amber-200/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
              <h4 className="text-xs sm:text-sm font-bold text-amber-900 tracking-wide">
                プロ鑑定士による対面総括メッセージ
              </h4>
            </div>
            <p className="text-zinc-700 text-xs sm:text-sm md:text-[15px] leading-relaxed sm:leading-loose whitespace-pre-line">
              {overall.synthesisAdvice}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3占術統合の年運（2025、2026、2027年） */}
      <YearFlowSection 
        selectedYearTab={selectedYearTab}
        setSelectedYearTab={setSelectedYearTab}
        flow={currentYearFlow}
        astrologyTitle="3大占術統合・総合年運の流れ"
      />

      {/* 総合・年代別人生サイクル */}
      <LifeStagesSection stages={overall.lifeStages} astrologyName="総合鑑定" />
    </div>
  );
}

// ============================================================================
// 共通サブコンポーネント: 年盤・年運の流れ（2025、2026、2027年）
// ============================================================================
function YearFlowSection({
  selectedYearTab,
  setSelectedYearTab,
  flow,
  astrologyTitle
}: {
  selectedYearTab: '2025' | '2026' | '2027';
  setSelectedYearTab: (y: '2025' | '2026' | '2027') => void;
  flow: YearFlowDetail;
  astrologyTitle: string;
}) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
      <CardHeader className="bg-zinc-50/70 pb-3 sm:pb-4 pt-5 sm:pt-6 px-4 sm:px-6 md:px-8 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 tracking-wider uppercase block mb-0.5 sm:mb-1">
              {astrologyTitle}
            </span>
            <CardTitle className="text-base sm:text-lg md:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
              去年・今年・来年の運気の流れと各分野の展開
            </CardTitle>
          </div>

          {/* 年切替ボタン（2025、2026、2027） */}
          <div className="flex bg-zinc-200/60 p-1 rounded-xl sm:rounded-2xl w-full sm:w-auto self-start">
            {[
              { id: '2025', label: '2025年 (去年)', shortLabel: '2025年' },
              { id: '2026', label: '2026年 (今年)', shortLabel: '2026年' },
              { id: '2027', label: '2027年 (来年)', shortLabel: '2027年' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedYearTab(tab.id as any)}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all ${
                  selectedYearTab === tab.id 
                    ? 'bg-zinc-900 text-white shadow-xs' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        {/* 今年のテーマ・スコアバナー */}
        <div className="bg-gradient-to-r from-zinc-50 to-amber-50/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {flow.label}
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">
                {flow.starOrStage}
              </span>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-bold text-zinc-800">
              {flow.theme}
            </h4>
          </div>

          <div className="flex items-baseline gap-1.5 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-zinc-200/60 shrink-0">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">年運スコア</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-600">{flow.score}</span>
            <span className="text-[11px] sm:text-xs text-zinc-400">点</span>
          </div>
        </div>

        {/* 5大分野（仕事、恋愛、健康、家族、お金）の詳細グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {/* 仕事 */}
          <div className="bg-blue-50/30 border border-blue-100/60 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> 仕事・キャリア・事業
            </span>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
              {flow.work}
            </p>
          </div>

          {/* 恋愛・パートナー */}
          <div className="bg-rose-50/30 border border-rose-100/60 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> 恋愛・結婚・パートナーシップ
            </span>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
              {flow.romance}
            </p>
          </div>

          {/* 健康 */}
          <div className="bg-emerald-50/30 border border-emerald-100/60 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> 健康・メンタル・休養
            </span>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
              {flow.health}
            </p>
          </div>

          {/* 家族 */}
          <div className="bg-amber-50/30 border border-amber-100/60 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 家族・親族・家庭環境
            </span>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
              {flow.family}
            </p>
          </div>

          {/* お金 */}
          <div className="bg-yellow-50/30 border border-yellow-100/60 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-yellow-800 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" /> お金・資産・金運
            </span>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
              {flow.money}
            </p>
          </div>
        </div>

        {/* 開運アドバイス */}
        <div className="bg-zinc-900 text-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-300 block mb-1">
              【{flow.label} の開運指針】
            </span>
            <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
              {flow.keyAdvice}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 共通サブコンポーネント: 〇才〜〇才の人生サイクル（年代別タイムライン）
// ============================================================================
function LifeStagesSection({ stages, astrologyName }: { stages: AgePeriodLifeStage[]; astrologyName: string }) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-zinc-100">
      <CardHeader className="bg-zinc-50/70 pb-3 sm:pb-4 pt-5 sm:pt-6 px-4 sm:px-6 md:px-8 border-b border-zinc-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] sm:text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" /> 年代別ライフサイクル
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 bg-zinc-200/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
            過去の答え合わせと未来の道標
          </span>
        </div>
        <CardTitle className="text-base sm:text-lg md:text-xl font-medium text-zinc-800 mt-1" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
          〇才〜〇才の人生（{astrologyName}で紐解く生涯のドラマ）
        </CardTitle>
        <CardDescription className="text-zinc-500 text-xs sm:text-sm">
          あなたのこれまでの軌跡と、これから訪れる最高の黄金期を照らし合わせます
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          {stages.map((stage, idx) => {
            const isCurrent = stage.timingType === 'current';
            const isPast = stage.timingType === 'past';

            return (
              <div 
                key={idx}
                className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'bg-amber-50/60 border-amber-200/80 ring-2 ring-amber-400/20 shadow-xs' 
                    : isPast
                    ? 'bg-zinc-50/40 border-zinc-100'
                    : 'bg-white border-zinc-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                      isCurrent 
                        ? 'bg-amber-500 text-white shadow-2xs' 
                        : isPast
                        ? 'bg-zinc-200 text-zinc-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {stage.ageRange}
                    </span>
                    <h4 className="text-xs sm:text-sm md:text-base font-bold text-zinc-800">
                      {stage.stageTitle}
                    </h4>
                  </div>

                  <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md self-start sm:self-auto ${
                    isCurrent 
                      ? 'bg-amber-100 text-amber-800' 
                      : isPast
                      ? 'bg-zinc-100 text-zinc-500'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {isCurrent ? '★ 現在のステージ（現在地）' : isPast ? '過去のステージ' : '未来のステージ'}
                  </span>
                </div>

                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-2.5 sm:mb-3 whitespace-pre-line">
                  {stage.description}
                </p>

                {/* 照らし合わせポイント */}
                <div className="bg-white/80 border border-zinc-200/60 p-2.5 sm:p-3 rounded-xl text-xs text-zinc-700 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">
                    {stage.checkPoint}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
