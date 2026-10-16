"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Customer, AppraisalRecord } from '@/lib/db';
import { calculateFortune, calculateCompatibility, calculateCoupleFortune, FortuneResult, CompatibilityResult, Score, PeriodData } from '@/lib/fortune';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YearPicker } from '@/components/ui/year-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Users, ArrowRight, Heart, Briefcase, Home, Calendar, CalendarHeart, Activity, BookOpen, ActivitySquare, ArrowLeft, ChevronLeft, ChevronRight, Filter, LineChart as LineChartIcon, Table as TableIcon, HeartHandshake, AlertTriangle, Plus, Edit2, Trash2, MessageCircle, Mic, MicOff, StopCircle, Clock, CheckCircle2, ArrowRightLeft, Copy, Wand2, MessageSquare, Key } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { getGeminiAPIKey, setGeminiAPIKey, generateTextWithGemini } from '@/lib/gemini';
import { NatureDetailView } from '@/components/fortune/NatureDetailView';

export default function FortuneApp() {
  const [activeTab, setActiveTab] = useState('fortune');
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  // Target Person 1
  const [name, setName] = useState('');
  const [bYear, setBYear] = useState('');
  const [bMonth, setBMonth] = useState('');
  const [bDay, setBDay] = useState('');
  const [gender, setGender] = useState('');
  
  // Compatibility Mode & Person 2
  const [isCompatibilityMode, setIsCompatibilityMode] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [pYear, setPYear] = useState('');
  const [pMonth, setPMonth] = useState('');
  const [pDay, setPDay] = useState('');
  const [pGender, setPGender] = useState('');

  const [result, setResult] = useState<FortuneResult | null>(null);
  const [compResult, setCompResult] = useState<CompatibilityResult | null>(null);

  const [resultTab, setResultTab] = useState('nature');
  const [fortuneMethod, setFortuneMethod] = useState<'overall' | 'reisui' | 'fourPillars' | 'nineStar'>('overall');

  // Flow State
  const [flowViewType, setFlowViewType] = useState<'graph' | 'table'>('graph');
  const [selectedYearValue, setSelectedYearValue] = useState<number | null>(null);
  const [filterMinScore, setFilterMinScore] = useState<string>("0");
  const [filterMaxScore, setFilterMaxScore] = useState<string>("100");
  
  // Dialog States
  const [scoreDetailOpen, setScoreDetailOpen] = useState(false);
  const [selectedScoreInfo, setSelectedScoreInfo] = useState<{ categoryName: string, score: Score, period: string, stageName?: string, age?: number } | null>(null);
  const [reisuiCycleInfoOpen, setReisuiCycleInfoOpen] = useState(false);

  // Customer Management States
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [isMoveRecordDialogOpen, setIsMoveRecordDialogOpen] = useState(false);
  const [isRecordsListDialogOpen, setIsRecordsListDialogOpen] = useState(false);
  const [recordsListCustomerId, setRecordsListCustomerId] = useState<number | null>(null);
  const [selectedRecordIdInDialog, setSelectedRecordIdInDialog] = useState<string | null>(null);
  const [recordToMove, setRecordToMove] = useState<{ customerId: number, recordId: string, recordContent: string, recordDate: string } | null>(null);
  const [targetMoveCustomerId, setTargetMoveCustomerId] = useState<string>('');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editingRecordContent, setEditingRecordContent] = useState<string>('');
  const [editingRecordSummary, setEditingRecordSummary] = useState<string>('');
  const [editingRecordPostMessage, setEditingRecordPostMessage] = useState<string>('');
  const [cName, setCName] = useState('');
  const [cBYear, setCBYear] = useState('');
  const [cBMonth, setCBMonth] = useState('');
  const [cBDay, setCBDay] = useState('');
  const [cGender, setCGender] = useState('');

  // Voice Recording States
  const [activeCustomerId, setActiveCustomerId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Mobile View Navigation State ('form' | 'results')
  const [mobileSection, setMobileSection] = useState<'form' | 'results'>('form');
  const resultsRef = useRef<HTMLDivElement>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = (await res.json()) as Customer[];
        setCustomers(data);
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openNewCustomerDialog = () => {
    setEditingCustomerId(null);
    setCName(''); setCBYear(''); setCBMonth(''); setCBDay(''); setCGender('');
    setIsCustomerDialogOpen(true);
  };

  const viewCustomerRecords = (customer: any) => {
    if (customer.id) {
      setActiveCustomerId(customer.id);
      setName(customer.name);
      if (customer.birthdate) {
        setBYear(customer.birthdate.split('-')[0] || '');
        setBMonth(customer.birthdate.split('-')[1] || '');
        setBDay(customer.birthdate.split('-')[2] || '');
      }
      if (customer.gender) {
        setGender(customer.gender);
      }
      setRecordsListCustomerId(customer.id);
      setSelectedRecordIdInDialog(null);
      setIsRecordsListDialogOpen(true);
    }
  };

  const saveEditedRecord = async (customerId: number, recordId: string) => {
    try {
      await fetch(`/api/records/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingRecordContent,
          summary: editingRecordSummary,
          postMessage: editingRecordPostMessage
        })
      });
      setEditingRecordId(null);
      await fetchCustomers();
    } catch (e) { console.error(e); }
  };

  const deleteRecord = async (customerId: number, recordId: string) => {
    if (!confirm("本当にこの鑑定記録を削除してもよろしいですか？")) return;
    try {
      await fetch(`/api/records/${recordId}`, { method: 'DELETE' });
      await fetchCustomers();
    } catch (e) { console.error(e); }
  };

  const handleMoveRecord = async () => {
    if (!recordToMove || !targetMoveCustomerId) return;
    try {
      await fetch(`/api/records/${recordToMove.recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: Number(targetMoveCustomerId) })
      });
      setIsMoveRecordDialogOpen(false);
      setRecordToMove(null);
      setTargetMoveCustomerId('');
      await fetchCustomers();
    } catch (e) { console.error(e); }
  };

  const openEditCustomerDialog = (c: any) => {
    setEditingCustomerId(c.id);
    setCName(c.name);
    if (c.birthdate) {
      const [y, m, d] = c.birthdate.split('-');
      setCBYear(y || ''); setCBMonth(m || ''); setCBDay(d || '');
    }
    setCGender(c.gender || '');
    setIsCustomerDialogOpen(true);
  };

  const saveCustomer = async () => {
    if (!cName || !cBYear || !cBMonth || !cBDay) return;
    const birthdate = `${cBYear}-${cBMonth}-${cBDay}`;
    try {
      if (editingCustomerId) {
        await fetch(`/api/customers/${editingCustomerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cName, birthdate, gender: cGender, notes: '' })
        });
      } else {
        await fetch(`/api/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cName, birthdate, gender: cGender, notes: '' })
        });
      }
      setIsCustomerDialogOpen(false);
      await fetchCustomers();
    } catch (e) { console.error(e); }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  const requestDeleteCustomer = (id: number) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      await fetch(`/api/customers/${customerToDelete}`, { method: 'DELETE' });
      await fetchCustomers();
    } catch (e) { console.error(e); }
    setDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  };

  const autoSaveCustomer = async (n: string, y: string, m: string, d: string, g: string): Promise<number | undefined> => {
    const birthdate = `${y}-${m}-${d}`;
    try {
      const existing = customers?.find(c => c.name === n && c.birthdate === birthdate);
      if (!existing) {
        const res = await fetch(`/api/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: n, birthdate, gender: g, notes: '' })
        });
        const data = (await res.json()) as any;
        await fetchCustomers();
        return data.id as number;
      } else if (existing.id) {
        if (existing.gender !== g) {
          await fetch(`/api/customers/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: existing.name, birthdate: existing.birthdate, gender: g, notes: existing.notes })
          });
          await fetchCustomers();
        }
        return existing.id;
      }
    } catch (err) {
      console.error("Auto-save failed", err);
    }
    return undefined;
  };

  const handleFortune = async () => {
    if (!name || !bYear || !bMonth || !bDay) return;
    const birthdate = `${bYear}-${bMonth}-${bDay}`;
    
    const cid = await autoSaveCustomer(name, bYear, bMonth, bDay, gender);
    if (cid) setActiveCustomerId(cid);

    if (isCompatibilityMode && partnerName && pYear && pMonth && pDay) {
      const pBirthdate = `${pYear}-${pMonth}-${pDay}`;
      const cRes = calculateCompatibility(birthdate, name, pBirthdate, partnerName);
      setCompResult(cRes);
      
      const coupleRes = calculateCoupleFortune(birthdate, name, pBirthdate, partnerName);
      setResult(coupleRes);

      setResultTab('compatibility');
      await autoSaveCustomer(partnerName, pYear, pMonth, pDay, pGender);
    } else {
      const res = calculateFortune(birthdate, name, gender);
      setResult(res);
      setCompResult(null);
      setResultTab('nature');
    }
    
    setSelectedYearValue(null);
    setFlowViewType('graph');
    setMobileSection('results');
  };

  const loadCustomerToFortune = (c: any, target: 1 | 2 = 1) => {
    if (target === 1) {
      setName(c.name);
      if (c.birthdate) {
        const [y, m, d] = c.birthdate.split('-');
        setBYear(y || ''); setBMonth(m || ''); setBDay(d || '');
      }
      setGender(c.gender || '');
      if (c.id) setActiveCustomerId(c.id);
    } else {
      setPartnerName(c.name);
      if (c.birthdate) {
        const [y, m, d] = c.birthdate.split('-');
        setPYear(y || ''); setPMonth(m || ''); setPDay(d || '');
      }
      setPGender(c.gender || '');
    }
    setActiveTab('fortune');
    setMobileSection('form');
  };

  // Speech Recognition Logic
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("お使いのブラウザは音声認識に対応していません。（SafariまたはChromeをご利用ください）");
      return;
    }
    
    setLiveTranscript('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setLiveTranscript(fullTranscript);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setResultTab('records');
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    saveTranscriptToCustomer(true);
  };

  const handleCopyRecord = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('コピーしました');
    } catch (err) {
      console.error('コピーに失敗しました', err);
    }
  };

  const requireApiKey = (action: () => void) => {
    const key = getGeminiAPIKey();
    if (key) {
      action();
    } else {
      setPendingAction(() => action);
      setTempApiKey('');
      setIsApiKeyDialogOpen(true);
    }
  };

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      setGeminiAPIKey(tempApiKey.trim());
      setIsApiKeyDialogOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  };

  const generateSummary = async (customerId: number, recordId: string, content: string) => {
    setIsGeneratingText(true);
    try {
      const apiKey = getGeminiAPIKey();
      if (!apiKey) return;
      const prompt = `以下の文章を要約してください。\n\n${content}`;
      const summary = await generateTextWithGemini(prompt, apiKey);
      
      const targetCustomer = customers?.find(c => c.id === customerId);
      const targetRecord = targetCustomer?.records?.find(r => r.id === recordId);
      if (targetRecord) {
        await fetch(`/api/records/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: targetRecord.content, summary, postMessage: targetRecord.postMessage })
        });
      }
      alert('要約を保存しました');
      await fetchCustomers();
    } catch (e: any) {
      console.error(e);
      alert(`要約に失敗しました。APIキーが正しいか確認してください。\n(エラー: ${e.message || String(e)})`);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const generateMessage = async (customerId: number, recordId: string, content: string, customerName: string) => {
    setIsGeneratingText(true);
    try {
      const apiKey = getGeminiAPIKey();
      if (!apiKey) return;
      const prompt = `以下の鑑定記録をもとに、占い師からお客様（お名前：${customerName}様）へ送るための丁寧な鑑定後メッセージを作成してください。お客様を励まし、前向きになれるような文章にしてください。絵文字も少し使ってください。\n\n【鑑定記録】\n${content}`;
      const message = await generateTextWithGemini(prompt, apiKey);
      
      const targetCustomer = customers?.find(c => c.id === customerId);
      const targetRecord = targetCustomer?.records?.find(r => r.id === recordId);
      if (targetRecord) {
        await fetch(`/api/records/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: targetRecord.content, summary: targetRecord.summary, postMessage: message })
        });
      }
      alert('鑑定後メッセージを作成して保存しました');
      await fetchCustomers();
    } catch (e: any) {
      console.error(e);
      alert(`メッセージ作成に失敗しました。APIキーが正しいか確認してください。\n(エラー: ${e.message || String(e)})`);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const saveTranscriptToCustomer = async (silent = false) => {
    if (!liveTranscript.trim()) return;
    
    let targetCustomerId = activeCustomerId;
    
    if (!targetCustomerId) {
      if (name && bYear && bMonth && bDay) {
        targetCustomerId = await autoSaveCustomer(name, bYear, bMonth, bDay, gender) || null;
        if (targetCustomerId) {
          setActiveCustomerId(targetCustomerId);
        }
      } else {
        if (!silent) alert("保存する前に、左側のフォームでお名前と生年月日を入力してください。");
        return;
      }
    }
    
    if (!targetCustomerId) return;

    try {
      const newRecord: any = {
        id: Date.now().toString(),
        customerId: targetCustomerId,
        date: new Date().toISOString(),
        content: liveTranscript.trim(),
        summary: '',
        postMessage: '',
        partnerName: isCompatibilityMode && partnerName ? partnerName : ''
      };
      
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      
      setLiveTranscript('');
      await fetchCustomers();
      if (!silent) alert("鑑定記録を保存しました！");
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRecordField = async (customerId: number, recordId: string, field: 'summary' | 'postMessage') => {
    if (!confirm(`この${field === 'summary' ? '要約' : '鑑定後メッセージ'}を削除してもよろしいですか？`)) return;
    try {
      const targetCustomer = customers?.find(c => c.id === customerId);
      const targetRecord = targetCustomer?.records?.find(r => r.id === recordId);
      if (targetRecord) {
        const payload: any = { content: targetRecord.content, summary: targetRecord.summary, postMessage: targetRecord.postMessage };
        payload[field] = '';
        await fetch(`/api/records/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        await fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openScoreDetail = (categoryName: string, score: Score, period: string, stageName?: string, age?: number) => {
    setSelectedScoreInfo({ categoryName, score, period, stageName, age });
    setScoreDetailOpen(true);
  };

  const graphData = useMemo(() => {
    if (!result) return [];
    const sourceList = selectedYearValue === null
      ? result.flows.hundredYears
      : (result.flows.hundredYears.find(y => y.periodValue === selectedYearValue)?.months || []);

    return sourceList.map(item => {
      let stage = item.stage;
      if (fortuneMethod === 'reisui') stage = item.stageReisui;
      else if (fortuneMethod === 'fourPillars') stage = item.stageFourPillars;
      else if (fortuneMethod === 'nineStar') stage = item.stageNineStar;
      
      return {
        ...item,
        displayLabel: selectedYearValue === null
          ? (isCompatibilityMode ? `${item.periodValue}年\n(${name} ${item.age}歳)` : `${item.periodValue}年\n(${item.age}歳)`)
          : `${item.periodValue}月`,
        stageScore: stage.score,
        stageName: stage.name,
        stageSeason: stage.season || '',
        stageSeasonLabel: stage.seasonLabel || '',
        stageSeasonTheme: stage.seasonTheme || '',
        stageKeywords: stage.keywords || '',
        stageDescription: stage.description || '',
        stageIsPeak: stage.isPeak,
        stageIsValley: stage.isValley,
        stageFuyuShitaku: stage.fuyuShitaku
      };
    });
  }, [result, selectedYearValue, isCompatibilityMode, name, fortuneMethod]);

  // 令翠学用の3年周期（四季：冬・春・夏・秋）の背景エリア範囲の計算
  const reisuiSeasonRanges = useMemo(() => {
    if (fortuneMethod !== 'reisui' || !graphData.length) return [];
    const ranges: { season: string; seasonLabel: string; startYear: number; endYear: number; color: string; strokeColor: string; textColor: string }[] = [];
    let currentRange: { season: string; seasonLabel: string; startYear: number; endYear: number; color: string; strokeColor: string; textColor: string } | null = null;

    const colorConfig: Record<string, { bg: string; stroke: string; text: string }> = {
      '冬': { bg: 'rgba(239, 246, 255, 0.55)', stroke: '#bfdbfe', text: '#2563eb' }, // アイシーブルー（忍耐）
      '春': { bg: 'rgba(236, 253, 245, 0.60)', stroke: '#a7f3d0', text: '#059669' }, // 新緑ミントグリーン（努力）
      '夏': { bg: 'rgba(255, 251, 235, 0.65)', stroke: '#fde68a', text: '#d97706' }, // サンシャインゴールド（願望）
      '秋': { bg: 'rgba(254, 252, 232, 0.60)', stroke: '#fef08a', text: '#a16207' }, // 収穫ウォームイエロー（結実）
    };

    graphData.forEach((d, idx) => {
      const s = d.stageSeason || '春';
      const sLabel = d.stageSeasonLabel || `${s}の時期`;
      const cfg = colorConfig[s] || { bg: 'rgba(244, 244, 245, 0.5)', stroke: '#e4e4e7', text: '#52525b' };

      if (!currentRange || currentRange.season !== s) {
        if (currentRange) {
          ranges.push(currentRange);
        }
        currentRange = {
          season: s,
          seasonLabel: sLabel,
          startYear: d.periodValue,
          endYear: d.periodValue,
          color: cfg.bg,
          strokeColor: cfg.stroke,
          textColor: cfg.text
        };
      } else {
        currentRange.endYear = d.periodValue;
      }

      if (idx === graphData.length - 1 && currentRange) {
        ranges.push(currentRange);
      }
    });

    return ranges;
  }, [graphData, fortuneMethod]);

  const handleGraphDotClick = (data: any) => {
    if (!data) return;
    const p = (data.payload || data) as PeriodData;
    if (!p || typeof p.periodValue === 'undefined') return;
    
    if (selectedYearValue === null) {
      // 年別グラフのとき：年度をクリックしたら、その年度の月別グラフにドリルダウン！
      setSelectedYearValue(p.periodValue);
    } else {
      // 月別グラフのとき：月をクリックしたら、詳細アドバイスダイアログを表示！
      let stage = p.stage;
      if (fortuneMethod === 'reisui') stage = p.stageReisui;
      else if (fortuneMethod === 'fourPillars') stage = p.stageFourPillars;
      else if (fortuneMethod === 'nineStar') stage = p.stageNineStar;
      
      const summaryScore: Score = {
        value: stage.score,
        detail: stage.description,
        caution: "この時期のテーマに沿った行動を心がけることで、次のサイクルへスムーズに移行できます。",
        recommendation: "全体のバイオリズムを意識し、無理のない計画を立てましょう。"
      };
      openScoreDetail('総合バイオリズム', summaryScore, `${selectedYearValue}年 ${p.period}`, stage.name, p.age);
    }
  };

  const getGraphViewport = () => {
    return (
      (document.querySelector('#fortune-graph-scroll-area [data-slot="scroll-area-viewport"]') as HTMLElement) ||
      (document.querySelector('#fortune-graph-scroll-area [data-radix-scroll-area-viewport]') as HTMLElement) ||
      (document.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement) ||
      (document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement)
    );
  };

  const scrollToCurrentYear = () => {
    if (selectedYearValue !== null) {
      setSelectedYearValue(null);
    }
    const currentIndex = graphData.findIndex(y => y.periodValue === currentYear);
    if (currentIndex > -1) {
      const stepWidth = fortuneMethod === 'reisui' ? 76 : 60;
      const targetPos = 34 + currentIndex * stepWidth;
      const doScroll = () => {
        const viewport = getGraphViewport();
        if (viewport) {
          const clientWidth = viewport.clientWidth || 800;
          const scrollLeft = Math.max(0, targetPos - clientWidth / 2 + stepWidth / 2);
          viewport.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      };
      doScroll();
      setTimeout(doScroll, 100);
      setTimeout(doScroll, 300);
    }
  };

  useEffect(() => {
    if (flowViewType === 'graph' && graphData.length > 0) {
      if (selectedYearValue === null) {
        const currentIndex = graphData.findIndex(y => y.periodValue === currentYear);
        if (currentIndex > -1) {
          const stepWidth = fortuneMethod === 'reisui' ? 76 : 60;
          const targetPos = 34 + currentIndex * stepWidth;
          const timer = setTimeout(() => {
            const viewport = getGraphViewport();
            if (viewport) {
              const clientWidth = viewport.clientWidth || 800;
              const scrollLeft = Math.max(0, targetPos - clientWidth / 2 + stepWidth / 2);
              viewport.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
          }, 350);
          return () => clearTimeout(timer);
        }
      } else {
        const timer = setTimeout(() => {
          const viewport = getGraphViewport();
          if (viewport) {
            viewport.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [flowViewType, selectedYearValue, graphData, currentYear, fortuneMethod]);

  const renderScoreCell = (categoryName: string, score: Score, period: string, row: PeriodData) => {
    const min = parseInt(filterMinScore) || 0;
    const max = parseInt(filterMaxScore) || 100;
    const isFilteredOut = score.value < min || score.value > max;
    
    let colorClass = "text-zinc-700 font-medium";
    if (score.value >= 80) colorClass = "text-amber-500 font-bold";
    else if (score.value <= 30) colorClass = "text-zinc-400";

    if (isFilteredOut) {
      return <TableCell className="text-center py-4 text-sm text-zinc-200">-</TableCell>;
    }

    return (
      <TableCell 
        className="text-center py-4 px-1 cursor-pointer hover:bg-amber-50/50 transition-colors"
        onClick={() => openScoreDetail(categoryName, score, period, row.stage.name, row.age)}
      >
        <div className="flex flex-col items-center justify-center">
          <span className={`text-xl ${colorClass}`}>{score.value}</span>
          <span className="text-[10px] text-zinc-400 mt-1">点</span>
        </div>
      </TableCell>
    );
  };

  let flowDataList: PeriodData[] = [];
  if (result) {
    if (selectedYearValue === null) flowDataList = result.flows.hundredYears;
    else {
      const targetYear = result.flows.hundredYears.find(y => y.periodValue === selectedYearValue);
      flowDataList = targetYear?.months || [];
    }
  }

  const selectedTargetYearData = useMemo(() => {
    if (!result || selectedYearValue === null) return null;
    return result.flows.hundredYears.find(y => y.periodValue === selectedYearValue) || null;
  }, [result, selectedYearValue]);

  const minScoreNum = parseInt(filterMinScore) || 0;
  const maxScoreNum = parseInt(filterMaxScore) || 100;
  
  const filteredFlowDataList = flowDataList.filter(row => {
    const scores = [row.romance.value, row.work.value, row.family.value, row.marriage.value, row.health.value];
    return scores.some(s => s >= minScoreNum && s <= maxScoreNum);
  });

  const CustomGraphTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as any;
      let stage = data.stage;
      if (fortuneMethod === 'reisui') stage = data.stageReisui;
      else if (fortuneMethod === 'fourPillars') stage = data.stageFourPillars;
      else if (fortuneMethod === 'nineStar') stage = data.stageNineStar;
      
      const isReisui = fortuneMethod === 'reisui';
      const periodTitle = selectedYearValue === null 
        ? `${data.period} ${isCompatibilityMode ? '' : `(${data.age}歳)`}`
        : `${selectedYearValue}年 ${data.period} ${isCompatibilityMode ? '' : `(${data.age}歳)`}`;

      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-zinc-100 min-w-[240px] max-w-[300px]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs text-zinc-400 font-medium">{periodTitle}</p>
            {isReisui && stage.seasonLabel && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                stage.season === '冬' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                stage.season === '春' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                stage.season === '夏' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}>
                {stage.seasonLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xl font-bold ${isReisui ? 'text-emerald-700' : 'text-blue-600'}`}>
              {stage.name}期
            </span>
            <span className="text-sm font-semibold text-zinc-500">({stage.score}点)</span>
            {isReisui && stage.fuyuShitaku && (
              <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">冬支度</span>
            )}
          </div>

          {isReisui && stage.keywords && (
            <div className="inline-block bg-emerald-50/80 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 border border-emerald-100">
              象徴：{stage.keywords}
            </div>
          )}

          <p className="text-xs text-zinc-600 leading-relaxed mb-3">{stage.description}</p>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100">
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '協力' : '仕事'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.work?.value ?? '-'}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '結実' : '婚期'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.marriage?.value ?? '-'}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '関係' : '恋愛'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.romance?.value ?? '-'}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '余裕' : '健康'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.health?.value ?? '-'}</span>
             </div>
          </div>

          <button
            type="button"
            className={`w-full text-[11px] font-semibold mt-3 text-center py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              isReisui 
                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' 
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleGraphDotClick(data);
            }}
          >
            {selectedYearValue === null ? (
              <>タップして{data.periodValue}年の月別グラフを表示 <ArrowRight className="w-3 h-3" /></>
            ) : (
              <>タップして詳細スコアを表示</>
            )}
          </button>
        </div>
      );
    }
    return null;
  };

  const renderYearTick = (props: any) => {
    const { x, y, payload } = props;
    if (!payload) return null;
    const d = graphData.find(item => item.periodValue === payload.value);
    const isReisui = fortuneMethod === 'reisui';

    if (isReisui && d) {
      let seasonBadgeBg = '#f1f5f9';
      let seasonBadgeBorder = '#cbd5e1';
      let seasonTextColor = '#475569';
      const seasonName = d.stageSeason || '';

      if (seasonName === '冬') {
        seasonBadgeBg = '#eff6ff';
        seasonBadgeBorder = '#bfdbfe';
        seasonTextColor = '#1d4ed8';
      } else if (seasonName === '春') {
        seasonBadgeBg = '#ecfdf5';
        seasonBadgeBorder = '#a7f3d0';
        seasonTextColor = '#047857';
      } else if (seasonName === '夏') {
        seasonBadgeBg = '#fffbeb';
        seasonBadgeBorder = '#fde68a';
        seasonTextColor = '#b45309';
      } else if (seasonName === '秋') {
        seasonBadgeBg = '#fefce8';
        seasonBadgeBorder = '#fef08a';
        seasonTextColor = '#a16207';
      }

      const kw = d.stageKeywords || '';
      const kwParts = kw.includes('・') ? kw.split('・') : [kw];
      const kwLine1 = kwParts[0] || '';
      const kwLine2 = kwParts.slice(1).join('・');

      return (
        <g transform={`translate(${x},${y})`}>
          {/* 西暦年 */}
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="middle"
            fill="#374151"
            fontSize={12}
            fontWeight={700}
            style={{ cursor: 'pointer' }}
            className="hover:fill-emerald-600 select-none"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedYearValue(payload.value);
            }}
          >
            {`${payload.value}年`}
          </text>

          {/* 年齢 */}
          <text
            x={0}
            y={0}
            dy={30}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize={10}
            fontWeight={500}
            className="select-none"
          >
            {`(${d.age}歳)`}
          </text>

          {/* 四季・時期名バッジ */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleGraphDotClick(d);
            }}
          >
            <rect
              x={-28}
              y={38}
              width={56}
              height={20}
              rx={10}
              fill={seasonBadgeBg}
              stroke={seasonBadgeBorder}
              strokeWidth={1}
            />
            <text
              x={0}
              y={52}
              textAnchor="middle"
              fill={seasonTextColor}
              fontSize={11}
              fontWeight={700}
              className="select-none"
            >
              {d.stageName}
            </text>
          </g>

          {/* 1年の意味キーワード（画像のように直感的に読める） */}
          <text
            x={0}
            y={73}
            textAnchor="middle"
            fill="#374151"
            fontSize={9.5}
            fontWeight={600}
            className="select-none"
          >
            {kwLine1}
          </text>
          {kwLine2 && (
            <text
              x={0}
              y={85}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={8.5}
              fontWeight={500}
              className="select-none"
            >
              {kwLine2}
            </text>
          )}

          {/* 冬支度ラベル（背信、充実の先） */}
          {d.stageFuyuShitaku && (
            <text
              x={0}
              y={kwLine2 ? 97 : 85}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={8}
              fontWeight={500}
              className="select-none"
            >
              （冬支度）
            </text>
          )}
        </g>
      );
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#71717a"
          fontSize={12}
          fontWeight={500}
          style={{ cursor: 'pointer' }}
          className="hover:fill-blue-600 select-none"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof payload.value !== 'undefined') {
              setSelectedYearValue(payload.value);
            }
          }}
        >
          {`${payload.value}年`}
        </text>
        {d && (
          <text
            x={0}
            y={0}
            dy={30}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize={10}
            className="select-none"
          >
            {`(${d.age}歳)`}
          </text>
        )}
      </g>
    );
  };

  const renderYearDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (typeof cx !== 'number' || typeof cy !== 'number') return null;
    const isReisui = fortuneMethod === 'reisui';

    if (isReisui) {
      // 令翠学の運命周期図スタイル（白抜きの丸にエメラルドグリーンの太枠）
      const isPeak = payload?.stageIsPeak;
      const isValley = payload?.stageIsValley;

      return (
        <g key={`ydot-${payload?.periodValue}`}>
          {isPeak && (
            <circle
              cx={cx}
              cy={cy}
              r={9}
              fill="none"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              className="animate-spin-slow"
            />
          )}
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill="#ffffff"
            stroke={isPeak ? "#047857" : isValley ? "#059669" : "#059669"}
            strokeWidth={3}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleGraphDotClick(payload);
            }}
          />
        </g>
      );
    }

    return (
      <circle
        key={`ydot-${payload?.periodValue}`}
        cx={cx}
        cy={cy}
        r={6}
        fill="#ffffff"
        stroke="#3b82f6"
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          handleGraphDotClick(payload);
        }}
      />
    );
  };

  const renderMonthDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (typeof cx !== 'number' || typeof cy !== 'number') return null;
    const isReisui = fortuneMethod === 'reisui';

    return (
      <circle
        key={`mdot-${payload?.periodValue}`}
        cx={cx}
        cy={cy}
        r={7}
        fill="#ffffff"
        stroke={isReisui ? "#059669" : "#f59e0b"}
        strokeWidth={2.5}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          handleGraphDotClick(payload);
        }}
      />
    );
  };

  const isFormValid = isCompatibilityMode 
    ? (name && bYear && bMonth && bDay && partnerName && pYear && pMonth && pDay)
    : (name && bYear && bMonth && bDay);

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-zinc-50/50 text-zinc-800 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden md:overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 w-full">
        {/* iPad最適化スリムトップバー (44px) */}
        <header className="h-11 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-zinc-800 text-xs tracking-wider uppercase">
              鑑定システム
            </span>
          </div>
          <TabsList className="bg-zinc-100/90 p-0.5 rounded-xl border border-zinc-200/60 h-8">
            <TabsTrigger value="fortune" className="rounded-lg px-3 sm:px-3.5 py-1 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-xs text-zinc-500">
              <Sparkles className="w-3.5 h-3.5 mr-1 sm:mr-1.5" /> 鑑定
            </TabsTrigger>
            <TabsTrigger value="customers" className="rounded-lg px-3 sm:px-3.5 py-1 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-xs text-zinc-500">
              <Users className="w-3.5 h-3.5 mr-1 sm:mr-1.5" /> 顧客一覧
            </TabsTrigger>
          </TabsList>
        </header>

        {/* スマホ専用: 鑑定結果がある場合の入力/結果切り替えサブバー (md未満のみ表示) */}
        {activeTab === 'fortune' && result && (
          <div className="md:hidden flex items-center justify-between px-3 py-1.5 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/60 text-xs shrink-0 z-10 animate-in fade-in slide-in-from-top-1">
            <span className="font-semibold text-zinc-700 truncate max-w-[170px] text-[11px]" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
              {name} 様 {isCompatibilityMode && partnerName ? `× ${partnerName} 様` : ''}
            </span>
            <div className="flex bg-white/90 p-0.5 rounded-lg border border-amber-200/70 shadow-2xs">
              <button
                onClick={() => setMobileSection('form')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  mobileSection === 'form' 
                    ? 'bg-zinc-900 text-white shadow-2xs font-semibold' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                入力条件
              </button>
              <button
                onClick={() => setMobileSection('results')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  mobileSection === 'results' 
                    ? 'bg-amber-500 text-white shadow-2xs font-semibold' 
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                鑑定結果
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 min-h-0 w-full px-2.5 py-2 sm:px-4 md:px-5 md:py-2.5 max-w-[1440px] mx-auto overflow-y-auto md:overflow-hidden flex flex-col">
          <TabsContent value="fortune" className="flex-1 min-h-0 m-0 focus-visible:outline-none flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 h-auto md:h-full min-h-0">
              
              {/* Input Section - Left Column (iPadで固定2カラム表示 / スマホではmobileSectionに応じて切り替え) */}
              <div className={`md:col-span-4 flex flex-col min-h-0 md:overflow-y-auto pr-0 md:pr-0.5 space-y-2 shrink-0 ${
                mobileSection === 'results' && result ? 'hidden md:flex' : 'flex'
              }`}>
                
                {/* クイック録音開始ボタン */}
                {isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" className="w-full h-8 rounded-xl shadow-xs font-medium animate-pulse text-xs">
                    <StopCircle className="w-4 h-4 mr-1.5" /> 録音停止
                  </Button>
                ) : (
                  <Button onClick={startRecording} className="w-full h-8 bg-white hover:bg-zinc-50 text-amber-600 border border-amber-200 hover:border-amber-300 rounded-xl shadow-xs font-semibold text-xs transition-all">
                    <Mic className="w-4 h-4 mr-1.5" /> 鑑定の記録を開始
                  </Button>
                )}

                {/* 診断モード切替 */}
                <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 p-1 rounded-xl flex shadow-2xs">
                  <button 
                    onClick={() => setIsCompatibilityMode(false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${!isCompatibilityMode ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'}`}
                  >
                    一人を占う
                  </button>
                  <button 
                    onClick={() => setIsCompatibilityMode(true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${isCompatibilityMode ? 'bg-rose-500 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'}`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" /> 相性を占う
                  </button>
                </div>

                <Card className="border-0 shadow-xs rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-zinc-200/60 transition-all">
                  <CardHeader className="bg-zinc-50/70 border-b border-zinc-100/70 py-2 px-3.5">
                    <CardTitle className="text-xs font-semibold text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                      {isCompatibilityMode ? 'あなた（1人目）' : '対象者情報'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">お名前</Label>
                      <Input placeholder="例: 山田 花子" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-zinc-200 focus-visible:ring-amber-500/20 h-8 px-3 text-xs rounded-lg shadow-2xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">生年月日</Label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <YearPicker value={bYear} onChange={setBYear} years={years} className="h-8 px-2 text-xs w-full rounded-lg" />
                        <Select value={bMonth} onValueChange={(val) => setBMonth(val || '')}>
                          <SelectTrigger className="w-full bg-white border-zinc-200 h-8 px-2 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="月" /></SelectTrigger>
                          <SelectContent className="rounded-xl max-h-[260px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={bDay} onValueChange={(val) => setBDay(val || '')}>
                          <SelectTrigger className="w-full bg-white border-zinc-200 h-8 px-2 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="日" /></SelectTrigger>
                          <SelectContent className="rounded-xl max-h-[260px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">性別 (任意)</Label>
                      <Select value={gender} onValueChange={(val) => setGender(val || '')}>
                        <SelectTrigger className="bg-white border-zinc-200 h-8 px-2.5 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="選択" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="female">女性</SelectItem>
                          <SelectItem value="male">男性</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {isCompatibilityMode && (
                  <Card className="border-0 shadow-xs rounded-2xl overflow-hidden bg-rose-50/70 backdrop-blur-xl border border-rose-200/60 transition-all animate-in fade-in slide-in-from-top-2">
                    <CardHeader className="bg-rose-100/50 border-b border-rose-200/50 py-2 px-3.5">
                      <CardTitle className="text-xs font-semibold text-rose-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                        お相手（2人目）
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-rose-600/80 uppercase tracking-wider">お名前</Label>
                        <Input placeholder="例: 鈴木 太郎" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="bg-white border-rose-100 focus-visible:ring-rose-500/20 h-8 px-3 text-xs rounded-lg shadow-2xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-rose-600/80 uppercase tracking-wider">生年月日</Label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <YearPicker value={pYear} onChange={setPYear} years={years} className="h-8 px-2 text-xs w-full rounded-lg" />
                          <Select value={pMonth} onValueChange={(val) => setPMonth(val || '')}>
                            <SelectTrigger className="w-full bg-white border-rose-100 h-8 px-2 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="月" /></SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[260px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select value={pDay} onValueChange={(val) => setPDay(val || '')}>
                            <SelectTrigger className="w-full bg-white border-rose-100 h-8 px-2 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="日" /></SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[260px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-rose-600/80 uppercase tracking-wider">性別 (任意)</Label>
                        <Select value={pGender} onValueChange={(val) => setPGender(val || '')}>
                          <SelectTrigger className="bg-white border-rose-100 h-8 px-2.5 rounded-lg shadow-2xs text-xs"><SelectValue placeholder="選択" /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="female">女性</SelectItem>
                            <SelectItem value="male">男性</SelectItem>
                            <SelectItem value="other">その他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleFortune} className="w-full h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs font-medium text-xs mt-1 shrink-0 cursor-pointer" disabled={!isFormValid}>
                  鑑定を実行する <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-80" />
                </Button>

                {/* スマホ時、既に結果が存在する場合のジャンプボタン (md未満のみ) */}
                {result && (
                  <Button 
                    variant="outline" 
                    onClick={() => setMobileSection('results')} 
                    className="w-full h-8 rounded-xl md:hidden text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200 text-xs font-semibold cursor-pointer"
                  >
                    鑑定結果を表示する <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>

              {/* Results Section - Right Column (iPadで固定表示 / スマホではmobileSectionに応じて切り替え) */}
              <div ref={resultsRef} className={`md:col-span-8 flex flex-col min-h-0 h-auto md:h-full overflow-visible md:overflow-hidden ${
                mobileSection === 'form' && result ? 'hidden md:flex' : 'flex'
              }`}>
                <div className="flex-1 min-h-0 flex flex-col animate-in fade-in duration-300">
                  <Tabs value={resultTab} onValueChange={setResultTab} className="flex-1 flex flex-col min-h-0 w-full">
                      <div className="flex border-b border-zinc-200/80 mb-2 overflow-x-auto hide-scrollbar shrink-0">
                        <TabsList className="bg-transparent h-auto p-0 flex gap-4 md:gap-6 min-w-max">
                          {isCompatibilityMode && compResult && (
                            <TabsTrigger value="compatibility" className="bg-transparent px-0 py-1.5 text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:bg-transparent data-[state=active]:text-rose-600 text-zinc-500 hover:text-zinc-700 font-medium">
                              <HeartHandshake className="w-3.5 h-3.5 mr-1.5" /> 相性診断スコア
                            </TabsTrigger>
                          )}
                          <TabsTrigger value="nature" className="bg-transparent px-0 py-1.5 text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700 font-medium">
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" /> {isCompatibilityMode ? '二人の相性の性質' : '性質'}
                          </TabsTrigger>
                          <TabsTrigger value="explanation" className="bg-transparent px-0 py-1.5 text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700 font-medium">
                            <ActivitySquare className="w-3.5 h-3.5 mr-1.5" /> {isCompatibilityMode ? '相性の運気の説明' : '運気の説明'}
                          </TabsTrigger>
                          <TabsTrigger value="flows" className="bg-transparent px-0 py-1.5 text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700 font-medium">
                            <LineChartIcon className="w-3.5 h-3.5 mr-1.5" /> {isCompatibilityMode ? '二人の運気の流れ' : '運気の流れ'}
                          </TabsTrigger>
                          <TabsTrigger value="records" className="bg-transparent px-0 py-1.5 text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700 font-medium">
                            <Mic className="w-3.5 h-3.5 mr-1.5" /> 鑑定記録
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {!result && resultTab !== 'records' && (
                        <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border border-dashed border-zinc-300/80 rounded-2xl bg-white/60 text-zinc-400 my-auto">
                          <Sparkles className="w-10 h-10 mb-3 text-zinc-300" strokeWidth={1} />
                          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>情報を入力し、鑑定を実行してください</p>
                        </div>
                      )}

                      {result && (
                        <>
                          {/* Tab: 相性結果 (Compatibility) */}
                          {isCompatibilityMode && compResult && (() => {
                            const activeComp = compResult.methods?.[fortuneMethod] || {
                              score: compResult.score,
                              label: "総合相性スコア",
                              starPair: "総合鑑定",
                              overall: compResult.overall,
                              romance: compResult.romance,
                              work: compResult.work,
                              communication: compResult.communication
                            };

                            const methodColorMap: Record<string, { badge: string, scoreText: string, border: string }> = {
                              overall: { badge: 'bg-rose-100/80 text-rose-700', scoreText: 'text-rose-600', border: 'border-rose-100/80' },
                              reisui: { badge: 'bg-teal-100/80 text-teal-700', scoreText: 'text-teal-600', border: 'border-teal-100/80' },
                              fourPillars: { badge: 'bg-amber-100/80 text-amber-700', scoreText: 'text-amber-600', border: 'border-amber-100/80' },
                              nineStar: { badge: 'bg-blue-100/80 text-blue-700', scoreText: 'text-blue-600', border: 'border-blue-100/80' }
                            };
                            const currentTheme = methodColorMap[fortuneMethod] || methodColorMap.overall;

                            return (
                              <TabsContent value="compatibility" className="flex-1 min-h-0 overflow-y-visible lg:overflow-y-auto space-y-3 pr-0 lg:pr-1 outline-none animate-in fade-in duration-300">
                                {/* 占術切替ボタン (4種類: 総合、令翠学、四柱推命、九星気学) */}
                                <div className="flex justify-center mb-2 shrink-0">
                                  <div className="bg-white/80 backdrop-blur-xl border border-rose-150 ring-1 ring-zinc-900/5 p-1 rounded-xl grid grid-cols-2 sm:flex shadow-2xs max-w-lg w-full gap-1 sm:gap-0">
                                    {[
                                      { id: 'overall', label: '総合相性', desc: '3占術の統合', score: compResult.methods?.overall?.score ?? compResult.score },
                                      { id: 'reisui', label: '令翠学', desc: '宿星の調和', score: compResult.methods?.reisui?.score },
                                      { id: 'fourPillars', label: '四柱推命', desc: '日柱干支の縁', score: compResult.methods?.fourPillars?.score },
                                      { id: 'nineStar', label: '九星気学', desc: '本命気の巡り', score: compResult.methods?.nineStar?.score },
                                    ].map(m => (
                                      <button 
                                        key={m.id}
                                        onClick={() => setFortuneMethod(m.id as any)}
                                        className={`flex-1 py-1.5 px-1.5 text-xs font-medium rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${
                                          fortuneMethod === m.id 
                                            ? 'bg-rose-500 text-white shadow-2xs' 
                                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-rose-50/60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1">
                                          <span className="font-semibold text-[11px] sm:text-xs">{m.label}</span>
                                          {m.score !== undefined && (
                                            <span className={`text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded-full ${
                                              fortuneMethod === m.id ? 'bg-white/20 text-white' : 'bg-rose-100/80 text-rose-700'
                                            }`}>
                                              {m.score}点
                                            </span>
                                          )}
                                        </div>
                                        <span className={`text-[9px] mt-0.5 tracking-tight hidden sm:block ${
                                          fortuneMethod === m.id ? 'text-rose-100' : 'text-zinc-400'
                                        }`}>
                                          {m.desc}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* メイン相性スコアカード */}
                                <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50/60 via-pink-50/40 to-amber-50/30 border border-rose-100/80">
                                  <CardContent className="pt-4 sm:pt-5 pb-4 sm:pb-5 px-3.5 sm:px-6 text-center relative">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none"><Heart className="w-48 h-48" /></div>
                                    
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2 tracking-wider ${currentTheme.badge}`}>
                                      <Sparkles className="w-3 h-3" />
                                      {activeComp.label}
                                    </div>

                                    <h2 className="text-lg sm:text-xl text-rose-950 font-normal mb-1" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                      {compResult.person1.name} さん <span className="text-rose-400 text-sm font-light">×</span> {compResult.person2.name} さん
                                    </h2>

                                    {activeComp.starPair && (
                                      <p className="text-xs font-medium text-rose-600/80 mb-3 tracking-wide">
                                        {activeComp.starPair}
                                      </p>
                                    )}

                                    <div className="flex justify-center items-end gap-1.5 mb-1">
                                      <span className={`text-5xl sm:text-6xl font-extralight tracking-tight transition-all duration-300 ${currentTheme.scoreText}`}>
                                        {activeComp.score}
                                      </span>
                                      <span className="text-base font-medium text-rose-400 mb-2">点</span>
                                    </div>

                                    <div className="flex justify-center mb-3">
                                      <div className="h-1 w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full" />
                                    </div>

                                    {/* 総合モード時の3大占術スコア内訳カード */}
                                    {fortuneMethod === 'overall' && compResult.methods && (
                                      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-3">
                                        {[
                                          { id: 'reisui', label: '令翠学', score: compResult.methods.reisui.score, weight: '35%' },
                                          { id: 'fourPillars', label: '四柱推命', score: compResult.methods.fourPillars.score, weight: '35%' },
                                          { id: 'nineStar', label: '九星気学', score: compResult.methods.nineStar.score, weight: '30%' },
                                        ].map(item => (
                                          <button
                                            key={item.id}
                                            onClick={() => setFortuneMethod(item.id as any)}
                                            className="bg-white/80 hover:bg-white backdrop-blur-md rounded-xl p-2 border border-rose-100 text-center transition-all hover:scale-[1.02] shadow-2xs group cursor-pointer"
                                          >
                                            <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 group-hover:text-rose-600">{item.label}</span>
                                            <span className="text-base font-bold text-rose-600 block">{item.score}<span className="text-[10px] font-normal text-zinc-400 ml-0.5">点</span></span>
                                          </button>
                                        ))}
                                      </div>
                                    )}

                                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-3.5 sm:p-4 text-left border border-white/80 max-w-xl mx-auto shadow-2xs">
                                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-1 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {activeComp.label}の総評
                                      </h3>
                                      <p className="text-zinc-700 leading-relaxed text-xs sm:text-sm">{activeComp.overall}</p>
                                    </div>
                                  </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-white/90 border border-pink-100/60">
                                    <CardHeader className="bg-gradient-to-r from-pink-50/50 to-rose-50/30 border-b border-pink-50/80 py-2.5 px-4">
                                      <CardTitle className="text-sm font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        <span className="flex items-center"><Heart className="w-4 h-4 text-pink-500 mr-1.5" /> 恋愛の相性</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3.5">
                                      <p className="text-zinc-600 leading-relaxed text-xs sm:text-sm">{activeComp.romance}</p>
                                    </CardContent>
                                  </Card>

                                  <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-white/90 border border-blue-100/60">
                                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-blue-100/50 py-2.5 px-4">
                                      <CardTitle className="text-sm font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        <span className="flex items-center"><Briefcase className="w-4 h-4 text-blue-500 mr-1.5" /> 仕事・パートナー相性</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3.5">
                                      <p className="text-zinc-600 leading-relaxed text-xs sm:text-sm">{activeComp.work}</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-white/90 border border-emerald-100/60">
                                  <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/30 border-b border-emerald-100/50 py-2.5 px-4">
                                    <CardTitle className="text-sm font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                      <span className="flex items-center"><MessageCircle className="w-4 h-4 text-emerald-500 mr-1.5" /> 連絡の取り方・コミュニケーション</span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3.5">
                                    <p className="text-zinc-600 leading-relaxed text-xs sm:text-sm">{activeComp.communication}</p>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            );
                          })()}

                      {/* Tab 1: 性質 (Nature) */}
                      <TabsContent value="nature" className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 outline-none animate-in fade-in duration-300">
                        
                        <div className="flex justify-center mb-2 shrink-0">
                          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 p-1 rounded-xl flex shadow-2xs max-w-sm w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'nineStar', label: '九星気学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'reisui', label: '令翠学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <NatureDetailView 
                          result={result} 
                          method={fortuneMethod} 
                          isCompatibilityMode={isCompatibilityMode} 
                        />
                      </TabsContent>

                      {/* Tab 2: 運気の説明 (Fortune Explanations) */}
                      <TabsContent value="explanation" className="flex-1 min-h-0 overflow-y-visible lg:overflow-y-auto space-y-3 sm:space-y-4 pr-0 lg:pr-1 outline-none animate-in fade-in duration-300">
                        
                        <div className="flex justify-center mb-2 shrink-0">
                          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 p-1 rounded-xl flex shadow-2xs max-w-sm w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'reisui', label: '令翠学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'nineStar', label: '九星気学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(fortuneMethod === 'overall') && (
                          <div className="mb-2 text-center text-zinc-500 text-xs">
                            各占術の運気の説明を一覧表示しています。
                          </div>
                        )}

                        {['overall', 'fourPillars', 'nineStar', 'reisui'].map(method => {
                          if (fortuneMethod !== 'overall' && fortuneMethod !== method) return null;
                          
                          const methodLabel = method === 'overall' ? '総合運' : method === 'fourPillars' ? '四柱推命' : method === 'nineStar' ? '九星気学' : '令翠学';
                          const mKey = method as 'overall'|'fourPillars'|'nineStar'|'reisui';
                          
                          return (
                            <div key={method} className="mb-8 sm:mb-12 last:mb-0">
                              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-1.5 sm:gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 tracking-wider">
                                    {methodLabel}
                                  </span>
                                  <span className="text-[11px] sm:text-xs text-zinc-400">
                                    {method === 'overall' && '各占術を統合した全体バランス'}
                                    {method === 'fourPillars' && '命式と干支の巡りによる鑑定'}
                                    {method === 'nineStar' && '本命星と宮の巡りによる鑑定'}
                                    {method === 'reisui' && '令翠学12年バイオリズムによる鑑定'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50/30">
                                  <CardHeader className="pb-2 pt-4 px-4 sm:pb-3 sm:pt-6 sm:px-6">
                                    <CardTitle className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-purple-600 flex items-center">
                                      <CalendarHeart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> ズバリ！婚期のベストタイミング
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                    <div className="flex items-baseline gap-2 sm:gap-3 mb-2.5 sm:mb-4">
                                      <div className="text-2xl sm:text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        {result.turningPoints[mKey].marriage.year}
                                      </div>
                                      <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-purple-100/80 text-purple-700 font-medium">
                                        {methodLabel}の判定
                                      </span>
                                    </div>
                                    <p className="text-zinc-700 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.turningPoints[mKey].marriage.description}</p>
                                  </CardContent>
                                </Card>
                                
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/30">
                                  <CardHeader className="pb-2 pt-4 px-4 sm:pb-3 sm:pt-6 sm:px-6">
                                    <CardTitle className={`text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center ${isCompatibilityMode ? 'text-rose-600' : 'text-blue-600'}`}>
                                      {isCompatibilityMode ? (
                                        <><AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> ズバリ！別れの危機・要注意時期</>
                                      ) : (
                                        <><Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> ズバリ！仕事運のピーク</>
                                      )}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                                    <div className="flex items-baseline gap-2 sm:gap-3 mb-2.5 sm:mb-4">
                                      <div className="text-2xl sm:text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        {result.turningPoints[mKey].work.year}
                                      </div>
                                      <span className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${isCompatibilityMode ? 'bg-rose-100/80 text-rose-700' : 'bg-blue-100/80 text-blue-700'}`}>
                                        {methodLabel}の{isCompatibilityMode ? '要注意年' : 'ピーク年'}
                                      </span>
                                    </div>
                                    <p className="text-zinc-700 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.turningPoints[mKey].work.description}</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 mt-3.5 sm:mt-6">
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-emerald-50/30 border-b border-emerald-50/50 py-3 px-4 sm:pb-4 sm:px-6">
                                    <CardTitle className="text-base sm:text-lg font-medium text-zinc-800">今年の運気</CardTitle>
                                    <CardDescription className="text-emerald-600/80 text-xs sm:text-sm">{result.fortuneExplanations[mKey].thisYear.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 sm:pt-6 sm:px-6">
                                    <p className="text-zinc-600 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.fortuneExplanations[mKey].thisYear.description}</p>
                                  </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-blue-50/30 border-b border-blue-50/50 py-3 px-4 sm:pb-4 sm:px-6">
                                    <CardTitle className="text-base sm:text-lg font-medium text-zinc-800">来年の運気</CardTitle>
                                    <CardDescription className="text-blue-600/80 text-xs sm:text-sm">{result.fortuneExplanations[mKey].nextYear.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 sm:pt-6 sm:px-6">
                                    <p className="text-zinc-600 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.fortuneExplanations[mKey].nextYear.description}</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 mt-3.5 sm:mt-6">
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-emerald-50/30 border-b border-emerald-50/50 py-3 px-4 sm:pb-4 sm:px-6">
                                    <CardTitle className="text-base sm:text-lg font-medium text-zinc-800">今月の運気</CardTitle>
                                    <CardDescription className="text-emerald-600/80 text-xs sm:text-sm">{result.fortuneExplanations[mKey].thisMonth.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 sm:pt-6 sm:px-6">
                                    <p className="text-zinc-600 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.fortuneExplanations[mKey].thisMonth.description}</p>
                                  </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-blue-50/30 border-b border-blue-50/50 py-3 px-4 sm:pb-4 sm:px-6">
                                    <CardTitle className="text-base sm:text-lg font-medium text-zinc-800">来月の運気</CardTitle>
                                    <CardDescription className="text-blue-600/80 text-xs sm:text-sm">{result.fortuneExplanations[mKey].nextMonth.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 sm:pt-6 sm:px-6">
                                    <p className="text-zinc-600 leading-relaxed sm:leading-loose text-xs sm:text-[15px]">{result.fortuneExplanations[mKey].nextMonth.description}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          );
                        })}
                      </TabsContent>

                      {/* Tab 3: 運気の流れ (Flows) */}
                      <TabsContent value="flows" className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none">
                        
                        <div className="flex justify-center mb-2 shrink-0">
                          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 p-1 rounded-xl flex shadow-2xs max-w-sm w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'reisui', label: '令翠学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'nineStar', label: '九星気学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Card className="border-0 shadow-xs rounded-2xl overflow-hidden bg-white flex-1 min-h-0 flex flex-col">
                          <CardHeader className="border-b border-zinc-100 py-2 sm:py-2.5 px-3 sm:px-4 shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
                              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                <div className="bg-zinc-100/80 p-1 rounded-xl shadow-inner flex">
                                  <button onClick={() => setFlowViewType('graph')} className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center transition-all ${flowViewType === 'graph' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <LineChartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> グラフ表示
                                  </button>
                                  <button onClick={() => setFlowViewType('table')} className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center transition-all ${flowViewType === 'table' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> 詳細スコア
                                  </button>
                                </div>
                                
                                {selectedYearValue !== null && (
                                  <Button variant="outline" size="sm" className="rounded-xl shadow-xs bg-white text-zinc-700 hover:text-zinc-900 border-zinc-200 h-8 text-xs" onClick={() => setSelectedYearValue(null)}>
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 100年運気へ戻る
                                  </Button>
                                )}
                              </div>
                              
                              {flowViewType === 'table' && (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-zinc-50/80 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-zinc-200/60 w-full sm:w-auto">
                                  <div className="flex items-center text-xs text-zinc-500 font-medium ml-1 sm:ml-2">
                                    <Filter className="w-3.5 h-3.5 mr-1 sm:mr-1.5" /> スコア絞り込み
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2">
                                    <Input type="number" value={filterMinScore} onChange={(e) => setFilterMinScore(e.target.value)} className="w-14 sm:w-16 h-7 sm:h-8 text-center text-xs sm:text-sm rounded-lg" />
                                    <span className="text-zinc-400 text-xs">〜</span>
                                    <Input type="number" value={filterMaxScore} onChange={(e) => setFilterMaxScore(e.target.value)} className="w-14 sm:w-16 h-7 sm:h-8 text-center text-xs sm:text-sm rounded-lg" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 年度選択時のナビゲーションバナー */}
                            {selectedYearValue !== null && selectedTargetYearData && (
                              <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/70 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
                                    {selectedYearValue % 100}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                      <span className="text-sm sm:text-base font-bold text-zinc-900">
                                        {selectedYearValue}年 月別バイオリズム
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                        {selectedTargetYearData.age}歳 ・ {fortuneMethod === 'reisui' ? selectedTargetYearData.stageReisui.name : fortuneMethod === 'fourPillars' ? selectedTargetYearData.stageFourPillars.name : fortuneMethod === 'nineStar' ? selectedTargetYearData.stageNineStar.name : selectedTargetYearData.stage.name}
                                      </span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
                                      {selectedYearValue}年の1月〜12月の月別バイオリズムです。
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-2.5 text-xs text-zinc-600 hover:text-zinc-900 bg-white/80 border-zinc-200 shadow-2xs"
                                    onClick={() => setSelectedYearValue(prev => (prev ? prev - 1 : null))}
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> 前年
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-2.5 text-xs text-zinc-600 hover:text-zinc-900 bg-white/80 border-zinc-200 shadow-2xs"
                                    onClick={() => setSelectedYearValue(prev => (prev ? prev + 1 : null))}
                                  >
                                    翌年 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                          </CardHeader>
                          
                          <CardContent className="p-0 relative">
                            {/* グラフ上部コントロールツールバー: 左上に今年ボタン、右上に周期の意味一覧ボタン */}
                            <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-2.5 border-b border-zinc-150 bg-gradient-to-r from-emerald-50/20 via-white to-blue-50/10">
                              {/* 左上: 今年のボタン */}
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={scrollToCurrentYear}
                                  className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-full text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:shadow-xs hover:border-emerald-400 flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all cursor-pointer"
                                  title="現在の年（2026年）をグラフの中央にスクロールします"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>今年</span>
                                </Button>

                                {selectedYearValue !== null && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedYearValue(null)}
                                    className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-full text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                    100年運気へ戻る
                                  </Button>
                                )}
                              </div>

                              {/* 令翠学の場合: 周期の意味一覧ボタン */}
                              {fortuneMethod === 'reisui' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setReisuiCycleInfoOpen(true)}
                                  className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-full text-xs text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 border-emerald-300 font-semibold shadow-2xs hover:shadow-xs hover:border-emerald-400 cursor-pointer flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95 shrink-0"
                                  title="四季と12年の詳細意味一覧を表示"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>周期の意味一覧</span>
                                </Button>
                              )}
                            </div>

                            {flowViewType === 'graph' ? (
                              <div className="w-full relative bg-gradient-to-b from-white to-blue-50/20 pt-1 pb-1">
                                {selectedYearValue === null ? (
                                  <ScrollArea id="fortune-graph-scroll-area" className="w-full">
                                    <div 
                                      style={{ 
                                        width: `${fortuneMethod === 'reisui' ? Math.max(1200, graphData.length * 68) : Math.max(1000, graphData.length * 54)}px`, 
                                        height: fortuneMethod === 'reisui' ? '390px' : '360px' 
                                      }} 
                                      className="px-4"
                                    >
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart 
                                          data={graphData} 
                                          margin={{ 
                                            top: 15, 
                                            right: 30, 
                                            left: 10, 
                                            bottom: fortuneMethod === 'reisui' ? 80 : 20 
                                          }}
                                          onClick={(e: any) => {
                                            if (e && e.activePayload && e.activePayload[0]) {
                                              handleGraphDotClick(e.activePayload[0]);
                                            } else if (e && typeof e.activeTooltipIndex === 'number' && graphData[e.activeTooltipIndex]) {
                                              handleGraphDotClick(graphData[e.activeTooltipIndex]);
                                            }
                                          }}
                                        >
                                          <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor={fortuneMethod === 'reisui' ? '#059669' : '#3b82f6'} stopOpacity={0.25}/>
                                              <stop offset="95%" stopColor={fortuneMethod === 'reisui' ? '#059669' : '#3b82f6'} stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                          <XAxis 
                                            dataKey="periodValue" 
                                            tick={renderYearTick} 
                                            stroke="#a1a1aa" 
                                            tickMargin={12} 
                                            axisLine={false} 
                                            interval={0}
                                          />
                                          <YAxis domain={[0, 105]} hide />
                                          <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: fortuneMethod === 'reisui' ? '#059669' : '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                          
                                          {/* 令翠学の3年周期（四季：冬・春・夏・秋）背景カラーバンド */}
                                          {fortuneMethod === 'reisui' && reisuiSeasonRanges.map((rng, i) => (
                                            <ReferenceArea 
                                              key={`reisui-rng-${i}`} 
                                              x1={rng.startYear} 
                                              x2={rng.endYear} 
                                              fill={rng.color} 
                                              fillOpacity={1} 
                                              stroke={rng.strokeColor}
                                              strokeOpacity={0.4}
                                              label={{
                                                value: rng.seasonLabel,
                                                position: 'insideTop',
                                                fill: rng.textColor,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                dy: 8
                                              }}
                                            />
                                          ))}

                                          {/* 従来占術の充電期ハイライト */}
                                          {fortuneMethod !== 'reisui' && graphData.map((d, i) => (
                                            d.stageName.includes('充電期') && 
                                            <ReferenceArea key={i} x1={d.periodValue} x2={d.periodValue} fill="#f1f5f9" fillOpacity={0.8} />
                                          ))}
                                          
                                          <Line 
                                            type="monotone" 
                                            dataKey="stageScore" 
                                            stroke={fortuneMethod === 'reisui' ? '#059669' : '#3b82f6'} 
                                            strokeWidth={fortuneMethod === 'reisui' ? 3.5 : 4}
                                            dot={renderYearDot}
                                            activeDot={{ 
                                              r: 9, 
                                              fill: fortuneMethod === 'reisui' ? '#047857' : '#2563eb', 
                                              stroke: "#fff", 
                                              strokeWidth: 3, 
                                              cursor: "pointer" 
                                            }}
                                            onClick={handleGraphDotClick}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                  </ScrollArea>
                                ) : (
                                  <ScrollArea className="w-full">
                                    <div className="w-full px-2 sm:px-3 lg:px-6 min-w-[520px]">
                                      <div style={{ width: '100%', height: '360px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                          <LineChart 
                                            data={graphData} 
                                            margin={{ top: 15, right: 25, left: 5, bottom: 15 }}
                                            onClick={(e: any) => {
                                              if (e && e.activePayload && e.activePayload[0]) {
                                                handleGraphDotClick(e.activePayload[0]);
                                              } else if (e && typeof e.activeTooltipIndex === 'number' && graphData[e.activeTooltipIndex]) {
                                                handleGraphDotClick(graphData[e.activeTooltipIndex]);
                                              }
                                            }}
                                          >
                                            <defs>
                                              <linearGradient id="colorMonthScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={fortuneMethod === 'reisui' ? '#059669' : '#f59e0b'} stopOpacity={0.25}/>
                                                <stop offset="95%" stopColor={fortuneMethod === 'reisui' ? '#059669' : '#f59e0b'} stopOpacity={0}/>
                                              </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                            <XAxis dataKey="periodValue" tickFormatter={(v) => `${v}月`} stroke="#71717a" tick={{ fontSize: 12, fontWeight: 500 }} tickMargin={10} axisLine={false} />
                                            <YAxis domain={[0, 105]} stroke="#a1a1aa" tick={{ fontSize: 10 }} tickCount={6} axisLine={false} />
                                            <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: fortuneMethod === 'reisui' ? '#059669' : '#f59e0b', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                            
                                            {/* 令翠学の月別四季背景バンド */}
                                            {fortuneMethod === 'reisui' && reisuiSeasonRanges.map((rng, i) => (
                                              <ReferenceArea 
                                                key={`reisui-month-rng-${i}`} 
                                                x1={rng.startYear} 
                                                x2={rng.endYear} 
                                                fill={rng.color} 
                                                fillOpacity={0.9} 
                                                stroke={rng.strokeColor}
                                                strokeOpacity={0.3}
                                              />
                                            ))}

                                            {fortuneMethod !== 'reisui' && graphData.map((d, i) => (
                                              d.stageName.includes('充電期') && 
                                              <ReferenceArea key={i} x1={d.periodValue} x2={d.periodValue} fill="#fffbeb" fillOpacity={0.6} />
                                            ))}
                                            
                                            <Line 
                                              type="monotone" 
                                              dataKey="stageScore" 
                                              stroke={fortuneMethod === 'reisui' ? '#059669' : '#f59e0b'} 
                                              strokeWidth={4}
                                              dot={renderMonthDot}
                                              activeDot={{ 
                                                r: 10, 
                                                fill: fortuneMethod === 'reisui' ? '#047857' : '#d97706', 
                                                stroke: "#fff", 
                                                strokeWidth: 3, 
                                                cursor: "pointer" 
                                              }}
                                              onClick={handleGraphDotClick}
                                            />
                                          </LineChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                  </ScrollArea>
                                )}
                              </div>
                            ) : (
                              <ScrollArea className="w-full h-[380px] bg-zinc-50/30">
                                <Table className="min-w-[520px]">
                                  <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-zinc-200 shadow-sm">
                                    <TableRow className="hover:bg-transparent">
                                      <TableHead className="w-[140px] pl-6 lg:pl-8 py-5 text-xs font-semibold text-zinc-500 uppercase tracking-widest">{selectedYearValue === null ? '年' : '月'}</TableHead>
                                      <TableHead className="text-center py-5"><div className="flex flex-col items-center gap-1.5"><Heart className="w-4 h-4 text-rose-400" /><span className="text-[11px] font-medium text-zinc-500">恋愛・関係</span></div></TableHead>
                                      <TableHead className="text-center py-5"><div className="flex flex-col items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-400" /><span className="text-[11px] font-medium text-zinc-500">仕事・協力</span></div></TableHead>
                                      <TableHead className="text-center py-5"><div className="flex flex-col items-center gap-1.5"><Home className="w-4 h-4 text-emerald-400" /><span className="text-[11px] font-medium text-zinc-500">家庭・絆</span></div></TableHead>
                                      <TableHead className="text-center py-5"><div className="flex flex-col items-center gap-1.5"><CalendarHeart className="w-4 h-4 text-purple-400" /><span className="text-[11px] font-medium text-zinc-500">婚期・結実</span></div></TableHead>
                                      <TableHead className="text-center py-5 pr-6 lg:pr-8"><div className="flex flex-col items-center gap-1.5"><Activity className="w-4 h-4 text-orange-400" /><span className="text-[11px] font-medium text-zinc-500">健康・余裕</span></div></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {filteredFlowDataList.map((t, idx) => (
                                      <TableRow key={idx} className="border-b border-zinc-100/50 hover:bg-white transition-colors bg-white/40">
                                        <TableCell 
                                          className={`pl-6 lg:pl-8 py-4 font-medium text-[15px] ${selectedYearValue === null ? 'cursor-pointer hover:text-blue-600 underline-offset-4 hover:underline' : 'text-zinc-700'}`}
                                          onClick={() => {
                                            if (selectedYearValue === null) setSelectedYearValue(t.periodValue);
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span>{t.period} <span className="text-xs text-zinc-400 font-normal ml-1">({isCompatibilityMode ? `${name} ${t.age}歳` : `${t.age}歳`})</span></span>
                                            {selectedYearValue === null && <span className="text-[10px] text-blue-500 mt-1 font-semibold">{fortuneMethod === 'reisui' ? t.stageReisui.name : fortuneMethod === 'fourPillars' ? t.stageFourPillars.name : fortuneMethod === 'nineStar' ? t.stageNineStar.name : t.stage.name}</span>}
                                          </div>
                                        </TableCell>
                                        {renderScoreCell('恋愛', t.romance, t.period, t)}
                                        {renderScoreCell('仕事', t.work, t.period, t)}
                                        {renderScoreCell('家庭', t.family, t.period, t)}
                                        {renderScoreCell('婚期', t.marriage, t.period, t)}
                                        {renderScoreCell('健康', t.health, t.period, t)}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </>
                  )}

                  {/* Tab 4: 鑑定記録 (Records) */}
              <TabsContent value="records" className="flex-1 min-h-0 overflow-y-visible lg:overflow-y-auto space-y-2 pr-0 lg:pr-1 outline-none animate-in fade-in duration-300">
                {(() => {
                  const activeCustomer = customers?.find(c => c.id === activeCustomerId);
                  const targetName = activeCustomer ? activeCustomer.name : name;
                  return (
                    <>
                      <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-zinc-50/70 border-b border-zinc-100 py-2.5 px-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-sm font-semibold text-zinc-800 flex items-center" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            <Mic className="w-4 h-4 text-amber-500 mr-1.5" /> 鑑定記録 {targetName ? `（${targetName} 様）` : ''}
                          </CardTitle>
                          {isRecording ? (
                            <Button onClick={stopRecording} variant="destructive" className="h-7 px-3 rounded-lg shadow-2xs font-medium animate-pulse text-xs">
                              <StopCircle className="w-3.5 h-3.5 mr-1" /> 録音停止
                            </Button>
                          ) : (
                            <Button onClick={startRecording} className="h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-2xs font-medium text-xs">
                              <Mic className="w-3.5 h-3.5 mr-1" /> 記録開始
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="p-3.5">
                          {isRecording || liveTranscript ? (
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`}></span>
                                <span className="text-xs font-medium text-zinc-500">{isRecording ? '録音中...' : '録音停止中'}</span>
                              </div>
                              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 min-h-[100px] max-h-[220px] overflow-y-auto">
                                <p className="text-zinc-700 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">{liveTranscript || '（音声を聞き取っています...）'}</p>
                              </div>
                              {!isRecording && liveTranscript && (
                                <div className="flex justify-end mt-2">
                                  <Button onClick={() => saveTranscriptToCustomer(false)} className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs text-xs font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {targetName ? `${targetName} 様の記録として保存` : 'この記録を保存する'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-zinc-400 flex flex-col items-center">
                              <MicOff className="w-8 h-8 mb-2 text-zinc-300" strokeWidth={1} />
                              <p className="text-xs sm:text-sm">「記録開始」ボタンを押すと、マイクから音声を拾って文字起こしを行います。</p>
                              {!targetName && (
                                <p className="text-[11px] mt-2 text-amber-600/80">※保存するには左側のフォームでお名前をご入力ください</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                        </>
                      );
                    })()}
                  </TabsContent>
                    </Tabs>
                  </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="flex-1 min-h-0 flex flex-col focus-visible:outline-none m-0 overflow-hidden animate-in fade-in duration-300">
            <Card className="border-0 shadow-2xs rounded-2xl overflow-hidden bg-white flex-1 min-h-0 flex flex-col">
              <CardHeader className="border-b border-zinc-100 py-2.5 px-4 flex flex-row items-center justify-between gap-4 shrink-0">
                <CardTitle className="text-base font-semibold text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                  顧客一覧
                </CardTitle>
                <Button onClick={openNewCustomerDialog} className="h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-2xs text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> 新規追加
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
                {/* モバイル向けカード表示 (md未満) */}
                <div className="block md:hidden divide-y divide-zinc-100 p-2.5 space-y-2.5">
                  {customers?.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 text-xs">顧客データが登録されていません</div>
                  ) : (
                    customers?.map((customer) => (
                      <div key={`m-${customer.id}`} className="bg-white p-3.5 rounded-xl border border-zinc-150 shadow-2xs space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-zinc-900 text-sm">{customer.name}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                              <span>{customer.birthdate}</span>
                              <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                              <span>{customer.gender === 'female' ? '女性' : customer.gender === 'male' ? '男性' : customer.gender === 'other' ? 'その他' : '-'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg w-7 h-7" onClick={() => openEditCustomerDialog(customer)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg w-7 h-7" onClick={(e) => { e.stopPropagation(); if (customer.id) requestDeleteCustomer(customer.id); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-zinc-100/80">
                          {isCompatibilityMode ? (
                            <>
                              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-amber-700 bg-amber-50/70 border-amber-200 hover:bg-amber-100 rounded-lg font-medium" onClick={() => loadCustomerToFortune(customer, 1)}>
                                1人目 <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-rose-700 bg-rose-50/70 border-rose-200 hover:bg-rose-100 rounded-lg font-medium" onClick={() => loadCustomerToFortune(customer, 2)}>
                                2人目 <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-amber-800 bg-amber-500/10 border-amber-300 hover:bg-amber-500/20 rounded-lg font-semibold" onClick={() => loadCustomerToFortune(customer, 1)}>
                              鑑定する <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-medium" onClick={() => viewCustomerRecords(customer)}>
                            <Mic className="w-3 h-3 mr-1" /> 記録 ({customer.records?.length || 0})
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* iPad/PC向けテーブル表示 (md以上) */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-100 hover:bg-transparent bg-zinc-50/50">
                        <TableHead className="pl-4 py-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">お名前</TableHead>
                        <TableHead className="py-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">生年月日</TableHead>
                        <TableHead className="py-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">性別</TableHead>
                        <TableHead className="text-right pr-4 py-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers?.map((customer) => (
                        <TableRow key={customer.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                          <TableCell className="pl-4 py-2 font-medium text-zinc-800 text-xs sm:text-sm">{customer.name}</TableCell>
                          <TableCell className="py-2 text-zinc-500 text-xs sm:text-sm">{customer.birthdate}</TableCell>
                          <TableCell className="py-2 text-zinc-500 text-xs">{customer.gender === 'female' ? '女性' : customer.gender === 'male' ? '男性' : customer.gender === 'other' ? 'その他' : '-'}</TableCell>
                          <TableCell className="text-right pr-4 py-2">
                            <div className="flex justify-end gap-1 items-center">
                              {isCompatibilityMode ? (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50 rounded-md" onClick={() => loadCustomerToFortune(customer, 1)}>
                                    1人目 <ArrowRight className="w-3 h-3 ml-0.5" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md" onClick={() => loadCustomerToFortune(customer, 2)}>
                                    2人目 <ArrowRight className="w-3 h-3 ml-0.5" />
                                  </Button>
                                </>
                              ) : (
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50 rounded-md" onClick={() => loadCustomerToFortune(customer, 1)}>
                                  占う <ArrowRight className="w-3 h-3 ml-0.5" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-50 rounded-md" onClick={() => viewCustomerRecords(customer)}>
                                <Mic className="w-3 h-3 mr-0.5" /> 記録 ({customer.records?.length || 0})
                              </Button>
                              <div className="w-[1px] h-3 bg-zinc-200 mx-0.5"></div>
                              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md w-7 h-7" onClick={() => openEditCustomerDialog(customer)}>
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md w-7 h-7" onClick={(e) => { e.stopPropagation(); if (customer.id) requestDeleteCustomer(customer.id); }}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </Tabs>

      {/* Score Details Dialog */}
      <Dialog open={scoreDetailOpen} onOpenChange={setScoreDetailOpen}>
        <DialogContent className="w-[94vw] max-w-[500px] max-h-[88vh] overflow-y-auto rounded-[24px] border-0 shadow-[0_20px_50px_rgb(0,0,0,0.1)] p-0">
          {selectedScoreInfo && (
            <>
              <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-zinc-100 bg-blue-50/30">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">{selectedScoreInfo.period} {selectedScoreInfo.age !== undefined && `(${isCompatibilityMode ? name + ' ' : ''}${selectedScoreInfo.age}歳)`}</p>
                    <DialogTitle className="text-xl sm:text-2xl font-normal text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                      {selectedScoreInfo.categoryName} {selectedScoreInfo.stageName && <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-zinc-500 font-medium">({selectedScoreInfo.stageName})</span>}
                    </DialogTitle>
                  </div>
                  <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm border border-zinc-100 flex flex-col items-center shrink-0">
                    <span className="text-[10px] sm:text-xs text-zinc-400 font-semibold mb-0.5">スコア</span>
                    <span className="text-2xl sm:text-3xl font-bold text-blue-500 leading-none">{selectedScoreInfo.score.value}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-8 space-y-5 sm:space-y-8 bg-white">
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-blue-500 pl-2.5 sm:pl-3">時期の詳細</h4>
                  <p className="text-zinc-600 leading-relaxed text-xs sm:text-[15px]">{selectedScoreInfo.score.detail}</p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-rose-400 pl-2.5 sm:pl-3">気を付ける事</h4>
                  <p className="text-zinc-600 leading-relaxed text-xs sm:text-[15px]">{selectedScoreInfo.score.caution}</p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-emerald-400 pl-2.5 sm:pl-3">やると良いこと</h4>
                  <p className="text-zinc-600 leading-relaxed text-xs sm:text-[15px]">{selectedScoreInfo.score.recommendation}</p>
                </div>
              </div>
              <div className="px-5 sm:px-8 py-3.5 sm:py-5 bg-zinc-50 border-t border-zinc-100">
                <Button className="w-full rounded-xl h-10 sm:h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm" onClick={() => setScoreDetailOpen(false)}>閉じる</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="w-[92vw] max-w-[425px] rounded-[24px]">
          <DialogTitle className="text-lg sm:text-xl font-normal text-zinc-800 mb-2 sm:mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            顧客データの削除
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-zinc-600">本当にこの顧客データを削除しますか？<br />この操作は取り消せません。</p>
            <div className="flex justify-end gap-2.5 sm:gap-3 mt-4 sm:mt-6">
              <Button variant="outline" className="rounded-xl border-zinc-200 h-9 sm:h-10 text-xs sm:text-sm" onClick={() => setDeleteConfirmOpen(false)}>キャンセル</Button>
              <Button onClick={confirmDeleteCustomer} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9 sm:h-10 text-xs sm:text-sm">削除する</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Form Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="w-[94vw] max-w-[425px] max-h-[90vh] overflow-y-auto rounded-[24px]">
          <DialogTitle className="text-lg sm:text-xl font-normal text-zinc-800 mb-2 sm:mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            {editingCustomerId ? '顧客情報の編集' : '新規顧客の追加'}
          </DialogTitle>
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">お名前</Label>
              <Input placeholder="例: 山田 花子" value={cName} onChange={(e) => setCName(e.target.value)} className="rounded-xl h-9 sm:h-10 text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">生年月日</Label>
              <div className="grid grid-cols-3 gap-2">
                <YearPicker value={cBYear} onChange={setCBYear} years={years} className="h-9 sm:h-10 py-2 px-3 text-sm" />
                <Select value={cBMonth} onValueChange={(val) => setCBMonth(val || '')}>
                  <SelectTrigger className="rounded-xl h-9 sm:h-10 text-sm"><SelectValue placeholder="月" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={cBDay} onValueChange={(val) => setCBDay(val || '')}>
                  <SelectTrigger className="rounded-xl h-9 sm:h-10 text-sm"><SelectValue placeholder="日" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">性別 (任意)</Label>
              <Select value={cGender} onValueChange={(val) => setCGender(val || '')}>
                <SelectTrigger className="rounded-xl h-9 sm:h-10 text-sm"><SelectValue placeholder="選択" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white mt-3 sm:mt-4 h-10 sm:h-11 text-xs sm:text-sm" onClick={saveCustomer} disabled={!cName || !cBYear || !cBMonth || !cBDay}>
              保存する
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Move Record Dialog */}
      <Dialog open={isMoveRecordDialogOpen} onOpenChange={setIsMoveRecordDialogOpen}>
        <DialogContent className="w-[92vw] max-w-[425px] rounded-[24px]">
          <DialogTitle className="text-lg sm:text-xl font-normal text-zinc-800 mb-2 sm:mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            鑑定記録の移動
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-zinc-500">この記録を他のお客様に紐づけ直します。移動先のお客様を選択してください。</p>
            <Select value={targetMoveCustomerId} onValueChange={(val) => setTargetMoveCustomerId(val || '')}>
              <SelectTrigger className="w-full rounded-xl h-10 text-sm">
                <SelectValue placeholder="移動先のお客様を選択" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {customers?.filter(c => c.id !== recordToMove?.customerId).map(c => (
                  <SelectItem key={c.id} value={c.id!.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2.5 sm:gap-3 mt-4 sm:mt-6">
              <Button variant="outline" className="rounded-xl border-zinc-200 h-9 sm:h-10 text-xs sm:text-sm" onClick={() => setIsMoveRecordDialogOpen(false)}>キャンセル</Button>
              <Button onClick={handleMoveRecord} disabled={!targetMoveCustomerId} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-9 sm:h-10 text-xs sm:text-sm">移動する</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="w-[94vw] max-w-[425px] rounded-[24px]">
          <DialogTitle className="flex items-center text-lg sm:text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            <Key className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
            APIキーの設定
          </DialogTitle>
          <div className="py-4 sm:py-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              要約やメッセージ作成などのAI機能を利用するには、Google Gemini APIキーが必要です。<br />
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Google AI Studio</a>から取得してください。
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-zinc-700">Gemini API Key</label>
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-10 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 sm:gap-3 mt-2">
            <Button variant="outline" className="rounded-xl border-zinc-200 h-9 sm:h-10 text-xs sm:text-sm" onClick={() => setIsApiKeyDialogOpen(false)}>キャンセル</Button>
            <Button onClick={saveApiKey} disabled={!tempApiKey.trim()} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-9 sm:h-10 text-xs sm:text-sm">保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Records List Dialog */}
      <Dialog open={isRecordsListDialogOpen} onOpenChange={setIsRecordsListDialogOpen}>
        <DialogContent className="w-[96vw] max-w-5xl h-[90vh] md:h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-zinc-50 border-0 shadow-2xl">
          <DialogTitle className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
            <span className="flex items-center font-medium text-zinc-800 text-sm sm:text-base" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mr-2" />
              {customers?.find(c => c.id === recordsListCustomerId)?.name} 様の鑑定記録
            </span>
          </DialogTitle>
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Sidebar: List of dates */}
            <div className="w-full md:w-[32%] lg:w-[30%] max-h-[140px] md:max-h-none border-b md:border-b-0 md:border-r border-zinc-100 overflow-y-auto bg-white/70 backdrop-blur flex flex-col shrink-0">
              {(() => {
                const activeRecordsCustomer = customers?.find(c => c.id === recordsListCustomerId);
                if (!activeRecordsCustomer?.records?.length) {
                  return (
                    <div className="p-4 sm:p-8 text-center text-zinc-400 text-xs sm:text-sm flex flex-col items-center justify-center h-full">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-20" />
                      記録がありません
                    </div>
                  );
                }
                return activeRecordsCustomer.records.slice().reverse().map((record) => (
                  <button 
                    key={record.id}
                    onClick={() => {
                      setSelectedRecordIdInDialog(record.id);
                      setEditingRecordId(null);
                    }}
                    className={`text-left px-3.5 sm:px-5 py-2.5 sm:py-4 border-b border-zinc-100 hover:bg-white transition-all ${selectedRecordIdInDialog === record.id ? 'bg-white shadow-[inset_4px_0_0_0_#f59e0b]' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className={`flex items-center text-xs sm:text-sm font-semibold ${selectedRecordIdInDialog === record.id ? 'text-amber-600' : 'text-zinc-700'}`}>
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 opacity-50" />
                      {new Date(record.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-[11px] sm:text-[13px] font-medium text-zinc-400 mt-0.5 sm:mt-1 pl-5 sm:pl-6">
                      {new Date(record.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {record.partnerName && (
                      <div className="text-[11px] sm:text-[12px] font-medium text-amber-600 mt-0.5 sm:mt-1 pl-5 sm:pl-6 flex items-center gap-1">
                        <HeartHandshake className="w-3 h-3" />
                        {record.partnerName}様との相性
                      </div>
                    )}
                  </button>
                ));
              })()}
            </div>

            {/* Right Content: Selected Record Details */}
            <div className="flex-1 w-full md:w-[68%] lg:w-[70%] overflow-y-auto bg-white p-3.5 sm:p-6 lg:p-8">
              {(() => {
                const activeRecordsCustomer = customers?.find(c => c.id === recordsListCustomerId);
                if (!selectedRecordIdInDialog || !activeRecordsCustomer?.records) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-8">
                      <MicOff className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-100 mb-4 sm:mb-6" strokeWidth={1} />
                      <p className="text-xs sm:text-[15px]">リストから記録を選択してください</p>
                    </div>
                  );
                }
                const record = activeRecordsCustomer.records.find(r => r.id === selectedRecordIdInDialog);
                if (!record) return null;

                return (
                  <div className="h-full flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-zinc-100 gap-2 sm:gap-4">
                      <div className="flex flex-col gap-0.5 sm:gap-1">
                        <div className="flex items-center text-zinc-700 font-medium text-base sm:text-lg" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                          {new Date(record.date).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {record.partnerName && (
                          <div className="flex items-center text-amber-600 font-medium text-xs sm:text-[15px]" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
                            {record.partnerName}様との相性鑑定
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-7 sm:h-8 text-xs sm:text-[13px] rounded-lg px-2 sm:px-3" onClick={() => requireApiKey(() => generateSummary(activeRecordsCustomer.id!, record.id, record.content))} disabled={isGeneratingText}>
                          <Wand2 className={`w-3.5 h-3.5 mr-1 sm:mr-1.5 ${isGeneratingText ? 'animate-pulse' : ''}`} /> 要約
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-7 sm:h-8 text-xs sm:text-[13px] rounded-lg px-2 sm:px-3" onClick={() => requireApiKey(() => generateMessage(activeRecordsCustomer.id!, record.id, record.content, activeRecordsCustomer.name))} disabled={isGeneratingText}>
                          <MessageSquare className={`w-3.5 h-3.5 mr-1 sm:mr-1.5 ${isGeneratingText ? 'animate-pulse' : ''}`} /> メッセージ
                        </Button>
                        <div className="w-[1px] h-3.5 bg-zinc-200 mx-0.5"></div>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-7 sm:h-8 text-xs sm:text-[13px] rounded-lg px-2 sm:px-3" onClick={() => {
                          setEditingRecordId(record.id);
                          setEditingRecordContent(record.content);
                          setEditingRecordSummary(record.summary || '');
                          setEditingRecordPostMessage(record.postMessage || '');
                        }}>
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> 編集
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-7 sm:h-8 text-xs sm:text-[13px] rounded-lg px-2 sm:px-3" onClick={() => {
                          setRecordToMove({ customerId: activeRecordsCustomer.id!, recordId: record.id, recordContent: record.content, recordDate: record.date.toString() });
                          setTargetMoveCustomerId('');
                          setIsMoveRecordDialogOpen(true);
                        }}>
                          <ArrowRightLeft className="w-3.5 h-3.5 mr-1" /> 移動
                        </Button>
                        <div className="w-[1px] h-3.5 bg-zinc-200 mx-0.5"></div>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-red-600 hover:bg-red-50 h-7 sm:h-8 text-xs sm:text-[13px] rounded-lg px-2 sm:px-3" onClick={() => {
                          deleteRecord(activeRecordsCustomer.id!, record.id);
                          setSelectedRecordIdInDialog(null);
                        }}>
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> 削除
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 pb-6 overflow-y-auto pr-1">
                      {editingRecordId === record.id ? (
                        <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
                          {record.postMessage !== undefined && (
                            <div className="space-y-1.5 sm:space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-zinc-700 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-amber-500" />鑑定後メッセージ</label>
                              <textarea value={editingRecordPostMessage} onChange={e => setEditingRecordPostMessage(e.target.value)} className="w-full min-h-[120px] sm:min-h-[150px] p-3 sm:p-4 text-xs sm:text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                            </div>
                          )}
                          {record.summary !== undefined && (
                            <div className="space-y-1.5 sm:space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-zinc-700 flex items-center gap-1.5"><Wand2 className="w-4 h-4 text-amber-500" />要約</label>
                              <textarea value={editingRecordSummary} onChange={e => setEditingRecordSummary(e.target.value)} className="w-full min-h-[120px] sm:min-h-[150px] p-3 sm:p-4 text-xs sm:text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                            </div>
                          )}
                          <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
                            <label className="text-xs sm:text-sm font-medium text-zinc-700 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-500" />原文 (鑑定記録)</label>
                            <textarea value={editingRecordContent} onChange={e => setEditingRecordContent(e.target.value)} className="flex-1 w-full min-h-[220px] sm:min-h-[300px] p-3 sm:p-4 text-xs sm:text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                          </div>
                          <div className="flex justify-end gap-2.5 sm:gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditingRecordId(null)} className="rounded-xl px-4 sm:px-6 h-9 sm:h-11 text-xs sm:text-sm border-zinc-200">キャンセル</Button>
                            <Button onClick={() => saveEditedRecord(activeRecordsCustomer.id!, record.id)} className="rounded-xl px-4 sm:px-6 h-9 sm:h-11 text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white font-medium">保存する</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
                          {record.postMessage && (
                            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 sm:p-5 relative group">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <h4 className="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 鑑定後メッセージ</h4>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-700 hover:bg-amber-100 hover:text-amber-800 px-2 sm:px-3" onClick={() => handleCopyRecord(record.postMessage!)}>
                                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> コピー
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 px-2" onClick={() => deleteRecordField(activeRecordsCustomer.id!, record.id, 'postMessage')}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-zinc-800 leading-relaxed sm:leading-loose text-xs sm:text-[14px] whitespace-pre-wrap">{record.postMessage}</div>
                            </div>
                          )}
                          {record.summary && (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 sm:p-5 relative group">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <h4 className="text-xs sm:text-sm font-bold text-blue-800 flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 要約</h4>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-2 sm:px-3" onClick={() => handleCopyRecord(record.summary!)}>
                                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> コピー
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 px-2" onClick={() => deleteRecordField(activeRecordsCustomer.id!, record.id, 'summary')}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-zinc-800 leading-relaxed sm:leading-loose text-xs sm:text-[14px] whitespace-pre-wrap">{record.summary}</div>
                            </div>
                          )}
                          <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 sm:p-5 relative group shadow-sm">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" /> 原文 (鑑定記録)</h4>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 px-2 sm:px-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={() => handleCopyRecord(record.content)}>
                                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> コピー
                              </Button>
                            </div>
                            <div className="text-zinc-700 leading-relaxed sm:leading-loose text-xs sm:text-[15px] whitespace-pre-wrap">{record.content}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 令翠学 運命周期図 詳細ダイアログ */}
      <Dialog open={reisuiCycleInfoOpen} onOpenChange={setReisuiCycleInfoOpen}>
        <DialogContent className="w-[94vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-emerald-150">
          <DialogTitle className="text-base sm:text-lg font-bold text-emerald-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              令翠学 運命周期図（3年周期・四季の巡り）
            </span>
          </DialogTitle>
          <p className="text-[11px] sm:text-xs text-zinc-600 -mt-1 sm:-mt-2">
            令翠学では12年（四季×3年）で運気がひと巡りします。各時期の意味と冬支度の教えです。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-3">
            {/* 冬 */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                  ❄️ 冬（忍耐の3年間）
                </span>
                <span className="text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded-full font-semibold border border-blue-200">休息・準備</span>
              </div>
              <div className="space-y-1 sm:space-y-1.5 text-xs text-zinc-700">
                <div><strong className="text-blue-950">背信</strong>：裏目・裏切り（冬支度・慎重に）</div>
                <div><strong className="text-blue-950">令</strong>：無・玄（運気胎蔵・エネルギー充電）</div>
                <div><strong className="text-blue-950">精算</strong>：心の準備・過去の整理・新たな夜明け前</div>
              </div>
            </div>

            {/* 春 */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  🌱 春（努力の3年間）
                </span>
                <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-full font-bold border border-emerald-200">上昇期</span>
              </div>
              <div className="space-y-1 sm:space-y-1.5 text-xs text-zinc-700">
                <div><strong className="text-emerald-950">開拓</strong>：新規スタート・種まき</div>
                <div><strong className="text-emerald-950">生長</strong>：行動・実行・水まき</div>
                <div><strong className="text-emerald-950">決定</strong>：見通し・方針・決断</div>
              </div>
            </div>

            {/* 夏 */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  ☀️ 夏（願望の3年間）
                </span>
                <span className="text-[10px] text-amber-700 bg-white px-2 py-0.5 rounded-full font-semibold border border-amber-200">開花期</span>
              </div>
              <div className="space-y-1 sm:space-y-1.5 text-xs text-zinc-700">
                <div><strong className="text-amber-950">健康</strong>：精神面・トラブル要注意（小休止）</div>
                <div><strong className="text-amber-950">人気</strong>：願望達成・開花（努力ある者に成果）</div>
                <div><strong className="text-amber-950">油断</strong>：浮足立つ・落花に注意</div>
              </div>
            </div>

            {/* 秋 */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-yellow-50/80 border border-yellow-200/80">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-bold text-yellow-950 flex items-center gap-1.5">
                  🌾 秋（結実の3年間）
                </span>
                <span className="text-[10px] text-yellow-800 bg-white px-2 py-0.5 rounded-full font-semibold border border-yellow-200">収穫期</span>
              </div>
              <div className="space-y-1 sm:space-y-1.5 text-xs text-zinc-700">
                <div><strong className="text-yellow-950">再開</strong>：再生・再会・再構築</div>
                <div><strong className="text-yellow-950">経済</strong>：結果・収穫・財運</div>
                <div><strong className="text-yellow-950">充実</strong>：完成・成功（冬支度を始める）</div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] sm:text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-800">💡 冬支度について：</span>
            秋の「充実」から冬の「背信」へと向かう時期は、次の「春」に芽吹くための準備（冬支度）を行う大切な転換期です。
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
