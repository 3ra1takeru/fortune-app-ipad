import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface YearPickerProps {
  value: string;
  onChange: (value: string) => void;
  years: string[];
  className?: string;
}

export function YearPicker({ value, onChange, years, className }: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  const yearNumbers = years.map(y => parseInt(y));
  const minYear = Math.min(...yearNumbers);
  const maxYear = Math.max(...yearNumbers);
  
  const decades = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <Popover open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelectedDecade(null); }}>
      <PopoverTrigger className={`inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-white border-zinc-200 shadow-sm hover:bg-zinc-50 rounded-xl w-full font-normal ${!value ? "text-zinc-500" : "text-zinc-900"} ${className || 'h-11 px-4'}`}>
        {value ? `${value}年` : "年"}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl" align="start">
        {!selectedDecade ? (
          <div>
            <div className="text-center text-[11px] font-semibold text-zinc-400 mb-3 uppercase tracking-wider">年代を選択してください</div>
            <div className="grid grid-cols-3 gap-2">
              {decades.map(d => (
                <Button key={d} variant="outline" size="sm" onClick={() => setSelectedDecade(d)} className="rounded-lg hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 text-zinc-700">
                  {d}年代
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedDecade(null)} className="h-7 px-2 text-xs rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 戻る
              </Button>
              <span className="flex-1 text-center text-xs font-bold text-zinc-700 pr-8">{selectedDecade}年代</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {digits.map(digit => {
                const year = selectedDecade + digit;
                const isOutOfRange = year < minYear || year > maxYear;
                return (
                  <Button 
                    key={digit} 
                    variant="outline" 
                    size="sm" 
                    disabled={isOutOfRange}
                    onClick={() => {
                      onChange(year.toString());
                      setOpen(false);
                      setSelectedDecade(null);
                    }}
                    className="rounded-lg h-10 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 text-zinc-700"
                  >
                    {digit}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
