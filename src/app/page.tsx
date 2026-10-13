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
import { Sparkles, Users, ArrowRight, Heart, Briefcase, Home, CalendarHeart, Activity, BookOpen, ActivitySquare, ArrowLeft, ChevronLeft, ChevronRight, Filter, LineChart as LineChartIcon, Table as TableIcon, HeartHandshake, AlertTriangle, Plus, Edit2, Trash2, MessageCircle, Mic, MicOff, StopCircle, Clock, CheckCircle2, ArrowRightLeft, Copy, Wand2, MessageSquare, Key } from 'lucide-react';
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
      const res = calculateFortune(birthdate, name);
      setResult(res);
      setCompResult(null);
      setResultTab('nature');
    }
    
    setSelectedYearValue(null);
    setFlowViewType('graph');
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
        stageName: stage.name
      };
    });
  }, [result, selectedYearValue, isCompatibilityMode, name, fortuneMethod]);

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

  useEffect(() => {
    if (flowViewType === 'graph' && graphData.length > 0) {
      if (selectedYearValue === null) {
        const currentIndex = graphData.findIndex(y => y.periodValue === currentYear);
        if (currentIndex > -1) {
          const offset = currentIndex * 60;
          setTimeout(() => {
            const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
              viewport.scrollTo({ left: Math.max(0, offset - 300), behavior: 'smooth' });
            }
          }, 500);
        }
      } else {
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }
  }, [flowViewType, selectedYearValue, graphData, currentYear]);

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
      const data = payload[0].payload as PeriodData;
      let stage = data.stage;
      if (fortuneMethod === 'reisui') stage = data.stageReisui;
      else if (fortuneMethod === 'fourPillars') stage = data.stageFourPillars;
      else if (fortuneMethod === 'nineStar') stage = data.stageNineStar;
      
      const periodTitle = selectedYearValue === null 
        ? `${data.period} ${isCompatibilityMode ? '' : `(${data.age}歳)`}`
        : `${selectedYearValue}年 ${data.period} ${isCompatibilityMode ? '' : `(${data.age}歳)`}`;

      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 min-w-[210px]">
          <p className="text-xs text-zinc-400 font-medium mb-1">{periodTitle}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-blue-600">{stage.name}</span>
            <span className="text-sm font-semibold text-zinc-500">({stage.score}点)</span>
          </div>
          <p className="text-xs text-zinc-600 mb-3">{stage.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-100">
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '協力' : '仕事'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.work.value}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '結実' : '婚期'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.marriage.value}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '関係' : '恋愛'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.romance.value}</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-50 px-2 py-1 rounded">
               <span className="text-[10px] text-zinc-500">{isCompatibilityMode ? '余裕' : '健康'}</span>
               <span className="text-xs font-bold text-zinc-700">{data.health.value}</span>
             </div>
          </div>
           <button
            type="button"
            className="w-full text-[11px] font-semibold text-blue-600 mt-3 text-center bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg border border-blue-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
      </g>
    );
  };

  const renderYearDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (typeof cx !== 'number' || typeof cy !== 'number') return null;
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
    return (
      <circle
        key={`mdot-${payload?.periodValue}`}
        cx={cx}
        cy={cy}
        r={7}
        fill="#ffffff"
        stroke="#f59e0b"
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
    <div className="min-h-screen bg-zinc-50/50 text-zinc-800 font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">
      <header className="pt-16 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-normal text-zinc-800 tracking-wide mb-3" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
          Fortune Teller
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-amber-200"></div>
          <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase">四柱推命・バイオリズム</p>
          <div className="h-[1px] w-8 bg-amber-200"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white p-1 rounded-full shadow-sm border border-zinc-200/60">
              <TabsTrigger value="fortune" className="rounded-full px-8 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-md text-zinc-500">
                <Sparkles className="w-4 h-4 mr-2" /> 鑑定
              </TabsTrigger>
              <TabsTrigger value="customers" className="rounded-full px-8 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-md text-zinc-500">
                <Users className="w-4 h-4 mr-2" /> 顧客一覧
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fortune" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Input Section - Left Column */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* クイック録音開始ボタン */}
                {isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" className="w-full h-12 rounded-xl shadow-sm font-medium animate-pulse text-base">
                    <StopCircle className="w-5 h-5 mr-2" /> 録音停止
                  </Button>
                ) : (
                  <Button onClick={startRecording} className="w-full h-12 bg-white hover:bg-zinc-50 text-amber-600 border border-amber-200 hover:border-amber-300 rounded-xl shadow-sm font-semibold text-base transition-all">
                    <Mic className="w-5 h-5 mr-2" /> 鑑定の記録を開始
                  </Button>
                )}

                {/* 診断モード切替 */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-zinc-900/5 p-1.5 rounded-2xl flex shadow-sm">
                  <button 
                    onClick={() => setIsCompatibilityMode(false)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${!isCompatibilityMode ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'}`}
                  >
                    一人を占う
                  </button>
                  <button 
                    onClick={() => setIsCompatibilityMode(true)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${isCompatibilityMode ? 'bg-rose-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'}`}
                  >
                    <HeartHandshake className="w-4 h-4" /> 相性を占う
                  </button>
                </div>

                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-zinc-900/5 transition-all">
                  <CardHeader className="bg-white/50 border-b border-zinc-100/50 pb-5 pt-6 px-6">
                    <CardTitle className="text-lg font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                      {isCompatibilityMode ? 'あなた（1人目）' : '対象者情報'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-5 px-6 pb-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">お名前</Label>
                      <Input placeholder="例: 山田 花子" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-zinc-200 focus-visible:ring-amber-500/20 h-11 px-4 rounded-xl shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">生年月日</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <YearPicker value={bYear} onChange={setBYear} years={years} className="h-11 px-4 w-full" />
                        <Select value={bMonth} onValueChange={(val) => setBMonth(val || '')}>
                          <SelectTrigger className="w-full bg-white border-zinc-200 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="月" /></SelectTrigger>
                          <SelectContent className="rounded-xl max-h-[300px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={bDay} onValueChange={(val) => setBDay(val || '')}>
                          <SelectTrigger className="w-full bg-white border-zinc-200 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="日" /></SelectTrigger>
                          <SelectContent className="rounded-xl max-h-[300px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">性別 (任意)</Label>
                      <Select value={gender} onValueChange={(val) => setGender(val || '')}>
                        <SelectTrigger className="bg-white border-zinc-200 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="選択" /></SelectTrigger>
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
                  <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-rose-50/60 backdrop-blur-xl border border-white/40 ring-1 ring-rose-900/5 transition-all animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="bg-rose-100/50 border-b border-rose-200/50 pb-5 pt-6 px-6">
                      <CardTitle className="text-lg font-medium text-rose-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                        お相手（2人目）
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5 px-6 pb-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-semibold text-rose-600/70 uppercase tracking-wider">お名前</Label>
                        <Input placeholder="例: 鈴木 太郎" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="bg-white border-rose-100 focus-visible:ring-rose-500/20 h-11 px-4 rounded-xl shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-semibold text-rose-600/70 uppercase tracking-wider">生年月日</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <YearPicker value={pYear} onChange={setPYear} years={years} className="h-11 px-4 w-full" />
                          <Select value={pMonth} onValueChange={(val) => setPMonth(val || '')}>
                            <SelectTrigger className="w-full bg-white border-rose-100 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="月" /></SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[300px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select value={pDay} onValueChange={(val) => setPDay(val || '')}>
                            <SelectTrigger className="w-full bg-white border-rose-100 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="日" /></SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[300px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-semibold text-rose-600/70 uppercase tracking-wider">性別 (任意)</Label>
                        <Select value={pGender} onValueChange={(val) => setPGender(val || '')}>
                          <SelectTrigger className="bg-white border-rose-100 h-11 px-4 rounded-xl shadow-sm text-sm"><SelectValue placeholder="選択" /></SelectTrigger>
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

                <Button onClick={handleFortune} className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md font-medium" disabled={!isFormValid}>
                  鑑定を実行する <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              </div>

              {/* Results Section - Right Column */}
              <div className="lg:col-span-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
                  <Tabs value={resultTab} onValueChange={setResultTab} className="w-full">
                      <div className="flex border-b border-zinc-200 mb-6 overflow-x-auto hide-scrollbar">
                        <TabsList className="bg-transparent h-auto p-0 flex gap-6 md:gap-8 min-w-max">
                          {isCompatibilityMode && compResult && (
                            <TabsTrigger value="compatibility" className="bg-transparent px-0 py-3 text-base rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:bg-transparent data-[state=active]:text-rose-600 text-zinc-500 hover:text-zinc-700">
                              <HeartHandshake className="w-4 h-4 mr-2" /> 相性診断スコア
                            </TabsTrigger>
                          )}
                          <TabsTrigger value="nature" className="bg-transparent px-0 py-3 text-base rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700">
                            <BookOpen className="w-4 h-4 mr-2" /> {isCompatibilityMode ? '二人の相性の性質' : '性質'}
                          </TabsTrigger>
                          <TabsTrigger value="explanation" className="bg-transparent px-0 py-3 text-base rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700">
                            <ActivitySquare className="w-4 h-4 mr-2" /> {isCompatibilityMode ? '相性の運気の説明' : '運気の説明'}
                          </TabsTrigger>
                          <TabsTrigger value="flows" className="bg-transparent px-0 py-3 text-base rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700">
                            <LineChartIcon className="w-4 h-4 mr-2" /> {isCompatibilityMode ? '二人の運気の流れ' : '運気の流れ'}
                          </TabsTrigger>
                          <TabsTrigger value="records" className="bg-transparent px-0 py-3 text-base rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 text-zinc-500 hover:text-zinc-700">
                            <Mic className="w-4 h-4 mr-2" /> 鑑定記録
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {!result && resultTab !== 'records' && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded-3xl bg-white/50 text-zinc-400 mt-8">
                          <Sparkles className="w-12 h-12 mb-4 text-zinc-300" strokeWidth={1} />
                          <p className="text-lg" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>情報を入力し、鑑定を実行してください</p>
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
                              <TabsContent value="compatibility" className="space-y-6 outline-none animate-in fade-in duration-500">
                                {/* 占術切替ボタン (4種類: 総合、令翠学、四柱推命、九星気学) */}
                                <div className="flex justify-center mb-6">
                                  <div className="bg-white/80 backdrop-blur-xl border border-rose-100/80 ring-1 ring-zinc-900/5 p-1.5 rounded-2xl flex shadow-sm max-w-xl w-full">
                                    {[
                                      { id: 'overall', label: '総合相性', desc: '3占術の統合', score: compResult.methods?.overall?.score ?? compResult.score },
                                      { id: 'reisui', label: '令翠学', desc: '運命星の調和', score: compResult.methods?.reisui?.score },
                                      { id: 'fourPillars', label: '四柱推命', desc: '日柱干支の縁', score: compResult.methods?.fourPillars?.score },
                                      { id: 'nineStar', label: '九星気学', desc: '本命気の巡り', score: compResult.methods?.nineStar?.score },
                                    ].map(m => (
                                      <button 
                                        key={m.id}
                                        onClick={() => setFortuneMethod(m.id as any)}
                                        className={`flex-1 py-2.5 px-2 text-sm font-medium rounded-xl transition-all flex flex-col items-center justify-center ${
                                          fortuneMethod === m.id 
                                            ? 'bg-rose-500 text-white shadow-md' 
                                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-rose-50/60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1">
                                          <span className="font-semibold text-xs sm:text-sm">{m.label}</span>
                                          {m.score !== undefined && (
                                            <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                                              fortuneMethod === m.id ? 'bg-white/20 text-white' : 'bg-rose-100/80 text-rose-700'
                                            }`}>
                                              {m.score}点
                                            </span>
                                          )}
                                        </div>
                                        <span className={`text-[10px] mt-0.5 tracking-tight ${
                                          fortuneMethod === m.id ? 'text-rose-100' : 'text-zinc-400'
                                        }`}>
                                          {m.desc}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* メイン相性スコアカード */}
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50/60 via-pink-50/40 to-amber-50/30 border border-rose-100/80">
                                  <CardContent className="pt-10 pb-10 px-8 text-center relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Heart className="w-64 h-64" /></div>
                                    
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wider ${currentTheme.badge}`}>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      {activeComp.label}
                                    </div>

                                    <h2 className="text-xl sm:text-2xl text-rose-950 font-normal mb-2" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                      {compResult.person1.name} さん <span className="text-rose-400 text-base font-light">×</span> {compResult.person2.name} さん
                                    </h2>

                                    {activeComp.starPair && (
                                      <p className="text-xs sm:text-sm font-medium text-rose-600/80 mb-6 tracking-wide">
                                        {activeComp.starPair}
                                      </p>
                                    )}

                                    <div className="flex justify-center items-end gap-2 mb-2">
                                      <span className={`text-7xl sm:text-8xl font-extralight tracking-tight transition-all duration-300 ${currentTheme.scoreText}`}>
                                        {activeComp.score}
                                      </span>
                                      <span className="text-xl font-medium text-rose-400 mb-3">点</span>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                      <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full" />
                                    </div>

                                    {/* 総合モード時の3大占術スコア内訳カード */}
                                    {fortuneMethod === 'overall' && compResult.methods && (
                                      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
                                        {[
                                          { id: 'reisui', label: '令翠学', score: compResult.methods.reisui.score, weight: '35%' },
                                          { id: 'fourPillars', label: '四柱推命', score: compResult.methods.fourPillars.score, weight: '35%' },
                                          { id: 'nineStar', label: '九星気学', score: compResult.methods.nineStar.score, weight: '30%' },
                                        ].map(item => (
                                          <button
                                            key={item.id}
                                            onClick={() => setFortuneMethod(item.id as any)}
                                            className="bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-3 border border-rose-100 text-center transition-all hover:scale-[1.02] hover:shadow-sm group cursor-pointer"
                                          >
                                            <span className="text-[11px] font-medium text-zinc-500 block mb-0.5 group-hover:text-rose-600">{item.label}</span>
                                            <span className="text-xl font-bold text-rose-600 block">{item.score}<span className="text-xs font-normal text-zinc-400 ml-0.5">点</span></span>
                                            <span className="text-[9px] text-zinc-400 block mt-0.5">タップで詳細</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}

                                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 text-left border border-white/80 max-w-2xl mx-auto shadow-sm">
                                      <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> {activeComp.label}の総評
                                      </h3>
                                      <p className="text-zinc-700 leading-relaxed text-[15px]">{activeComp.overall}</p>
                                    </div>
                                  </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white/90 border border-pink-100/60">
                                    <CardHeader className="bg-gradient-to-r from-pink-50/50 to-rose-50/30 border-b border-pink-50/80 pb-4">
                                      <CardTitle className="text-lg font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        <span className="flex items-center"><Heart className="w-5 h-5 text-pink-500 mr-2" /> 恋愛の相性</span>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                      <p className="text-zinc-600 leading-relaxed text-[15px]">{activeComp.romance}</p>
                                    </CardContent>
                                  </Card>

                                  <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white/90 border border-blue-100/60">
                                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-blue-100/50 pb-4">
                                      <CardTitle className="text-lg font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        <span className="flex items-center"><Briefcase className="w-5 h-5 text-blue-500 mr-2" /> 仕事・パートナー相性</span>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                      <p className="text-zinc-600 leading-relaxed text-[15px]">{activeComp.work}</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white/90 border border-emerald-100/60">
                                  <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/30 border-b border-emerald-100/50 pb-4">
                                    <CardTitle className="text-lg font-medium text-zinc-800 flex items-center justify-between" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                      <span className="flex items-center"><MessageCircle className="w-5 h-5 text-emerald-500 mr-2" /> 連絡の取り方・コミュニケーション</span>
                                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentTheme.badge}`}>{activeComp.label}</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <p className="text-zinc-600 leading-relaxed text-[15px]">{activeComp.communication}</p>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            );
                          })()}

                      {/* Tab 1: 性質 (Nature) */}
                      <TabsContent value="nature" className="space-y-6 outline-none">
                        
                        <div className="flex justify-center mb-6">
                          <div className="bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-zinc-900/5 p-1.5 rounded-2xl flex shadow-sm max-w-lg w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'nineStar', label: '九星気学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'reisui', label: '令翠学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
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
                      <TabsContent value="explanation" className="space-y-6 outline-none">
                        
                        <div className="flex justify-center mb-6">
                          <div className="bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-zinc-900/5 p-1.5 rounded-2xl flex shadow-sm max-w-lg w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'reisui', label: '令翠学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'nineStar', label: '九星気学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(fortuneMethod === 'overall') && (
                          <div className="mb-6 text-center text-zinc-500 text-sm">
                            各占術の運気の説明を一覧表示しています。
                          </div>
                        )}

                        {['overall', 'fourPillars', 'nineStar', 'reisui'].map(method => {
                          if (fortuneMethod !== 'overall' && fortuneMethod !== method) return null;
                          
                          const methodLabel = method === 'overall' ? '総合運' : method === 'fourPillars' ? '四柱推命' : method === 'nineStar' ? '九星気学' : '令翠学';
                          const mKey = method as 'overall'|'fourPillars'|'nineStar'|'reisui';
                          
                          return (
                            <div key={method} className="mb-12 last:mb-0">
                              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 tracking-wider">
                                    {methodLabel}
                                  </span>
                                  <span className="text-xs text-zinc-400">
                                    {method === 'overall' && '各占術を統合した全体バランス'}
                                    {method === 'fourPillars' && '命式と干支の巡りによる鑑定'}
                                    {method === 'nineStar' && '本命星と宮の巡りによる鑑定'}
                                    {method === 'reisui' && '令翠学12年バイオリズムによる鑑定'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50/30">
                                  <CardHeader className="pb-3 pt-6 px-6">
                                    <CardTitle className="text-sm font-semibold tracking-widest uppercase text-purple-600 flex items-center">
                                      <CalendarHeart className="w-5 h-5 mr-2" /> ズバリ！婚期のベストタイミング
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-6 pb-6">
                                    <div className="flex items-baseline gap-3 mb-4">
                                      <div className="text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        {result.turningPoints[mKey].marriage.year}
                                      </div>
                                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-700 font-medium">
                                        {methodLabel}の判定
                                      </span>
                                    </div>
                                    <p className="text-zinc-700 leading-loose text-[15px]">{result.turningPoints[mKey].marriage.description}</p>
                                  </CardContent>
                                </Card>
                                
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/30">
                                  <CardHeader className="pb-3 pt-6 px-6">
                                    <CardTitle className={`text-sm font-semibold tracking-widest uppercase flex items-center ${isCompatibilityMode ? 'text-rose-600' : 'text-blue-600'}`}>
                                      {isCompatibilityMode ? (
                                        <><AlertTriangle className="w-5 h-5 mr-2" /> ズバリ！別れの危機・要注意時期</>
                                      ) : (
                                        <><Briefcase className="w-5 h-5 mr-2" /> ズバリ！仕事運のピーク</>
                                      )}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-6 pb-6">
                                    <div className="flex items-baseline gap-3 mb-4">
                                      <div className="text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                                        {result.turningPoints[mKey].work.year}
                                      </div>
                                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isCompatibilityMode ? 'bg-rose-100/80 text-rose-700' : 'bg-blue-100/80 text-blue-700'}`}>
                                        {methodLabel}の{isCompatibilityMode ? '要注意年' : 'ピーク年'}
                                      </span>
                                    </div>
                                    <p className="text-zinc-700 leading-loose text-[15px]">{result.turningPoints[mKey].work.description}</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-emerald-50/30 border-b border-emerald-50/50 pb-4">
                                    <CardTitle className="text-lg font-medium text-zinc-800">今年の運気</CardTitle>
                                    <CardDescription className="text-emerald-600/80">{result.fortuneExplanations[mKey].thisYear.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <p className="text-zinc-600 leading-loose text-[15px]">{result.fortuneExplanations[mKey].thisYear.description}</p>
                                  </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-blue-50/30 border-b border-blue-50/50 pb-4">
                                    <CardTitle className="text-lg font-medium text-zinc-800">来年の運気</CardTitle>
                                    <CardDescription className="text-blue-600/80">{result.fortuneExplanations[mKey].nextYear.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <p className="text-zinc-600 leading-loose text-[15px]">{result.fortuneExplanations[mKey].nextYear.description}</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-emerald-50/30 border-b border-emerald-50/50 pb-4">
                                    <CardTitle className="text-lg font-medium text-zinc-800">今月の運気</CardTitle>
                                    <CardDescription className="text-emerald-600/80">{result.fortuneExplanations[mKey].thisMonth.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <p className="text-zinc-600 leading-loose text-[15px]">{result.fortuneExplanations[mKey].thisMonth.description}</p>
                                  </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                                  <CardHeader className="bg-blue-50/30 border-b border-blue-50/50 pb-4">
                                    <CardTitle className="text-lg font-medium text-zinc-800">来月の運気</CardTitle>
                                    <CardDescription className="text-blue-600/80">{result.fortuneExplanations[mKey].nextMonth.period}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <p className="text-zinc-600 leading-loose text-[15px]">{result.fortuneExplanations[mKey].nextMonth.description}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          );
                        })}
                      </TabsContent>

                      {/* Tab 3: 運気の流れ (Flows) */}
                      <TabsContent value="flows" className="outline-none">
                        
                        <div className="flex justify-center mb-6">
                          <div className="bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-zinc-900/5 p-1.5 rounded-2xl flex shadow-sm max-w-lg w-full">
                            {[
                              { id: 'overall', label: '総合' },
                              { id: 'reisui', label: '令翠学' },
                              { id: 'fourPillars', label: '四柱推命' },
                              { id: 'nineStar', label: '九星気学' },
                            ].map(m => (
                              <button 
                                key={m.id}
                                onClick={() => setFortuneMethod(m.id as any)}
                                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${fortuneMethod === m.id ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-amber-50'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                          <CardHeader className="border-b border-zinc-100 pb-6 pt-6 px-6 lg:px-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                              <div className="flex items-center gap-4">
                                <div className="bg-zinc-100/80 p-1 rounded-xl shadow-inner flex">
                                  <button onClick={() => setFlowViewType('graph')} className={`rounded-lg px-4 py-2 text-sm font-medium flex items-center transition-all ${flowViewType === 'graph' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <LineChartIcon className="w-4 h-4 mr-2" /> グラフ表示
                                  </button>
                                  <button onClick={() => setFlowViewType('table')} className={`rounded-lg px-4 py-2 text-sm font-medium flex items-center transition-all ${flowViewType === 'table' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                    <TableIcon className="w-4 h-4 mr-2" /> 詳細スコア
                                  </button>
                                </div>
                                
                                {selectedYearValue !== null && (
                                  <Button variant="outline" size="sm" className="rounded-xl shadow-xs bg-white text-zinc-700 hover:text-zinc-900 border-zinc-200" onClick={() => setSelectedYearValue(null)}>
                                    <ArrowLeft className="w-4 h-4 mr-1.5" /> 100年運気へ戻る
                                  </Button>
                                )}
                              </div>
                              
                              {flowViewType === 'table' && (
                                <div className="flex flex-wrap items-center gap-3 bg-zinc-50/80 p-2.5 rounded-2xl border border-zinc-200/60 w-full lg:w-auto">
                                  <div className="flex items-center text-xs text-zinc-500 font-medium ml-2">
                                    <Filter className="w-3.5 h-3.5 mr-1.5" /> スコア絞り込み
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <Input type="number" value={filterMinScore} onChange={(e) => setFilterMinScore(e.target.value)} className="w-16 h-8 text-center text-sm rounded-lg" />
                                    <span className="text-zinc-400 text-xs">〜</span>
                                    <Input type="number" value={filterMaxScore} onChange={(e) => setFilterMaxScore(e.target.value)} className="w-16 h-8 text-center text-sm rounded-lg" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 年度選択時のナビゲーションバナー */}
                            {selectedYearValue !== null && selectedTargetYearData && (
                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/70 p-3.5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                    {selectedYearValue % 100}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-base font-bold text-zinc-900">
                                        {selectedYearValue}年 月別バイオリズム
                                      </span>
                                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                        {selectedTargetYearData.age}歳 ・ {fortuneMethod === 'reisui' ? selectedTargetYearData.stageReisui.name : fortuneMethod === 'fourPillars' ? selectedTargetYearData.stageFourPillars.name : fortuneMethod === 'nineStar' ? selectedTargetYearData.stageNineStar.name : selectedTargetYearData.stage.name}
                                      </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                      {selectedYearValue}年の1月〜12月の月別バイオリズムです。
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl h-8 px-2.5 text-zinc-600 hover:text-zinc-900 bg-white/80 border-zinc-200 shadow-2xs"
                                    onClick={() => setSelectedYearValue(prev => (prev ? prev - 1 : null))}
                                  >
                                    <ChevronLeft className="w-4 h-4 mr-0.5" /> 前年
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl h-8 px-2.5 text-zinc-600 hover:text-zinc-900 bg-white/80 border-zinc-200 shadow-2xs"
                                    onClick={() => setSelectedYearValue(prev => (prev ? prev + 1 : null))}
                                  >
                                    翌年 <ChevronRight className="w-4 h-4 ml-0.5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-500 bg-blue-50/50 px-4 py-2.5 rounded-xl border border-blue-100">
                              <span className="text-blue-700 font-semibold mr-2">操作ヒント:</span>
                              {flowViewType === 'graph' ? (
                                selectedYearValue === null ? (
                                  <span>グラフ上の年度の点（ドット）やチャートをタップすると、その年度の「月単位の運気グラフ」が表示されます。横スクロールで100年分を確認できます。</span>
                                ) : (
                                  <span>グラフの月ドット（1〜12月）をタップすると、その月の詳細アドバイスが表示されます。「100年運気へ戻る」で年別グラフに戻ります。</span>
                                )
                              ) : (
                                selectedYearValue === null ? (
                                  <span>年をタップすると該当年度の月別一覧に切り替わります。点数をタップすると詳細アドバイスが表示されます。</span>
                                ) : (
                                  <span>月ごとのスコアをタップすると詳細アドバイスが表示されます。「100年運気へ戻る」で年別一覧に戻ります。</span>
                                )
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className="p-0 relative">
                            {flowViewType === 'graph' ? (
                              <div className="w-full relative bg-gradient-to-b from-white to-blue-50/20 pt-8 pb-4">
                                {selectedYearValue === null ? (
                                  <ScrollArea className="w-full">
                                    <div style={{ width: `${Math.max(1200, graphData.length * 60)}px`, height: '450px' }} className="px-6">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart 
                                          data={graphData} 
                                          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
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
                                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                          <XAxis dataKey="periodValue" tick={renderYearTick} stroke="#a1a1aa" tickMargin={12} axisLine={false} />
                                          <YAxis domain={[0, 100]} hide />
                                          <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                          
                                          {/* Highlight Recharge periods */}
                                          {graphData.map((d, i) => (
                                            d.stageName.includes('充電期') && 
                                            <ReferenceArea key={i} x1={d.periodValue} x2={d.periodValue} fill="#f1f5f9" fillOpacity={0.8} />
                                          ))}
                                          
                                          <Line 
                                            type="monotone" 
                                            dataKey="stageScore" 
                                            stroke="#3b82f6" 
                                            strokeWidth={4}
                                            dot={renderYearDot}
                                            activeDot={{ r: 9, fill: "#2563eb", stroke: "#fff", strokeWidth: 3, cursor: "pointer" }}
                                            onClick={handleGraphDotClick}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                  </ScrollArea>
                                ) : (
                                  <div className="w-full px-4 lg:px-8">
                                    <div style={{ width: '100%', minWidth: '600px', height: '420px' }}>
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart 
                                          data={graphData} 
                                          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
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
                                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                          <XAxis dataKey="periodValue" tickFormatter={(v) => `${v}月`} stroke="#71717a" tick={{ fontSize: 13, fontWeight: 500 }} tickMargin={12} axisLine={false} />
                                          <YAxis domain={[0, 100]} stroke="#a1a1aa" tick={{ fontSize: 11 }} tickCount={6} axisLine={false} />
                                          <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                          
                                          {graphData.map((d, i) => (
                                            d.stageName.includes('充電期') && 
                                            <ReferenceArea key={i} x1={d.periodValue} x2={d.periodValue} fill="#fffbeb" fillOpacity={0.6} />
                                          ))}
                                          
                                          <Line 
                                            type="monotone" 
                                            dataKey="stageScore" 
                                            stroke="#f59e0b" 
                                            strokeWidth={4}
                                            dot={renderMonthDot}
                                            activeDot={{ r: 10, fill: "#d97706", stroke: "#fff", strokeWidth: 3, cursor: "pointer" }}
                                            onClick={handleGraphDotClick}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <ScrollArea className="w-full h-[600px] bg-zinc-50/30">
                                <Table>
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
                              </ScrollArea>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </>
                  )}

                  {/* Tab 4: 鑑定記録 (Records) */}
              <TabsContent value="records" className="space-y-6 outline-none">
                {(() => {
                  const activeCustomer = customers?.find(c => c.id === activeCustomerId);
                  const targetName = activeCustomer ? activeCustomer.name : name;
                  return (
                    <>
                      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-5 pt-6 px-6 flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-medium text-zinc-800 flex items-center" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            <Mic className="w-5 h-5 text-amber-500 mr-2" /> 鑑定記録 {targetName ? `（${targetName} 様）` : ''}
                          </CardTitle>
                          {isRecording ? (
                            <Button onClick={stopRecording} variant="destructive" className="rounded-xl shadow-sm font-medium animate-pulse">
                              <StopCircle className="w-4 h-4 mr-2" /> 録音停止
                            </Button>
                          ) : (
                            <Button onClick={startRecording} className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-sm font-medium">
                              <Mic className="w-4 h-4 mr-2" /> 記録開始
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="p-6">
                          {isRecording || liveTranscript ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`}></span>
                                <span className="text-sm font-medium text-zinc-500">{isRecording ? '録音中...' : '録音停止中'}</span>
                              </div>
                              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 min-h-[120px] max-h-[300px] overflow-y-auto">
                                <p className="text-zinc-700 leading-loose text-[15px] whitespace-pre-wrap">{liveTranscript || '（音声を聞き取っています...）'}</p>
                              </div>
                              {!isRecording && liveTranscript && (
                                <div className="flex justify-end mt-4">
                                  <Button onClick={() => saveTranscriptToCustomer(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> {targetName ? `${targetName} 様の記録として保存` : 'この記録を保存する'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-10 text-zinc-400 flex flex-col items-center">
                              <MicOff className="w-12 h-12 mb-4 text-zinc-300" strokeWidth={1} />
                              <p className="text-[15px]">「記録開始」ボタンを押すと、マイクから音声を拾って文字起こしを行います。</p>
                              {!targetName && (
                                <p className="text-[13px] mt-4 text-amber-600/70">※保存するには左側のフォームでお名前をご入力ください</p>
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
          
          <TabsContent value="customers" className="focus-visible:outline-none mt-4 animate-in fade-in duration-500">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-zinc-100 pb-6 pt-8 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-normal text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                    顧客一覧
                  </CardTitle>
                </div>
                <Button onClick={openNewCustomerDialog} className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> 新規追加
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-100 hover:bg-transparent bg-zinc-50/30">
                      <TableHead className="pl-8 py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">お名前</TableHead>
                      <TableHead className="py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">生年月日</TableHead>
                      <TableHead className="py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">性別</TableHead>
                      <TableHead className="text-right pr-8 py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.map((customer) => (
                      <TableRow key={customer.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                        <TableCell className="pl-8 py-4 font-medium text-zinc-800">{customer.name}</TableCell>
                        <TableCell className="py-4 text-zinc-500">{customer.birthdate}</TableCell>
                        <TableCell className="py-4 text-zinc-500">{customer.gender === 'female' ? '女性' : customer.gender === 'male' ? '男性' : customer.gender === 'other' ? 'その他' : '-'}</TableCell>
                        <TableCell className="text-right pr-8 py-4">
                          <div className="flex justify-end gap-2 items-center">
                            {isCompatibilityMode ? (
                              <>
                                <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50 rounded-lg px-2" onClick={() => loadCustomerToFortune(customer, 1)}>
                                  1人目 <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 rounded-lg px-2" onClick={() => loadCustomerToFortune(customer, 2)}>
                                  2人目 <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50 rounded-lg" onClick={() => loadCustomerToFortune(customer, 1)}>
                                占う <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50 rounded-lg px-2 mr-1" onClick={() => viewCustomerRecords(customer)}>
                              <Mic className="w-3.5 h-3.5 mr-1" /> 記録 ({customer.records?.length || 0})
                            </Button>
                            <div className="w-[1px] h-4 bg-zinc-200 mx-1"></div>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg w-8 h-8" onClick={() => openEditCustomerDialog(customer)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg w-8 h-8" onClick={(e) => { e.stopPropagation(); if (customer.id) requestDeleteCustomer(customer.id); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Score Details Dialog */}
      <Dialog open={scoreDetailOpen} onOpenChange={setScoreDetailOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[24px] border-0 shadow-[0_20px_50px_rgb(0,0,0,0.1)] p-0 overflow-hidden">
          {selectedScoreInfo && (
            <>
              <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-blue-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">{selectedScoreInfo.period} {selectedScoreInfo.age !== undefined && `(${isCompatibilityMode ? name + ' ' : ''}${selectedScoreInfo.age}歳)`}</p>
                    <DialogTitle className="text-2xl font-normal text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                      {selectedScoreInfo.categoryName} {selectedScoreInfo.stageName && <span className="ml-2 text-sm text-zinc-500 font-medium">({selectedScoreInfo.stageName})</span>}
                    </DialogTitle>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-zinc-100 flex flex-col items-center">
                    <span className="text-xs text-zinc-400 font-semibold mb-0.5">スコア</span>
                    <span className="text-3xl font-bold text-blue-500 leading-none">{selectedScoreInfo.score.value}</span>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-8 bg-white">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-blue-500 pl-3">時期の詳細</h4>
                  <p className="text-zinc-600 leading-relaxed text-[15px]">{selectedScoreInfo.score.detail}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-rose-400 pl-3">気を付ける事</h4>
                  <p className="text-zinc-600 leading-relaxed text-[15px]">{selectedScoreInfo.score.caution}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-800 flex items-center border-l-2 border-emerald-400 pl-3">やると良いこと</h4>
                  <p className="text-zinc-600 leading-relaxed text-[15px]">{selectedScoreInfo.score.recommendation}</p>
                </div>
              </div>
              <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100">
                <Button className="w-full rounded-xl h-11 bg-zinc-900 hover:bg-zinc-800 text-white" onClick={() => setScoreDetailOpen(false)}>閉じる</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <DialogTitle className="text-xl font-normal text-zinc-800 mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            顧客データの削除
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-sm text-zinc-600">本当にこの顧客データを削除しますか？<br />この操作は取り消せません。</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" className="rounded-xl border-zinc-200" onClick={() => setDeleteConfirmOpen(false)}>キャンセル</Button>
              <Button onClick={confirmDeleteCustomer} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">削除する</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Form Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <DialogTitle className="text-xl font-normal text-zinc-800 mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            {editingCustomerId ? '顧客情報の編集' : '新規顧客の追加'}
          </DialogTitle>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">お名前</Label>
              <Input placeholder="例: 山田 花子" value={cName} onChange={(e) => setCName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">生年月日</Label>
              <div className="grid grid-cols-3 gap-2">
                <YearPicker value={cBYear} onChange={setCBYear} years={years} className="h-8 py-2 px-3" />
                <Select value={cBMonth} onValueChange={(val) => setCBMonth(val || '')}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="月" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={cBDay} onValueChange={(val) => setCBDay(val || '')}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="日" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase">性別 (任意)</Label>
              <Select value={cGender} onValueChange={(val) => setCGender(val || '')}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="選択" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white mt-4" onClick={saveCustomer} disabled={!cName || !cBYear || !cBMonth || !cBDay}>
              保存する
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Move Record Dialog */}
      <Dialog open={isMoveRecordDialogOpen} onOpenChange={setIsMoveRecordDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <DialogTitle className="text-xl font-normal text-zinc-800 mb-4" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            鑑定記録の移動
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">この記録を他のお客様に紐づけ直します。移動先のお客様を選択してください。</p>
            <Select value={targetMoveCustomerId} onValueChange={(val) => setTargetMoveCustomerId(val || '')}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="移動先のお客様を選択" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {customers?.filter(c => c.id !== recordToMove?.customerId).map(c => (
                  <SelectItem key={c.id} value={c.id!.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" className="rounded-xl border-zinc-200" onClick={() => setIsMoveRecordDialogOpen(false)}>キャンセル</Button>
              <Button onClick={handleMoveRecord} disabled={!targetMoveCustomerId} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">移動する</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <DialogTitle className="flex items-center text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
            <Key className="w-5 h-5 mr-2 text-amber-500" />
            APIキーの設定
          </DialogTitle>
          <div className="py-6 space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              要約やメッセージ作成などのAI機能を利用するには、Google Gemini APIキーが必要です。<br />
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Google AI Studio</a>から取得してください。
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Gemini API Key</label>
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" className="rounded-xl border-zinc-200" onClick={() => setIsApiKeyDialogOpen(false)}>キャンセル</Button>
            <Button onClick={saveApiKey} disabled={!tempApiKey.trim()} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Records List Dialog */}
      <Dialog open={isRecordsListDialogOpen} onOpenChange={setIsRecordsListDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl w-full h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-zinc-50 border-0 shadow-2xl">
          <DialogTitle className="px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between shadow-sm z-10">
            <span className="flex items-center font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
              <Mic className="w-5 h-5 text-amber-500 mr-2" />
              {customers?.find(c => c.id === recordsListCustomerId)?.name} 様の鑑定記録
            </span>
          </DialogTitle>
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: List of dates */}
            <div className="w-[30%] border-r border-zinc-100 overflow-y-auto bg-white/50 backdrop-blur flex flex-col">
              {(() => {
                const activeRecordsCustomer = customers?.find(c => c.id === recordsListCustomerId);
                if (!activeRecordsCustomer?.records?.length) {
                  return (
                    <div className="p-8 text-center text-zinc-400 text-sm flex flex-col items-center justify-center h-full">
                      <Clock className="w-8 h-8 mb-3 opacity-20" />
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
                    className={`text-left px-5 py-4 border-b border-zinc-100 hover:bg-white transition-all ${selectedRecordIdInDialog === record.id ? 'bg-white shadow-[inset_4px_0_0_0_#f59e0b]' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className={`flex items-center text-sm font-semibold ${selectedRecordIdInDialog === record.id ? 'text-amber-600' : 'text-zinc-700'}`}>
                      <Clock className="w-4 h-4 mr-2 opacity-50" />
                      {new Date(record.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-[13px] font-medium text-zinc-400 mt-1 pl-6">
                      {new Date(record.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {record.partnerName && (
                      <div className="text-[12px] font-medium text-amber-600 mt-1 pl-6 flex items-center gap-1">
                        <HeartHandshake className="w-3 h-3" />
                        {record.partnerName}様との相性
                      </div>
                    )}
                  </button>
                ));
              })()}
            </div>

            {/* Right Content: Selected Record Details */}
            <div className="w-[70%] overflow-y-auto bg-white p-8">
              {(() => {
                const activeRecordsCustomer = customers?.find(c => c.id === recordsListCustomerId);
                if (!selectedRecordIdInDialog || !activeRecordsCustomer?.records) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                      <MicOff className="w-16 h-16 text-zinc-100 mb-6" strokeWidth={1} />
                      <p className="text-[15px]">左側のリストから記録を選択してください</p>
                    </div>
                  );
                }
                const record = activeRecordsCustomer.records.find(r => r.id === selectedRecordIdInDialog);
                if (!record) return null;

                return (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-zinc-700 font-medium text-lg" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                          {new Date(record.date).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {record.partnerName && (
                          <div className="flex items-center text-amber-600 font-medium text-[15px]" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            <HeartHandshake className="w-4 h-4 mr-2" />
                            {record.partnerName}様との相性鑑定
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-8 text-[13px] rounded-lg px-3" onClick={() => requireApiKey(() => generateSummary(activeRecordsCustomer.id!, record.id, record.content))} disabled={isGeneratingText}>
                          <Wand2 className={`w-3.5 h-3.5 mr-1.5 ${isGeneratingText ? 'animate-pulse' : ''}`} /> 要約
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-8 text-[13px] rounded-lg px-3" onClick={() => requireApiKey(() => generateMessage(activeRecordsCustomer.id!, record.id, record.content, activeRecordsCustomer.name))} disabled={isGeneratingText}>
                          <MessageSquare className={`w-3.5 h-3.5 mr-1.5 ${isGeneratingText ? 'animate-pulse' : ''}`} /> 鑑定後メッセージ
                        </Button>
                        <div className="w-[1px] h-4 bg-zinc-200 mx-1"></div>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-8 text-[13px] rounded-lg px-3" onClick={() => {
                          setEditingRecordId(record.id);
                          setEditingRecordContent(record.content);
                          setEditingRecordSummary(record.summary || '');
                          setEditingRecordPostMessage(record.postMessage || '');
                        }}>
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" /> 編集
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-amber-600 hover:bg-amber-50 h-8 text-[13px] rounded-lg px-3" onClick={() => {
                          setRecordToMove({ customerId: activeRecordsCustomer.id!, recordId: record.id, recordContent: record.content, recordDate: record.date.toString() });
                          setTargetMoveCustomerId('');
                          setIsMoveRecordDialogOpen(true);
                        }}>
                          <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" /> 移動
                        </Button>
                        <div className="w-[1px] h-4 bg-zinc-200 mx-1"></div>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-red-600 hover:bg-red-50 h-8 text-[13px] rounded-lg px-3" onClick={() => {
                          deleteRecord(activeRecordsCustomer.id!, record.id);
                          setSelectedRecordIdInDialog(null);
                        }}>
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> 削除
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 pb-10 overflow-y-auto pr-2">
                      {editingRecordId === record.id ? (
                        <div className="space-y-6 h-full flex flex-col">
                          {record.postMessage !== undefined && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-amber-500" />鑑定後メッセージ</label>
                              <textarea value={editingRecordPostMessage} onChange={e => setEditingRecordPostMessage(e.target.value)} className="w-full min-h-[150px] p-4 text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                            </div>
                          )}
                          {record.summary !== undefined && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><Wand2 className="w-4 h-4 text-amber-500" />要約</label>
                              <textarea value={editingRecordSummary} onChange={e => setEditingRecordSummary(e.target.value)} className="w-full min-h-[150px] p-4 text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                            </div>
                          )}
                          <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-500" />原文 (鑑定記録)</label>
                            <textarea value={editingRecordContent} onChange={e => setEditingRecordContent(e.target.value)} className="flex-1 w-full min-h-[300px] p-4 text-[14px] leading-relaxed border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white" />
                          </div>
                          <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditingRecordId(null)} className="rounded-xl px-6 h-11 border-zinc-200">キャンセル</Button>
                            <Button onClick={() => saveEditedRecord(activeRecordsCustomer.id!, record.id)} className="rounded-xl px-6 h-11 bg-amber-600 hover:bg-amber-700 text-white font-medium">保存する</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {record.postMessage && (
                            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 relative group">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> 鑑定後メッセージ</h4>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-8 text-amber-700 hover:bg-amber-100 hover:text-amber-800 px-3" onClick={() => handleCopyRecord(record.postMessage!)}>
                                    <Copy className="w-3.5 h-3.5 mr-1.5" /> コピー
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 px-3" onClick={() => deleteRecordField(activeRecordsCustomer.id!, record.id, 'postMessage')}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-zinc-800 leading-loose text-[14px] whitespace-pre-wrap">{record.postMessage}</div>
                            </div>
                          )}
                          {record.summary && (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 relative group">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2"><Wand2 className="w-4 h-4" /> 要約</h4>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-3" onClick={() => handleCopyRecord(record.summary!)}>
                                    <Copy className="w-3.5 h-3.5 mr-1.5" /> コピー
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 px-3" onClick={() => deleteRecordField(activeRecordsCustomer.id!, record.id, 'summary')}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-zinc-800 leading-loose text-[14px] whitespace-pre-wrap">{record.summary}</div>
                            </div>
                          )}
                          <div className="bg-white border border-zinc-200 rounded-2xl p-5 relative group shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-bold text-zinc-700 flex items-center gap-2"><BookOpen className="w-4 h-4 text-zinc-400" /> 原文 (鑑定記録)</h4>
                              <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 px-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopyRecord(record.content)}>
                                <Copy className="w-3.5 h-3.5 mr-1.5" /> コピー
                              </Button>
                            </div>
                            <div className="text-zinc-700 leading-loose text-[15px] whitespace-pre-wrap">{record.content}</div>
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
    </div>
  );
}
