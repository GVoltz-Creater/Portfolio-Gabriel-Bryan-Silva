import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  Scale, 
  ShieldCheck, 
  Users, 
  Globe,
  Loader2,
  Sun,
  Moon,
  History,
  FileText,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { DILEMMAS, PHILOSOPHERS } from './constants';
import { 
  PhilosophicalTradition, 
  Scores, 
  UserChoice,
  HistoryItem,
  CustomDilemma
} from './types';
import { 
  getChoiceAnalysis, 
  getFinalProfile, 
  getCustomDilemma, 
  getPhilosopherInsight 
} from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<'welcome' | 'dilemma' | 'profile'>('welcome');
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const [scores, setScores] = useState<Scores>({
    [PhilosophicalTradition.UTILITARIANISM]: 0,
    [PhilosophicalTradition.DEONTOLOGY]: 0,
    [PhilosophicalTradition.CONTRACTUALISM]: 0,
    [PhilosophicalTradition.PLURALISM]: 0,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalProfileData, setFinalProfileData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // New features state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<string | null>(null);
  const [philosopherInsight, setPhilosopherInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [customDilemma, setCustomDilemma] = useState<CustomDilemma | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [analyticsPing, setAnalyticsPing] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ethos_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (analyticsPing) {
      const timer = setTimeout(() => setAnalyticsPing(null), 1800);
      return () => clearTimeout(timer);
    }
  }, [analyticsPing]);

  const trackEvent = (name: string) => {
    setAnalyticsPing(`📊 ${name}`);
  };

  const currentDilemma = DILEMMAS[currentDilemmaIndex];

  const handleStart = () => {
    setStep('dilemma');
    trackEvent('journey_started');
  };

  const handleChoice = async (choiceId: 'A' | 'B') => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    const choice = currentDilemma.choices.find(c => c.id === choiceId)!;
    
    trackEvent('dilemma_choice');
    
    // Update scores
    const newScores = { ...scores };
    Object.entries(choice.scores).forEach(([tradition, value]) => {
      newScores[tradition as PhilosophicalTradition] += value || 0;
    });
    setScores(newScores);

    // Get AI analysis
    const analysis = await getChoiceAnalysis(
      currentDilemma.title,
      currentDilemma.scenario,
      choice.text
    );

    const newUserChoice: UserChoice = {
      dilemmaId: currentDilemma.id,
      choiceId,
      analysis
    };

    setUserChoices([...userChoices, newUserChoice]);
    setIsAnalyzing(false);
  };

  const nextDilemma = async () => {
    if (currentDilemmaIndex < DILEMMAS.length - 1) {
      setCurrentDilemmaIndex(currentDilemmaIndex + 1);
    } else {
      setStep('profile');
      setIsAnalyzing(true);
      const profile = await getFinalProfile(scores, userChoices);
      if (profile) {
        setFinalProfileData(profile);
        saveToHistory(profile, scores);
        trackEvent('profile_completed');
      }
      setIsAnalyzing(false);
    }
  };

  const saveToHistory = (profile: any, finalScores: Scores) => {
    const dominant = Object.entries(finalScores).sort((a,b) => b[1]-a[1])[0][0] as PhilosophicalTradition;
    const newItem: HistoryItem = {
      id: Date.now(),
      title: profile.title,
      description: profile.description,
      dominant,
      scores: finalScores,
      percentages: profile.percentages,
      philosopher: profile.philosopher,
      date: new Date().toLocaleDateString('pt-BR')
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('ethos_history', JSON.stringify(newHistory));
  };

  const deleteHistoryItem = (id: number) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('ethos_history', JSON.stringify(newHistory));
  };

  const reset = () => {
    setStep('welcome');
    setCurrentDilemmaIndex(0);
    setUserChoices([]);
    setScores({
      [PhilosophicalTradition.UTILITARIANISM]: 0,
      [PhilosophicalTradition.DEONTOLOGY]: 0,
      [PhilosophicalTradition.CONTRACTUALISM]: 0,
      [PhilosophicalTradition.PLURALISM]: 0,
    });
    setFinalProfileData(null);
    setSelectedPhilosopher(null);
    setPhilosopherInsight(null);
    setCustomDilemma(null);
  };

  const handlePhilosopherCompare = async (key: string) => {
    setSelectedPhilosopher(key);
    setIsLoadingInsight(true);
    const insight = await getPhilosopherInsight(finalProfileData, PHILOSOPHERS[key]);
    setPhilosopherInsight(insight);
    setIsLoadingInsight(false);
  };

  const handleGenerateCustom = async () => {
    setIsGeneratingCustom(true);
    const dilemma = await getCustomDilemma(scores, finalProfileData.title);
    setCustomDilemma(dilemma);
    setIsGeneratingCustom(false);
  };

  const exportPDF = () => {
    window.print();
  };

  const progress = ((currentDilemmaIndex + (userChoices.length > currentDilemmaIndex ? 1 : 0)) / DILEMMAS.length) * 100;

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#08080f] text-[#e8e8f0] font-sans selection:bg-indigo-500/30 transition-colors duration-300 relative overflow-x-hidden">
        
        {/* Ambient Glow */}
        <div className="fixed top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none z-0" />

        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative z-10">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display">Ethos AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 rounded-xl glass-button text-gray-400 hover:text-indigo-400 relative"
                title="Histórico"
              >
                <History className="w-5 h-5" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full font-mono">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl glass-button text-gray-400 hover:text-indigo-400"
                title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {step !== 'welcome' && (
                <button 
                  onClick={reset}
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>
              )}
            </div>
          </header>

          {/* Status Bar */}
          <div className="flex justify-end -mt-8 mb-6">
            <div className="firebase-status offline">
              <div className="fb-dot" />
              <span>offline (local)</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black text-white leading-tight font-display tracking-tighter">
                    Descubra sua<br/><em className="text-indigo-400 not-italic">Bússola Moral</em>.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                    Uma experiência filosófica interativa. Não há respostas certas — apenas escolhas e o que elas revelam sobre como você enxerga o mundo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Scale, title: "Utilitarismo", desc: "O maior bem para o maior número." },
                    { icon: ShieldCheck, title: "Deontologia", desc: "Deveres e direitos universais." },
                    { icon: Users, title: "Contratualismo", desc: "Justiça e equidade social." },
                    { icon: Globe, title: "Pluralismo", desc: "Valores em conflito no contexto." },
                  ].map((item, i) => (
                    <div key={i} className="p-6 ethos-card flex items-start gap-4">
                      <item.icon className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                >
                  Começar Experiência
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 'dilemma' && (
              <motion.div
                key="dilemma"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                    <span>Dilema {currentDilemmaIndex + 1} de {DILEMMAS.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-[0.15em] font-mono">
                    {currentDilemma.category}
                  </div>
                  <h2 className="text-4xl font-bold text-white leading-tight font-display tracking-tight">
                    {currentDilemma.title}
                  </h2>
                  
                  <p className="text-lg text-gray-300 leading-relaxed italic border-l-[3px] border-indigo-500/40 pl-8 py-4 bg-white/5 rounded-r-2xl">
                    "{currentDilemma.scenario}"
                  </p>
                </div>

                <div className="space-y-4">
                  {currentDilemma.choices.map((choice) => {
                    const hasChosen = userChoices.length > currentDilemmaIndex;
                    const isThisChoice = userChoices[currentDilemmaIndex]?.choiceId === choice.id;

                    return (
                      <button
                        key={choice.id}
                        disabled={hasChosen || isAnalyzing}
                        onClick={() => handleChoice(choice.id)}
                        className={`w-full text-left p-6 ethos-card transition-all relative overflow-hidden group ${
                          hasChosen
                            ? isThisChoice
                              ? 'bg-indigo-500/10 border-indigo-500 text-white'
                              : 'opacity-30 grayscale'
                            : 'hover:border-indigo-500/50 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-5 relative z-10">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isThisChoice ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-500'
                          }`}>
                            {choice.id}
                          </span>
                          <span className="text-lg font-medium leading-snug">{choice.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Analysis Section */}
                <AnimatePresence>
                  {userChoices[currentDilemmaIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8 pt-10 border-t border-white/10"
                    >
                      <div className="ethos-card bg-white/5 p-8 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px] uppercase tracking-[0.15em] font-mono">
                          <Info className="w-4 h-4" />
                          Análise Filosófica
                        </div>
                        <p className="text-gray-300 leading-relaxed text-[15px]">
                          {userChoices[currentDilemmaIndex].analysis}
                        </p>
                      </div>

                      <button
                        onClick={nextDilemma}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 px-8 py-5 rounded-full font-bold text-lg transition-all active:scale-95 shadow-xl"
                      >
                        {currentDilemmaIndex === DILEMMAS.length - 1 ? 'Ver Perfil Final' : 'Próximo Dilema'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isAnalyzing && !userChoices[currentDilemmaIndex] && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Consultando a IA...</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-16 pb-20"
              >
                {!finalProfileData ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-8">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-400" />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white font-display tracking-tight">Calculando sua Bússola Moral</h3>
                      <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Analisando escolhas através das tradições...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold uppercase tracking-[0.2em] font-mono mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        Perfil Concluído
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black text-white leading-tight font-display tracking-tighter">
                        {finalProfileData.title}
                      </h2>
                      <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {finalProfileData.description}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(finalProfileData.percentages).map(([tradition, percent]: [any, any]) => (
                        <div key={tradition} className={`p-8 ethos-card text-center space-y-3 ${
                          finalProfileData.dominantTradition === tradition ? 'bg-indigo-500/10 border-indigo-500/30' : ''
                        }`}>
                          <div className={`text-4xl font-black font-display ${
                            finalProfileData.dominantTradition === tradition ? 'text-indigo-400' : 'text-white'
                          }`}>{percent}%</div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 font-mono">
                            {tradition === PhilosophicalTradition.UTILITARIANISM ? 'Utilitarismo' :
                             tradition === PhilosophicalTradition.DEONTOLOGY ? 'Deontologia' :
                             tradition === PhilosophicalTradition.CONTRACTUALISM ? 'Contratualismo' : 'Pluralismo'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={exportPDF}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-3 glass-button text-indigo-400 hover:text-indigo-300 px-6 py-4 rounded-2xl font-bold transition-all"
                      >
                        <FileText className="w-5 h-5" />
                        Exportar Relatório PDF
                      </button>
                      <button 
                        onClick={() => document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-3 glass-button text-gray-400 hover:text-white px-6 py-4 rounded-2xl font-bold transition-all"
                      >
                        <Users className="w-5 h-5" />
                        Comparar com Filósofo
                      </button>
                    </div>

                    <div className="space-y-12">
                      <div className="ethos-card p-10 space-y-8">
                        <h3 className="text-3xl font-bold text-white font-display tracking-tight">Resumo da Jornada</h3>
                        <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                          {finalProfileData.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="ethos-card p-10 space-y-6 bg-indigo-500/5 border-indigo-500/20">
                          <h4 className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[11px] font-mono">Para Estudar</h4>
                          <p className="text-3xl font-bold text-white font-display tracking-tight">{finalProfileData.philosopher}</p>
                          <p className="text-gray-500 leading-relaxed">
                            As obras deste pensador ressoam profundamente com a lógica que você aplicou aos dilemas apresentados.
                          </p>
                        </div>
                        <div className="ethos-card p-10 space-y-6">
                          <h4 className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px] font-mono">Reflexão Final</h4>
                          <p className="text-2xl font-medium text-gray-300 italic leading-relaxed font-display">
                            "{finalProfileData.reflectionQuestion}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Philosopher Comparison Section */}
                    <div id="compare-section" className="ethos-card p-10 space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-white font-display tracking-tight">Comparação com Filósofos</h3>
                        <p className="text-gray-500">Selecione um pensador clássico para comparar suas orientações morais.</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {Object.entries(PHILOSOPHERS).map(([key, phil]) => (
                          <button
                            key={key}
                            onClick={() => handlePhilosopherCompare(key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                              selectedPhilosopher === key 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
                            }`}
                          >
                            {phil.name}
                          </button>
                        ))}
                      </div>

                      {selectedPhilosopher && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Você</div>
                              <div className="space-y-4">
                                {Object.entries(finalProfileData.percentages).map(([k, v]: [any, any]) => (
                                  <div key={k} className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-400">{TRADITIONS[k as PhilosophicalTradition].label}</span>
                                      <span className="text-white font-mono">{v}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500" style={{ width: `${v}%` }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-6">
                              <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">{PHILOSOPHERS[selectedPhilosopher].name}</div>
                              <div className="space-y-4">
                                {Object.entries(PHILOSOPHERS[selectedPhilosopher].scores).map(([k, v]: [any, any]) => (
                                  <div key={k} className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-400">{TRADITIONS[k as PhilosophicalTradition].label}</span>
                                      <span className="text-white font-mono">{v}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-500" style={{ width: `${v}%` }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {isLoadingInsight ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                            </div>
                          ) : philosopherInsight && (
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 text-amber-200/80 text-[15px] leading-relaxed italic">
                              💡 {philosopherInsight}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Custom Dilemma Section */}
                    <div className="ethos-card p-10 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-white font-display tracking-tight">Dilema Personalizado</h3>
                        <p className="text-gray-500">Com base no seu perfil, a IA criará um dilema único para desafiar sua perspectiva.</p>
                      </div>

                      {isGeneratingCustom ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Tecendo dilema...</p>
                        </div>
                      ) : customDilemma ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-8"
                        >
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                              {customDilemma.category}
                            </div>
                            <h4 className="text-2xl font-bold text-white font-display">{customDilemma.title}</h4>
                            <p className="text-lg text-gray-300 italic leading-relaxed border-l-2 border-indigo-500/30 pl-6">
                              "{customDilemma.scenario}"
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400">
                                <span className="font-mono text-indigo-400 mr-3">A</span> {customDilemma.choiceA}
                              </div>
                              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400">
                                <span className="font-mono text-indigo-400 mr-3">B</span> {customDilemma.choiceB}
                              </div>
                            </div>
                            <div className="text-xs font-mono text-amber-500/70 uppercase tracking-widest">
                              Tensão Central: {customDilemma.tension}
                            </div>
                          </div>
                          <button 
                            onClick={handleGenerateCustom}
                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Gerar Outro Dilema
                          </button>
                        </motion.div>
                      ) : (
                        <button
                          onClick={handleGenerateCustom}
                          className="flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 px-8 py-4 rounded-2xl font-bold transition-all"
                        >
                          <Sparkles className="w-5 h-5" />
                          Gerar Dilema para meu Perfil
                        </button>
                      )}
                    </div>

                    <div className="flex justify-center pt-12">
                      <button
                        onClick={reset}
                        className="flex items-center gap-3 glass-button text-gray-400 hover:text-white px-10 py-5 rounded-full font-bold transition-all active:scale-95"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Refazer Experiência
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-3xl bg-[#0f0f1a] border-t border-white/10 rounded-t-[32px] p-8 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white font-display">Histórico de Sessões</h3>
                    <span className="local-badge">💾 Local</span>
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="text-4xl">📂</div>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Nenhuma sessão salva ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map(item => (
                      <div key={item.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-6 hover:border-indigo-500/30 transition-all group">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white font-display">{item.title}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className="text-indigo-400">{TRADITIONS[item.dominant].label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Analytics Ping */}
        <AnimatePresence>
          {analyticsPing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="analytics-ping show"
            >
              {analyticsPing}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

const TRADITIONS: Record<PhilosophicalTradition, { label: string; color: string }> = {
  [PhilosophicalTradition.UTILITARIANISM]: { label: 'Utilitarismo', color: '#6f4cff' },
  [PhilosophicalTradition.DEONTOLOGY]: { label: 'Deontologia', color: '#f472b6' },
  [PhilosophicalTradition.CONTRACTUALISM]: { label: 'Contratualismo', color: '#34d399' },
  [PhilosophicalTradition.PLURALISM]: { label: 'Pluralismo', color: '#fbbf24' }
};
