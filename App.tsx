
import React, { useState, useEffect } from 'react';
import { Difficulty, GameState, Question, Score, House, SortingResult } from './types';
import { fetchTriviaQuestions, sortIntoHouse } from './services/geminiService';
import MagicBackground from './components/MagicBackground';
import DifficultySelector from './components/DifficultySelector';
import { Sparkles, Zap, BarChart3, Settings, AlertCircle, RotateCcw, Wand2, GraduationCap, ChevronLeft, CheckCircle2, Info } from 'lucide-react';

const SORTING_HAT_IMG = "https://images.unsplash.com/photo-1598153346810-860daa814c4b?q=80&w=1000&auto=format&fit=crop"; 
// הערה: נשתמש בתמונה איכותית של מצנפת המיון. בגרסה הסופית ניתן להחליף בנתיב מקומי אם התמונה צורפה כקובץ.
const HAT_PLACEHOLDER = "https://static.wikia.nocookie.net/harrypotter/images/6/62/Sorting_Hat.png";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.WIZARD);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [sortingData, setSortingData] = useState<SortingResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('מתייעץ עם מצנפת המיון...');
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const startGame = async () => {
    setGameState('LOADING');
    setError(null);
    setLoadingMessage('מזמן ידע מהספרייה האסורה...');
    setShowReview(false);
    
    try {
      const q = await fetchTriviaQuestions(difficulty);
      setQuestions(q);
      setCurrentQuestionIndex(0);
      setScore({ correct: 0, total: q.length });
      setGameState('PLAYING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'לחש אפל שיבש את התקשורת שלנו.');
      setGameState('HOME');
    }
  };

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      triggerSorting();
    }
  };

  const triggerSorting = async () => {
    setGameState('SORTING');
    try {
      const result = await sortIntoHouse(score.correct, score.total, difficulty);
      setSortingData(result);
    } catch (err) {
      setSortingData({ house: House.GRYFFINDOR, dialogue: "הממ, מוח מורכב בהחלט..." });
    }
  };

  const resetGame = () => {
    setGameState('HOME');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSortingData(null);
    setShowReview(false);
  };

  const getHouseColor = (house?: House) => {
    switch (house) {
      case House.GRYFFINDOR: return 'text-red-500 shadow-red-500/50';
      case House.SLYTHERIN: return 'text-emerald-500 shadow-emerald-500/50';
      case House.RAVENCLAW: return 'text-blue-500 shadow-blue-500/50';
      case House.HUFFLEPUFF: return 'text-yellow-500 shadow-yellow-500/50';
      default: return 'text-white';
    }
  };

  const getHouseBorder = (house?: House) => {
    switch (house) {
      case House.GRYFFINDOR: return 'border-red-500/30';
      case House.SLYTHERIN: return 'border-emerald-500/30';
      case House.RAVENCLAW: return 'border-blue-500/30';
      case House.HUFFLEPUFF: return 'border-yellow-500/30';
      default: return 'border-white/10';
    }
  };

  const getHouseTheme = (house?: House) => {
    switch (house) {
      case House.GRYFFINDOR: return 'from-red-900/40 to-[#0a0a1f]';
      case House.SLYTHERIN: return 'from-emerald-900/40 to-[#0a0a1f]';
      case House.RAVENCLAW: return 'from-blue-900/40 to-[#0a0a1f]';
      case House.HUFFLEPUFF: return 'from-yellow-900/40 to-[#0a0a1f]';
      default: return 'from-[#1a1a4a] to-[#0a0a1f]';
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center p-6 md:p-12 transition-colors duration-1000 bg-gradient-to-b ${sortingData ? getHouseTheme(sortingData.house) : 'from-[#0a0a1f] to-[#0a0a1f]'}`} dir="rtl">
      <MagicBackground />

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        {gameState === 'HOME' && (
          <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-[#8e7aff] text-sm font-bold tracking-[0.4em] uppercase font-cinzel">עולם הקוסמים של</h2>
              <h1 className="text-5xl md:text-7xl font-playfair font-bold">
                טריוויה <span className="text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">קסומה</span>
              </h1>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 md:w-80 md:h-80 border border-[#2d2d5a] rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-56 h-56 md:w-72 md:h-72 border border-[#3d3d7a] rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full border-2 border-[#facc15]/60 flex items-center justify-center bg-[#0a0a2a] shadow-[0_0_40px_rgba(250,204,21,0.2)]">
                <div className="absolute top-8 left-12"><Sparkles className="w-4 h-4 text-[#facc15] opacity-60" /></div>
                <div className="absolute bottom-10 right-10"><Wand2 className="w-5 h-5 text-[#facc15] opacity-60 rotate-45" /></div>
                <span className="text-8xl md:text-9xl font-playfair italic text-[#facc15] select-none">H</span>
              </div>
            </div>

            <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

            <button 
              onClick={startGame}
              className="group relative w-full max-w-sm h-16 rounded-full bg-gradient-to-r from-[#eab308] to-[#fde047] text-black font-bold text-xl tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.5)] transition-all active:scale-95 overflow-hidden"
            >
              התחל במשחק
              <Zap className="w-6 h-6 fill-black" />
            </button>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-lg text-sm animate-bounce">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        )}

        {gameState === 'LOADING' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-[#2d2d5a] border-t-[#facc15] rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#facc15]" />
            </div>
            <p className="text-[#8e7aff] font-cinzel tracking-widest text-lg">{loadingMessage}</p>
          </div>
        )}

        {gameState === 'PLAYING' && questions.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-8 md:space-y-12">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[#8e7aff] font-bold tracking-widest uppercase text-xs">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</span>
                <span className="text-[#facc15] font-playfair text-lg italic">מסלול {difficulty}</span>
              </div>
              <div className="w-full h-1 bg-[#1a1a3a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6b46ff] to-[#facc15] transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-center leading-relaxed">
              {questions[currentQuestionIndex].question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="group relative p-6 bg-[#151532]/80 border border-[#2d2d5a] rounded-2xl text-right hover:border-[#6b46ff] hover:bg-[#1a1a4a] transition-all duration-300"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#2d2d5a] flex items-center justify-center text-xs font-bold text-[#8e7aff] group-hover:bg-[#6b46ff] group-hover:text-white">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg text-white group-hover:translate-x-[-4px] transition-transform">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'SORTING' && (
          <div className="flex flex-col items-center justify-center w-full max-w-xl text-center space-y-8 p-4">
            <div className="relative mb-4">
              <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center transition-all duration-1000 ${sortingData ? 'scale-110' : 'animate-hat-float'}`}>
                {/* הילת אור מאחורי המצנפת */}
                <div className={`absolute inset-0 bg-radial-gradient from-[#facc15]/20 to-transparent blur-3xl transition-opacity duration-1000 ${sortingData ? 'opacity-100' : 'opacity-40'}`}></div>
                
                <img 
                  src={HAT_PLACEHOLDER} 
                  alt="מצנפת המיון" 
                  className={`w-full h-full object-contain hat-glow z-10 ${sortingData ? 'animate-hat-talk' : ''}`}
                />
              </div>
              {!sortingData && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[#8e7aff] font-cinzel text-xs tracking-widest animate-pulse uppercase">קורא את מחשבותיך...</span>
                </div>
              )}
            </div>

            <div className="min-h-[150px] flex flex-col items-center justify-center space-y-6">
              {sortingData ? (
                <>
                  <p className="text-xl md:text-2xl italic font-playfair text-white/90 animate-in slide-in-from-bottom duration-1000 px-6">
                    "{sortingData.dialogue}"
                  </p>
                  <div className="pt-4 animate-in zoom-in fade-in duration-1000 delay-500">
                    <h3 className={`text-6xl md:text-8xl font-cinzel font-bold uppercase tracking-tighter ${getHouseColor(sortingData.house)} drop-shadow-2xl`}>
                      {sortingData.house}!
                    </h3>
                    <button 
                      onClick={() => setGameState('RESULTS')}
                      className="mt-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.3em] text-xs font-bold group"
                    >
                      היכנס לאולם הגדול <ChevronLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-white/40 font-playfair italic text-xl">"הממ... בוא נראה לאן אתה שייך..."</p>
              )}
            </div>
          </div>
        )}

        {gameState === 'RESULTS' && (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-12 text-center animate-in fade-in duration-1000">
            {!showReview ? (
              <>
                <div className="space-y-4">
                  <h2 className={`font-cinzel text-xl tracking-[0.3em] uppercase ${sortingData ? getHouseColor(sortingData.house) : 'text-[#8e7aff]'}`}>
                    דו"ח בוגר בית {sortingData?.house}
                  </h2>
                  <div className="relative py-8">
                     <div className="absolute inset-0 flex items-center justify-center blur-3xl opacity-20">
                        <div className={`w-48 h-48 rounded-full ${sortingData?.house === House.SLYTHERIN ? 'bg-emerald-500' : sortingData?.house === House.RAVENCLAW ? 'bg-blue-500' : sortingData?.house === House.HUFFLEPUFF ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                     </div>
                     <div className="relative">
                        <span className="text-8xl md:text-9xl font-playfair font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                          {score.correct}<span className="text-3xl text-white/40 font-normal mx-2">/</span>{score.total}
                        </span>
                     </div>
                  </div>
                  <p className="text-xl text-white/80 max-w-sm mx-auto font-playfair italic">
                    תוצאה נהדרת עבור {sortingData?.house}. הידע הקסום שלך מרשים ביותר!
                  </p>
                </div>

                <div className="flex flex-col w-full max-w-sm gap-4">
                  <button 
                    onClick={() => setShowReview(true)}
                    className="w-full h-14 rounded-full bg-white/10 border border-white/20 text-white font-bold text-lg tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                  >
                    <Info className="w-5 h-5" />
                    צפה בתשובות
                  </button>
                  <button 
                    onClick={startGame}
                    className={`group relative w-full h-16 rounded-full text-white font-bold text-lg tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${sortingData?.house === House.SLYTHERIN ? 'bg-emerald-700 shadow-emerald-900/40 hover:bg-emerald-600' : sortingData?.house === House.RAVENCLAW ? 'bg-blue-700 shadow-blue-900/40 hover:bg-blue-600' : sortingData?.house === House.HUFFLEPUFF ? 'bg-yellow-600 shadow-yellow-900/40 hover:bg-yellow-500' : 'bg-red-700 shadow-red-900/40 hover:bg-red-600'}`}
                  >
                    דו-קרב נוסף
                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                  <button 
                    onClick={resetGame}
                    className="w-full h-14 rounded-full bg-transparent border border-white/10 text-white/60 font-bold text-lg tracking-widest flex items-center justify-center hover:text-white transition-all"
                  >
                    חזור לדף הבית
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full space-y-8 animate-in slide-in-from-left duration-500">
                <div className="flex items-center justify-between sticky top-0 bg-[#0a0a1f]/80 backdrop-blur-md py-4 z-20 border-b border-white/10">
                  <h3 className="text-2xl font-cinzel font-bold text-[#facc15]">ארכיון החוכמה</h3>
                  <button 
                    onClick={() => setShowReview(false)}
                    className="text-white/60 hover:text-white text-xs font-bold tracking-widest uppercase"
                  >
                    סגור סקירה
                  </button>
                </div>
                
                <div className="space-y-6 text-right pb-12 overflow-y-auto max-h-[60vh] pl-2 custom-scrollbar" dir="rtl">
                  {questions.map((q, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl bg-[#151532]/60 border ${getHouseBorder(sortingData?.house)} space-y-4`}>
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a3a] flex items-center justify-center font-bold text-xs border border-white/10">
                          {idx + 1}
                        </span>
                        <h4 className="text-lg font-playfair font-bold text-white/90 leading-tight">{q.question}</h4>
                      </div>
                      
                      <div className="pr-12 space-y-3">
                        <div className="flex items-center gap-2 text-[#facc15] bg-[#facc15]/10 p-3 rounded-lg border border-[#facc15]/20">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          <span className="font-semibold">{q.options[q.correctIndex]}</span>
                        </div>
                        {q.explanation && (
                          <div className="text-white/60 text-sm italic border-r-2 border-white/10 pr-4 py-1">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowReview(false)}
                  className={`w-full h-16 rounded-full text-white font-bold text-lg tracking-widest transition-all ${sortingData?.house === House.SLYTHERIN ? 'bg-emerald-700' : sortingData?.house === House.RAVENCLAW ? 'bg-blue-700' : sortingData?.house === House.HUFFLEPUFF ? 'bg-yellow-600' : 'bg-red-700'}`}
                >
                  חזור לתוצאות
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 mb-4 opacity-20 pointer-events-none text-center">
        <span className="font-playfair italic text-[10px] md:text-xs tracking-widest block">תיעוד רשמי של טקס המיון</span>
        <span className="font-playfair italic text-[8px] md:text-[10px] tracking-widest opacity-50 uppercase mt-1">בית הספר הוגוורטס לכישוף ולקוסמות</span>
      </div>
    </div>
  );
};

export default App;
