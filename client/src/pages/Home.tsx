import { useEffect, useState } from "react";

// Calendário acadêmico com períodos de aulas (dias úteis)
const academicCalendar = [
  // Semestre 2025/2: 13/10/2025 (segunda) a 24/12/2025 (quarta)
  { start: new Date(2025, 9, 13), end: new Date(2025, 11, 24) },
  // Semestre 2026/1: 31/01/2026 (sábado) a 10/03/2026 (terça)
  { start: new Date(2026, 0, 31), end: new Date(2026, 2, 10) },
  // Semestre 2026/1 continuação: 23/03/2026 (segunda) a 18/07/2026 (sábado)
  { start: new Date(2026, 2, 23), end: new Date(2026, 6, 18) },
  // Semestre 2026/2: 14/08/2026 (quinta) a 12/12/2026 (sexta)
  { start: new Date(2026, 7, 14), end: new Date(2026, 11, 12) },
];

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1 = segunda, 5 = sexta
}

function isInAcademicCalendar(date: Date): boolean {
  return academicCalendar.some(
    (period) => date >= period.start && date <= period.end
  );
}

function calculateBusinessDaysRemaining(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const graduationDate = new Date(2026, 11, 12);
  graduationDate.setHours(0, 0, 0, 0);

  let businessDays = 0;
  const currentDate = new Date(today);

  while (currentDate <= graduationDate) {
    if (isWeekday(currentDate) && isInAcademicCalendar(currentDate)) {
      businessDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}

export default function Home() {
  const [isBusinessDays, setIsBusinessDays] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [businessDaysRemaining, setBusinessDaysRemaining] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [businessTimeRemaining, setBusinessTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const graduationDate = new Date("2026-12-12T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = graduationDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setDaysRemaining(days);
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setDaysRemaining(0);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      // Calcular dias úteis dinâmico
      const businessDays = calculateBusinessDaysRemaining();
      setBusinessDaysRemaining(businessDays);

      // Calcular tempo restante para dias úteis
      // Encontrar o próximo dia útil a partir de agora
      const today = new Date();
      let nextBusinessDay = new Date(today);
      
      // Se hoje é fim de semana ou não está no calendário acadêmico, encontrar o próximo dia útil
      while (!isWeekday(nextBusinessDay) || !isInAcademicCalendar(nextBusinessDay)) {
        nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
      }

      // Definir para o final do dia útil (23:59:59)
      nextBusinessDay.setHours(23, 59, 59, 999);
      
      const businessDayDifference = nextBusinessDay.getTime() - now;

      if (businessDayDifference > 0) {
        const businessHours = Math.floor(
          (businessDayDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const businessMinutes = Math.floor(
          (businessDayDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const businessSeconds = Math.floor(
          (businessDayDifference % (1000 * 60)) / 1000
        );

        setBusinessTimeRemaining({
          days: businessDays,
          hours: businessHours,
          minutes: businessMinutes,
          seconds: businessSeconds,
        });
      } else {
        setBusinessTimeRemaining({
          days: businessDays,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentTime = isBusinessDays ? businessTimeRemaining : timeRemaining;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="text-center relative z-10 w-full max-w-4xl">
        {/* Switch Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isBusinessDays ? 'text-cyan-400' : 'text-gray-500'}`}>
            Tempo Total
          </span>
          <button
            onClick={() => setIsBusinessDays(!isBusinessDays)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isBusinessDays ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                isBusinessDays ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isBusinessDays ? 'text-purple-400' : 'text-gray-500'}`}>
            Dias Úteis
          </span>
        </div>

        {/* Circular Counter */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 rounded-full ${
              isBusinessDays 
                ? 'bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30' 
                : 'bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30'
            } blur-xl animate-pulse`}></div>
            
            {/* Main circle */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl flex flex-col items-center justify-center p-8">
              {/* Time display */}
              <div className="flex flex-col items-center justify-center space-y-2">
                {/* Days - Large */}
                <div className="flex flex-col items-center">
                  <span className={`text-7xl md:text-8xl font-bold font-mono ${
                    isBusinessDays 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'
                  } drop-shadow-lg`}>
                    {currentTime.days}
                  </span>
                </div>

                {/* Hours, Minutes, Seconds - Smaller */}
                <div className="flex items-center gap-3 md:gap-4 mt-6">
                  <span className={`text-4xl md:text-5xl font-bold font-mono ${
                    isBusinessDays 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'
                  }`}>
                    {String(currentTime.hours).padStart(2, "0")}
                  </span>

                  <span className={`text-3xl md:text-4xl font-bold ${
                    isBusinessDays ? 'text-purple-400/50' : 'text-cyan-400/50'
                  }`}>
                    :
                  </span>

                  <span className={`text-4xl md:text-5xl font-bold font-mono ${
                    isBusinessDays 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'
                  }`}>
                    {String(currentTime.minutes).padStart(2, "0")}
                  </span>

                  <span className={`text-3xl md:text-4xl font-bold ${
                    isBusinessDays ? 'text-purple-400/50' : 'text-cyan-400/50'
                  }`}>
                    :
                  </span>

                  <span className={`text-4xl md:text-5xl font-bold font-mono ${
                    isBusinessDays 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'
                  }`}>
                    {String(currentTime.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
