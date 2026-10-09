"use client";

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { calculateFortune, FortuneResult } from '@/lib/fortune';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Users, UserPlus, ArrowRight, Heart, Briefcase, Home, CalendarHeart, Activity } from 'lucide-react';

export default function FortuneApp() {
  const [activeTab, setActiveTab] = useState('fortune');
  
  // Fortune State
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<FortuneResult | null>(null);

  // Customer Management State
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [cName, setCName] = useState('');
  const [cBirthdate, setCBirthdate] = useState('');
  const [cGender, setCGender] = useState('');
  const [cNotes, setCNotes] = useState('');

  const customers = useLiveQuery(() => db.customers.toArray());

  const handleFortune = () => {
    if (!name || !birthdate) return;
    const res = calculateFortune(birthdate, name);
    setResult(res);
  };

  const saveCustomer = async () => {
    if (!cName || !cBirthdate) return;
    await db.customers.add({
      name: cName,
      birthdate: cBirthdate,
      gender: cGender,
      notes: cNotes,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsCustomerDialogOpen(false);
    setCName(''); setCBirthdate(''); setCGender(''); setCNotes('');
  };

  const loadCustomerToFortune = (c: any) => {
    setName(c.name);
    setBirthdate(c.birthdate);
    setGender(c.gender || '');
    setActiveTab('fortune');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">
      
      {/* Refined Header */}
      <header className="pt-16 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-normal text-zinc-800 tracking-wide mb-3" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
          Fortune Teller
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-amber-200"></div>
          <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase">四柱推命・九星気学</p>
          <div className="h-[1px] w-8 bg-amber-200"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Segmented Control Style Tabs */}
          <div className="flex justify-center mb-10">
            <TabsList className="bg-zinc-100/80 p-1 rounded-full shadow-inner border border-zinc-200/50">
              <TabsTrigger 
                value="fortune" 
                className="rounded-full px-8 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                鑑定
              </TabsTrigger>
              <TabsTrigger 
                value="customers" 
                className="rounded-full px-8 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500"
              >
                <Users className="w-4 h-4 mr-2" />
                顧客一覧
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fortune" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Input Section - Left Column */}
              <div className="lg:col-span-4 space-y-8">
                <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
                  <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-6 pt-8 px-8">
                    <CardTitle className="text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                      対象者情報
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                      占う方の情報を入力してください。
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 px-8 pb-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="例: 山田 花子" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 h-12 px-4 rounded-xl transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="birthdate" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Birthdate</Label>
                      <Input 
                        id="birthdate" 
                        type="date" 
                        value={birthdate} 
                        onChange={(e) => setBirthdate(e.target.value)} 
                        className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 h-12 px-4 rounded-xl transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gender (Optional)</Label>
                      <Select value={gender} onValueChange={(val) => setGender(val || '')}>
                        <SelectTrigger className="bg-zinc-50/50 border-zinc-200 focus:ring-amber-500/20 focus:border-amber-400 h-12 px-4 rounded-xl transition-all">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="female">女性</SelectItem>
                          <SelectItem value="male">男性</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleFortune} 
                      className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md transition-all mt-4 font-medium" 
                      disabled={!name || !birthdate}
                    >
                      鑑定を実行する <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section - Right Column */}
              <div className="lg:col-span-8">
                {!result ? (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-[32px] bg-white/50 text-zinc-400">
                    <Sparkles className="w-12 h-12 mb-4 text-zinc-200" strokeWidth={1} />
                    <p className="text-lg" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>情報を入力し、鑑定を実行してください</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
                    
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Four Pillars */}
                      <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Sparkles className="w-24 h-24" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-zinc-500 text-sm font-medium tracking-widest uppercase">四柱推命</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-end mb-8 mt-2">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-zinc-400 mb-2 tracking-widest">年柱</span>
                              <span className="text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>{result.fourPillars.year}</span>
                            </div>
                            <div className="w-[1px] h-12 bg-zinc-100"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-zinc-400 mb-2 tracking-widest">月柱</span>
                              <span className="text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>{result.fourPillars.month}</span>
                            </div>
                            <div className="w-[1px] h-12 bg-zinc-100"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-zinc-400 mb-2 tracking-widest">日柱</span>
                              <span className="text-3xl text-zinc-800 font-light" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>{result.fourPillars.day}</span>
                            </div>
                          </div>
                          
                          <div className="bg-zinc-50 p-4 rounded-2xl">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">本質・気質</span>
                            <p className="text-sm text-zinc-700 leading-relaxed">{result.fourPillars.nature}</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Nine Star Ki */}
                      <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-zinc-500 text-sm font-medium tracking-widest uppercase">九星気学</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center h-[calc(100%-4rem)] pt-6">
                          <span className="text-xs text-zinc-400 tracking-widest mb-4">本命星</span>
                          <div className="text-5xl text-amber-700 font-light tracking-widest mb-6" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            {result.nineStar}
                          </div>
                          <div className="w-12 h-[1px] bg-amber-200"></div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timing Table */}
                    <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
                      <CardHeader className="border-b border-zinc-100 pb-6 pt-8 px-8 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                            運気の流れ
                          </CardTitle>
                          <CardDescription className="text-zinc-500 mt-1">今後12ヶ月のバイオリズム</CardDescription>
                        </div>
                        <div className="hidden sm:flex text-[10px] text-zinc-400 gap-3 bg-zinc-50 px-4 py-2 rounded-full font-medium tracking-wider">
                          <span className="text-amber-500">◎ 大吉</span>
                          <span className="text-zinc-700">◯ 吉</span>
                          <span className="text-zinc-500">△ 普通</span>
                          <span className="text-zinc-300">✕ 注意</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="w-full">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-zinc-100 hover:bg-transparent">
                                <TableHead className="w-[120px] pl-8 py-4 text-xs font-medium text-zinc-400 uppercase tracking-widest">時期</TableHead>
                                <TableHead className="text-center py-4"><div className="flex flex-col items-center gap-1.5"><Heart className="w-4 h-4 text-rose-400" /><span className="text-xs text-zinc-500">恋愛</span></div></TableHead>
                                <TableHead className="text-center py-4"><div className="flex flex-col items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-400" /><span className="text-xs text-zinc-500">仕事</span></div></TableHead>
                                <TableHead className="text-center py-4"><div className="flex flex-col items-center gap-1.5"><Home className="w-4 h-4 text-emerald-400" /><span className="text-xs text-zinc-500">家庭</span></div></TableHead>
                                <TableHead className="text-center py-4"><div className="flex flex-col items-center gap-1.5"><CalendarHeart className="w-4 h-4 text-purple-400" /><span className="text-xs text-zinc-500">婚期</span></div></TableHead>
                                <TableHead className="text-center py-4 pr-8"><div className="flex flex-col items-center gap-1.5"><Activity className="w-4 h-4 text-orange-400" /><span className="text-xs text-zinc-500">健康</span></div></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {result.timing.map((t, idx) => (
                                <TableRow key={idx} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                  <TableCell className="pl-8 py-4 font-medium text-zinc-700 text-sm">{t.month}</TableCell>
                                  <TableCell className={`text-center py-4 text-lg ${t.romance === '◎' ? 'text-amber-500 font-bold' : t.romance === '✕' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.romance}</TableCell>
                                  <TableCell className={`text-center py-4 text-lg ${t.work === '◎' ? 'text-amber-500 font-bold' : t.work === '✕' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.work}</TableCell>
                                  <TableCell className={`text-center py-4 text-lg ${t.family === '◎' ? 'text-amber-500 font-bold' : t.family === '✕' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.family}</TableCell>
                                  <TableCell className={`text-center py-4 text-lg ${t.marriage === '◎' ? 'text-amber-500 font-bold' : t.marriage === '✕' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.marriage}</TableCell>
                                  <TableCell className={`text-center py-4 pr-8 text-lg ${t.health === '◎' ? 'text-amber-500 font-bold' : t.health === '✕' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.health}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="focus-visible:outline-none mt-4 animate-in fade-in duration-500">
            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
              <CardHeader className="border-b border-zinc-100 pb-6 pt-8 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-normal text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>
                    顧客一覧
                  </CardTitle>
                  <CardDescription className="text-zinc-500 mt-1">
                    過去に鑑定したお客様の情報を管理します
                  </CardDescription>
                </div>
                
                <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                  <DialogTrigger className="bg-zinc-900 hover:bg-zinc-800 text-white inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium h-11 px-6 transition-all shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2 opacity-70" /> 新規顧客登録
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[24px] border-0 shadow-[0_20px_50px_rgb(0,0,0,0.1)] p-0 overflow-hidden">
                    <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
                      <DialogTitle className="text-xl font-medium text-zinc-800" style={{ fontFamily: 'var(--font-noto-serif-jp), serif' }}>新規顧客の登録</DialogTitle>
                      <DialogDescription className="mt-2 text-zinc-500">
                        お客様の基本情報を入力して保存します。
                      </DialogDescription>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cName" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">お名前</Label>
                        <Input id="cName" value={cName} onChange={(e) => setCName(e.target.value)} className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cBirth" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">生年月日</Label>
                        <Input id="cBirth" type="date" value={cBirthdate} onChange={(e) => setCBirthdate(e.target.value)} className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cGender" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">性別</Label>
                        <Select value={cGender} onValueChange={(val) => setCGender(val || '')}>
                          <SelectTrigger className="bg-zinc-50/50 border-zinc-200 focus:ring-amber-500/20 focus:border-amber-400 h-11 rounded-xl">
                            <SelectValue placeholder="選択" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="female">女性</SelectItem>
                            <SelectItem value="male">男性</SelectItem>
                            <SelectItem value="other">その他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cNotes" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">メモ</Label>
                        <Input id="cNotes" value={cNotes} onChange={(e) => setCNotes(e.target.value)} className="bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 h-11 rounded-xl" placeholder="悩み事や相談内容" />
                      </div>
                    </div>
                    <div className="px-8 py-6 bg-zinc-50/50 border-t border-zinc-100 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)} className="rounded-xl h-11 px-6 border-zinc-200 text-zinc-600 hover:bg-zinc-100">キャンセル</Button>
                      <Button onClick={saveCustomer} className="rounded-xl h-11 px-6 bg-zinc-900 hover:bg-zinc-800 text-white" disabled={!cName || !cBirthdate}>登録する</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-100 hover:bg-transparent bg-zinc-50/30">
                      <TableHead className="pl-8 py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">お名前</TableHead>
                      <TableHead className="py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">生年月日</TableHead>
                      <TableHead className="py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">性別</TableHead>
                      <TableHead className="py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">メモ</TableHead>
                      <TableHead className="text-right pr-8 py-5 text-xs font-medium text-zinc-400 uppercase tracking-widest">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={5} className="text-center py-16 text-zinc-400">
                          <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>登録されている顧客はいません</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers?.map((customer) => (
                        <TableRow key={customer.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                          <TableCell className="pl-8 py-4 font-medium text-zinc-800">{customer.name}</TableCell>
                          <TableCell className="py-4 text-zinc-500">{customer.birthdate}</TableCell>
                          <TableCell className="py-4 text-zinc-500">
                            {customer.gender === 'female' ? '女性' : customer.gender === 'male' ? '男性' : customer.gender === 'other' ? 'その他' : '-'}
                          </TableCell>
                          <TableCell className="py-4 text-zinc-500 max-w-[200px] truncate">{customer.notes || '-'}</TableCell>
                          <TableCell className="text-right pr-8 py-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" 
                              onClick={() => loadCustomerToFortune(customer)}
                            >
                              鑑定する <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
