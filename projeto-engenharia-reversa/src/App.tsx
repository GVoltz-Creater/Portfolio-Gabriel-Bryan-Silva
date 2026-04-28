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
  Moon
} from 'lucide-react';
import { DILEMMAS } from './constants';
import { 
  PhilosophicalTradition, 
  Scores, 
  UserChoice 
} from './types';
import { getChoiceAnalysis, getFinalProfile } from './services/geminiService';

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

  const currentDilemma = DILEMMAS[currentDilemmaIndex];

  const handleStart = () => {
    setStep('dilemma');
  };

  const handleChoice = async (choiceId: 'A' | 'B') => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    const choice = currentDilemma.choices.find(c => c.id === choiceId)!;
    
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
      setFinalProfileData(profile);
      setIsAnalyzing(false);
    }
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
  };

  const progress = ((currentDilemmaIndex + (userChoices.length > currentDilemmaIndex ? 1 : 0)) / DILEMMAS.length) * 100;

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0c] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Machine Moral</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-all"
                title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {step !== 'welcome' && (
                <button 
                  onClick={reset}
                  className="text-gray-500 hover:text-indigo-500 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>
              )}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Enfrente seus <span className="text-indigo-500">Dilemas</span>.
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                    Uma experiência filosófica interativa. Não há respostas certas — apenas escolhas e o que elas revelam sobre sua bússola moral.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Scale, title: "Utilitarismo", desc: "O maior bem para o maior número." },
                    { icon: ShieldCheck, title: "Deontologia", desc: "Deveres e direitos universais." },
                    { icon: Users, title: "Contratualismo", desc: "Justiça e equidade social." },
                    { icon: Globe, title: "Pluralismo", desc: "Valores em conflito no contexto." },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-start gap-4">
                      <item.icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
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
                className="space-y-8"
              >
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    <span>Dilema {currentDilemmaIndex + 1} de {DILEMMAS.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    {currentDilemma.category}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {currentDilemma.title}
                  </h2>
                  
                  {/* Dilemma Image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl">
                    <img 
                      src={currentDilemma.imageUrl} 
                      alt={currentDilemma.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0c] via-transparent to-transparent opacity-60" />
                  </div>

                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-indigo-500/30 pl-6 py-2">
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
                        className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                          hasChosen
                            ? isThisChoice
                              ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                              : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-500 opacity-50'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500/50 hover:bg-gray-100 dark:hover:bg-white/[0.07] text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4 relative z-10">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                            isThisChoice ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                          }`}>
                            {choice.id}
                          </span>
                          <span className="text-lg font-medium">{choice.text}</span>
                        </div>
                        {isThisChoice && (
                          <motion.div 
                            layoutId="active-choice"
                            className="absolute inset-0 bg-indigo-500/10"
                          />
                        )}
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
                      className="space-y-6 pt-8 border-t border-gray-200 dark:border-white/10"
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
                          <Info className="w-4 h-4" />
                          Análise Filosófica
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {userChoices[currentDilemmaIndex].analysis}
                        </p>
                      </div>

                      <button
                        onClick={nextDilemma}
                        className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95"
                      >
                        {currentDilemmaIndex === DILEMMAS.length - 1 ? 'Ver Perfil Final' : 'Próximo Dilema'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isAnalyzing && !userChoices[currentDilemmaIndex] && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                )}
              </motion.div>
            )}

            {step === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12 pb-20"
              >
                {!finalProfileData ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Calculando sua Bússola Moral</h3>
                      <p className="text-gray-500">Analisando suas escolhas através das tradições filosóficas...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-widest mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        Perfil Concluído
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        {finalProfileData.title}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {finalProfileData.description}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(finalProfileData.percentages).map(([tradition, percent]: [any, any]) => (
                        <div key={tradition} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center space-y-2">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">{percent}%</div>
                          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {tradition === PhilosophicalTradition.UTILITARIANISM ? 'Utilitarismo' :
                             tradition === PhilosophicalTradition.DEONTOLOGY ? 'Deontologia' :
                             tradition === PhilosophicalTradition.CONTRACTUALISM ? 'Contratualismo' : 'Pluralismo'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-8">
                      <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resumo da Jornada</h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                          {finalProfileData.summary}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl p-8 space-y-4">
                          <h4 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm">Para Estudar</h4>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{finalProfileData.philosopher}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            As obras deste pensador ressoam profundamente com a lógica que você aplicou aos dilemas apresentados.
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-4">
                          <h4 className="text-gray-500 font-bold uppercase tracking-widest text-sm">Reflexão Final</h4>
                          <p className="text-xl font-medium text-gray-700 dark:text-gray-200 italic leading-relaxed">
                            "{finalProfileData.reflectionQuestion}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-8">
                      <button
                        onClick={reset}
                        className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold transition-all active:scale-95"
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
      </div>
    </div>
  );
}
