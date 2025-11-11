import { useEffect, useState } from "react";
import { APP_TITLE } from "@/const";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          {APP_TITLE}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          12 de dezembro de 2026
        </p>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tempo Total</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {timeRemaining.days}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Dias</p>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeRemaining.hours).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Horas</p>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="bg-purple-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeRemaining.minutes).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Minutos</p>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="bg-pink-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeRemaining.seconds).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Segundos</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-2xl md:text-3xl font-bold text-gray-800">
              {daysRemaining} dias
            </p>
            <p className="text-gray-600 mt-2">até sua formatura! 🎓</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dias Úteis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Business Days */}
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {businessTimeRemaining.days}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Dias</p>
            </div>

            {/* Business Hours */}
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(businessTimeRemaining.hours).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Horas</p>
            </div>

            {/* Business Minutes */}
            <div className="flex flex-col items-center">
              <div className="bg-teal-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(businessTimeRemaining.minutes).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Minutos</p>
            </div>

            {/* Business Seconds */}
            <div className="flex flex-col items-center">
              <div className="bg-cyan-500 text-white rounded-lg p-6 md:p-8 w-full">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(businessTimeRemaining.seconds).padStart(2, "0")}
                </span>
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Segundos</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-2xl md:text-3xl font-bold text-gray-800">
              {businessDaysRemaining} dias úteis
            </p>
            <p className="text-gray-600 mt-2">
              (segunda a sexta, conforme calendário acadêmico)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
