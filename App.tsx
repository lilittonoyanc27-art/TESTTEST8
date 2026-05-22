import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Volume2, 
  Trophy, 
  Sparkles, 
  Check, 
  ArrowRight,
  Plus,
  Trash2,
  BookMarked,
  Sliders,
  ChevronRight,
  Sparkle,
  Bookmark,
  Languages,
  Info
} from 'lucide-react';

// Interfaces for our structure
interface Sentence {
  id: number;
  sp: string;
  arm: string;
  rus: string;
}

interface Question {
  id: string; // e.g., 'presente_1'
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: {
    arm: string;
    rus: string;
  };
}

interface VocabWord {
  sp: string;
  arm: string;
  rus: string;
  example: string;
}

// Full custom dataset matching user's exact input
const LESSONS_DATA = {
  presente: {
    titleSp: "En la cafetería",
    titleArm: "Սրճարանում",
    conceptSp: "Presente de Indicativo (El presente)",
    conceptArm: "Ներկա ժամանակ",
    themeColor: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    focusColor: "border-amber-500 hover:border-amber-600 bg-amber-50/20",
    sentences: [
      { id: 1, sp: "Carlos trabaja en una cafetería pequeña en el centro.", arm: "Կառլոսն աշխատում է կենտրոնում գտնվող փոքր սրճարանում։", rus: "Карлос работает в маленьком кафе в центре." },
      { id: 2, sp: "Todos los días prepara café, té y bocadillos.", arm: "Ամեն օր նա պատրաստում է սուրճ, թեյ և սենդվիչներ։", rus: "Каждый день он готовит кофе, чай и бутерброды." },
      { id: 3, sp: "Muchos estudiantes vienen por la mañana porque la cafetería está cerca de la universidad.", arm: "Առավոտյան շատ ուսանողներ են գալիս, որովհետև սրճարանը համալսարանի մոտ է։", rus: "Утром приходит много студентов, потому что кафе находится близко от университета." },
      { id: 4, sp: "Carlos es una persona alegre y amable.", arm: "Կառլոսը ուրախ և բարի մարդ է։", rus: "Карлос — веселый и добрый человек." },
      { id: 5, sp: "Habla con los clientes y siempre sonríe.", arm: "Նա խոսում է հաճախորդների հետ և միշտ ժպտում է։", rus: "Он разговаривает с клиентами и всегда улыбается." },
      { id: 6, sp: "A mediodía come una ensalada y bebe agua.", arm: "Կեսօրին նա ուտում է աղցան և ջուր է խմում։", rus: "В полдень он ест салат и пьет воду." },
      { id: 7, sp: "Por la tarde limpia las mesas y ordena la cafetería.", arm: "Կեսօրից հետո նա մաքրում է սեղանները և կարգի է բերում սրճարանը։", rus: "Днем он вытирает столы и прибирает в кафе." },
      { id: 8, sp: "Le gusta su trabajo porque conoce a muchas personas.", arm: "Նրան դուր է գալիս իր աշխատանքը, որովհետև նա շատ մարդկանց է ծանոթանում։", rus: "Ему нравится его работа, потому что он знакомится со многими людьми." }
    ] as Sentence[],
    questions: [
      {
        id: "presente_1",
        question: "¿Dónde trabaja Carlos?",
        options: ["en una cafetería", "en una escuela", "en un hospital"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «en una cafetería» (սրճարանում): Տեքստում հենց սկզբում նշվում է՝ «Carlos trabaja en una cafetería pequeña...»:",
          rus: "Правильный ответ «en una cafetería» (в кафе). В самом начале текста говорится: «Carlos trabaja en una cafetería pequeña...»."
        }
      },
      {
        id: "presente_2",
        question: "¿Qué prepara Carlos?",
        options: ["café, té y bocadillos", "sopa y arroz", "pizza y pasta"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «café, té y bocadillos» (սուրճ, թեյ և սենդվիչներ): Տեքստից՝ «prepara café, té y bocadillos»:",
          rus: "Правильный ответ «café, té y bocadillos» (кофе, чай и бутерброды). Из текста: «prepara café, té y bocadillos»."
        }
      },
      {
        id: "presente_3",
        question: "¿Quiénes vienen por la mañana?",
        options: ["muchos estudiantes", "muchos médicos", "muchos turistas"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «muchos estudiantes» (շատ ուսանողներ): Տեքստում ասվում է՝ «Muchos estudiantes vienen por la mañana»:",
          rus: "Правильный ответ «muchos estudiantes» (много студентов). В тексте утверждается: «Muchos estudiantes vienen por la mañana»."
        }
      },
      {
        id: "presente_4",
        question: "¿Cómo es Carlos?",
        options: ["alegre y amable", "serio y tímido", "alto y fuerte"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «alegre y amable» (ուրախ և բարի): Տեքստից՝ «Carlos es una persona alegre y amable»:",
          rus: "Правильный ответ «alegre y amable» (веселый и добрый). Из текста: «Carlos es una persona alegre y amable»."
        }
      },
      {
        id: "presente_5",
        question: "¿Por qué le gusta su trabajo?",
        options: ["porque conoce a muchas personas", "porque duerme mucho", "porque viaja todos los días"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «porque conoce a muchas personas» (որովհետև ծանոթանում է շատ մարդկանց հետ): Տեքստից՝ «Le gusta su trabajo porque conoce a muchas personas»:",
          rus: "Правильный ответ «porque conoce a muchas personas» (потому что знакомится со многими людьми). Из текста: «Le gusta su trabajo porque conoce a muchas personas»."
        }
      }
    ] as Question[],
    vocab: [
      { sp: "la cafetería", arm: "սրճարան", rus: "кафе", example: "una cafetería pequeña" },
      { sp: "trabaja", arm: "աշխատում է (trabajar)", rus: "работает (работать)", example: "Carlos trabaja aquí" },
      { sp: "bocadillos", arm: "սենդվիչներ", rus: "бутерброды", example: "prepara bocadillos" },
      { sp: "cerca de", arm: "մոտ է", rus: "близко от", example: "cerca de la universidad" },
      { sp: "alegre", arm: "ուրախ", rus: "веселый", example: "una persona alegre" },
      { sp: "limpia", arm: "մաքրում է (limpiar)", rus: "убирает (убирать)", example: "limpia las mesas" },
      { sp: "conoce", arm: "ճանաչում է / ծանոթանում է (conocer)", rus: "знакомится (знакомиться)", example: "conoce a muchas personas" }
    ] as VocabWord[]
  },
  perfecto: {
    titleSp: "Hoy en la playa",
    titleArm: "Այսօր լողափում",
    conceptSp: "Pretérito Perfecto de Indicativo",
    conceptArm: "Անցյալ ժամանակ՝ կապված ներկայի հետ",
    themeColor: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    focusColor: "border-emerald-500 hover:border-emerald-600 bg-emerald-50/20",
    sentences: [
      { id: 1, sp: "Hoy Laura ha ido a la playa con sus amigos.", arm: "Այսօր Լաուրան գնացել է լողափ իր ընկերների հետ։", rus: "Сегодня Лаура пошла на пляж со своими друзьями." },
      { id: 2, sp: "Ha hecho buen tiempo y ha habido mucho sol.", arm: "Եղանակը լավ է եղել, և շատ արև է եղել։", rus: "Была хорошая погода и было много солнца." },
      { id: 3, sp: "Laura ha llevado una toalla, agua y crema solar.", arm: "Լաուրան վերցրել է սրբիչ, ջուր և արևապաշտպան միջոց։", rus: "Лаура взяла с собой полотенце, воду и солнцезащитный крем." },
      { id: 4, sp: "Primero ha nadado en el mar.", arm: "Սկզբում նա լողացել է ծովում։", rus: "Сначала она поплавала в море." },
      { id: 5, sp: "Después ha descansado en la arena y ha escuchado música.", arm: "Հետո նա հանգստացել է ավազի վրա և երաժշտություն է լսել։", rus: "Затем она отдохнула на песке и послушала музыку." },
      { id: 6, sp: "Sus amigos han jugado al voleibol y han tomado muchas fotos.", arm: "Նրա ընկերները վոլեյբոլ են խաղացել և շատ լուսանկարներ են արել։", rus: "Ее друзья поиграли в волейбол и сделали много фотографий." },
      { id: 7, sp: "Por la tarde todos han comido helado y han vuelto a casa muy contentos.", arm: "Կեսօրից հետո բոլորը պաղպաղակ են կերել և շատ ուրախ վերադարձել են տուն։", rus: "Днем все поели мороженого и вернулись домой очень довольными." }
    ] as Sentence[],
    questions: [
      {
        id: "perfecto_1",
        question: "¿Dónde ha ido Laura hoy?",
        options: ["a la playa", "al cine", "al supermercado"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «a la playa» (լողափ): «Hoy Laura ha ido a la playa con sus amigos»:",
          rus: "Правильный ответ «a la playa» (на пляж). Текст: «Hoy Laura ha ido a la playa con sus amigos»."
        }
      },
      {
        id: "perfecto_2",
        question: "¿Con quién ha ido Laura?",
        options: ["con sus amigos", "con su profesora", "con su hermana"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «con sus amigos» (իր ընկերների հետ): Տեքստում ասվում է՝ «con sus amigos»:",
          rus: "Правильный ответ «con sus amigos» (со своими друзьями). Из текста: «con sus amigos»."
        }
      },
      {
        id: "perfecto_3",
        question: "¿Qué ha llevado Laura?",
        options: ["una toalla, agua y crema solar", "un libro y una mochila", "una chaqueta y botas"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «una toalla, agua y crema solar» (սրբիչ, ջուր և արևապաշտպան միջոց (կրեմ)): Տեքստից՝ «ha llevado una toalla, agua y crema solar»:",
          rus: "Правильный ответ «una toalla, agua y crema solar» (полотенце, воду и солнцезащитный крем). Из текста: «Laura ha llevado una toalla, agua y crema solar»."
        }
      },
      {
        id: "perfecto_4",
        question: "¿Qué ha hecho Laura primero?",
        options: ["ha nadado en el mar", "ha dormido en casa", "ha comprado ropa"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «ha nadado en el mar» (լողացել է ծովում): Տեքստից՝ «Primero ha nadado en el mar»:",
          rus: "Правильный ответ «ha nadado en el mar» (поплавала в море). Текст: «Primero ha nadado en el mar»."
        }
      },
      {
        id: "perfecto_5",
        question: "¿Cómo han vuelto todos a casa?",
        options: ["muy contentos", "muy tristes", "muy cansados"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «muy contentos» (շատ ուրախ/բավարարված): Տեքստից՝ «y han vuelto a casa muy contentos»:",
          rus: "Правильный ответ «muy contentos» (очень довольными). Текст: «y han vuelto a casa muy contentos»."
        }
      }
    ] as Question[],
    vocab: [
      { sp: "la playa", arm: "լողափ", rus: "пляж", example: "ha ido a la playa" },
      { sp: "ha ido", arm: "գնացել է (ir)", rus: "пошел/пошла (глагол ir)", example: "hoy Laura ha ido" },
      { sp: "ha hecho", arm: "արել է / եղել է (hacer)", rus: "сделал или была (hacer)", example: "ha hecho buen tiempo" },
      { sp: "ha llevado", arm: "վերցրել է / տարել է (llevar)", rus: "принес/взял (llevar)", example: "Laura ha llevado" },
      { sp: "ha nadado", arm: "լողացել է (nadar)", rus: "поплавал (nadar)", example: "primero ha nadado" },
      { sp: "el helado", arm: "պաղպաղակ", rus: "мороженое", example: "han comido helado" },
      { sp: "han vuelto", arm: "վերադարձել են (volver)", rus: "вернулись (volver)", example: "han vuelto a casa" }
    ] as VocabWord[]
  },
  imperfecto: {
    titleSp: "Mi pueblo antes",
    titleArm: "Իմ գյուղը առաջ",
    conceptSp: "Pretérito Imperfecto (El imperfecto)",
    conceptArm: "Անցյալ ժամանակ՝ սովորություն / նկարագրություն",
    themeColor: "from-indigo-500 to-purple-600",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    focusColor: "border-indigo-500 hover:border-indigo-600 bg-indigo-50/20",
    sentences: [
      { id: 1, sp: "Cuando mi abuelo era joven, vivía en un pueblo pequeño.", arm: "Երբ իմ պապիկը երիտասարդ էր, նա ապրում էր փոքր գյուղում։", rus: "Когда мой дедушка был молодым, он жил в маленькой деревне." },
      { id: 2, sp: "El pueblo era tranquilo y tenía calles estrechas.", arm: "Գյուղը հանգիստ էր և ուներ նեղ փողոցներ։", rus: "Деревня была спокойной и имела узкие улочки." },
      { id: 3, sp: "No había muchos coches, y los niños jugaban en la calle.", arm: "Շատ մեքենաներ չկային, և երեխաները խաղում էին փողոցում։", rus: "Машин было немного, и дети играли на улице." },
      { id: 4, sp: "Mi abuelo iba al mercado con su madre todos los sábados.", arm: "Իմ պապիկը ամեն շաբաթ իր մայրիկի հետ գնում էր շուկա։", rus: "Мой дедушка ходил на рынок со своей мамой каждую субботу." },
      { id: 5, sp: "Allí compraban pan, fruta y queso.", arm: "Այնտեղ նրանք գնում էին հաց, միրգ և պանիր։", rus: "Там они покупали хлеб, фрукты и сыр." },
      { id: 6, sp: "Por la tarde él ayudaba a su padre en el jardín.", arm: "Կեսօրից հետո նա օգնում էր իր հայրիկին այգում։", rus: "Днем он помогал своему отцу в саду." },
      { id: 7, sp: "En verano hacía calor, y la familia cenaba fuera de casa.", arm: "Ամռանը շոգ էր լինում, և ընտանիքը ընթրում էր տանից դուրս։", rus: "Летом было жарко, и семья ужинала на открытом воздухе." },
      { id: 8, sp: "Mi abuelo siempre decía que la vida era simple, pero bonita.", arm: "Իմ պապիկը միշտ ասում էր, որ կյանքը պարզ էր, բայց գեղեցիկ։", rus: "Мой дедушка всегда говорил, что жизнь была простой, но прекрасной." }
    ] as Sentence[],
    questions: [
      {
        id: "imperfecto_1",
        question: "¿Dónde vivía el abuelo cuando era joven?",
        options: ["en un pueblo pequeño", "en una ciudad grande", "en una isla"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «en un pueblo pequeño» (փոքր գյուղում): Տեքստում ասվում է՝ «vivía en un pueblo pequeño»:",
          rus: "Правильный ответ «en un pueblo pequeño» (в маленькой деревне). Текст: «vivía en un pueblo pequeño»."
        }
      },
      {
        id: "imperfecto_2",
        question: "¿Cómo era el pueblo?",
        options: ["tranquilo", "ruidoso", "moderno"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «tranquilo» (հանգիստ/խաղաղ): Տեքստում ասվում է՝ «El pueblo era tranquilo»:",
          rus: "Правильный ответ «tranquilo» (тихим/спокойным). Текст: «El pueblo era tranquilo»."
        }
      },
      {
        id: "imperfecto_3",
        question: "¿Había muchos coches?",
        options: ["no, no había muchos coches", "sí, había muchos coches", "sí, había muchos autobuses"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «no, no había muchos coches» (ոչ, շատ մեքենաներ չկային): Տեքստում ասվում է՝ «No había muchos coches»:",
          rus: "Правильный ответ «no, no había muchos coches» (нет, машин было немного). Из текста: «No había muchos coches»."
        }
      },
      {
        id: "imperfecto_4",
        question: "¿Adónde iba el abuelo los sábados?",
        options: ["al mercado", "al cine", "al colegio"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «al mercado» (շուկա): Տեքստից՝ «Mi abuelo iba al mercado con su madre todos los sábados»:",
          rus: "Правильный ответ «al mercado» (на рынок). Текст: «Mi abuelo iba al mercado con su madre todos los sábados»."
        }
      },
      {
        id: "imperfecto_5",
        question: "¿Qué hacía por la tarde?",
        options: ["ayudaba a su padre en el jardín", "veía la televisión", "compraba ropa"],
        correctAnswerIndex: 0,
        explanation: {
          arm: "Ճիշտ պատասխանն է «ayudaba a su padre en el jardín» (օգնում էր իր հայրիկին այգում): Տեքստից՝ «Por la tarde él ayudaba a su padre en el jardín»:",
          rus: "Правильный ответ «ayudaba a su padre en el jardín» (помогал отцу в саду). Текст: «Por la tarde él ayudaba a su padre en el jardín»."
        }
      }
    ] as Question[],
    vocab: [
      { sp: "vivía", arm: "ապրում էր (vivir)", rus: "жил/жила (vivir)", example: "vivía en un pueblo" },
      { sp: "era", arm: "էր (ser)", rus: "был/была (ser)", example: "el pueblo era tranquilo" },
      { sp: "los sábados", arm: "շաբաթ օրերը", rus: "по субботам", example: "todos los sábados" },
      { sp: "compraban", arm: "գնում էին (comprar)", rus: "покупали (comprar)", example: "allí compraban pan" },
      { sp: "el queso", arm: "պանիր", rus: "сыр", example: "pan, fruta y queso" },
      { sp: "hacía calor", arm: "շոգ էր (hacer)", rus: "было жарко (hacer)", example: "en verano hacía calor" },
      { sp: "siempre", arm: "միշտ", rus: "всегда", example: "mi abuelo siempre decía" }
    ] as VocabWord[]
  }
};

export default function App() {
  const [lang, setLang] = useState<'arm' | 'rus'>('arm');
  const [activeTab, setActiveTab] = useState<'presente' | 'perfecto' | 'imperfecto'>('presente');
  const [largeFont, setLargeFont] = useState<boolean>(true);
  
  // Track revealed sentences
  const [revealedSentences, setRevealedSentences] = useState<Record<string, boolean>>({});
  
  // Track option selections
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Track visibility of explanations
  const [visibleExplanations, setVisibleExplanations] = useState<Record<string, boolean>>({});

  // Saved vocabulary/notebook
  const [personalDictionary, setPersonalDictionary] = useState<Array<{ id: string; sp: string; arm: string; note?: string }>>(() => {
    const cached = localStorage.getItem('es_dictionary');
    return cached ? JSON.parse(cached) : [
      { id: '1', sp: "Me encanta estudiar", arm: "Ես սիրում եմ սովորել" },
      { id: '2', sp: "Muchas gracias", arm: "Շատ շնորհակալություն" }
    ];
  });

  const [inputWordSp, setInputWordSp] = useState('');
  const [inputWordArm, setInputWordArm] = useState('');

  // Save dictionary to localStorage
  useEffect(() => {
    localStorage.setItem('es_dictionary', JSON.stringify(personalDictionary));
  }, [personalDictionary]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Ձեր բրաուզերը չի աջակցում SpeechSynthesis (ձայնային արտասանություն):");
    }
  };

  const toggleSentenceTranslation = (lessonKey: string, id: number) => {
    const key = `${lessonKey}_${id}`;
    setRevealedSentences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOptionClick = (questionId: string, optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optIdx
    }));
    // Auto show explanation after selection
    setVisibleExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleAddWord = (e: FormEvent) => {
    e.preventDefault();
    if (!inputWordSp.trim() || !inputWordArm.trim()) return;
    const newWord = {
      id: Date.now().toString(),
      sp: inputWordSp.trim(),
      arm: inputWordArm.trim()
    };
    setPersonalDictionary(prev => [newWord, ...prev]);
    setInputWordSp('');
    setInputWordArm('');
  };

  const handleDeleteWord = (id: string) => {
    setPersonalDictionary(prev => prev.filter(w => w.id !== id));
  };

  const resetAllProgress = () => {
    if (window.confirm(lang === 'arm' ? "Ցանկանու՞մ եք վերսկսել խաղը և ջնջել ձեր արդյունքները:" : "Вы уверены, что хотите сбросить весь прогресс?")) {
      setAnswers({});
      setVisibleExplanations({});
      setRevealedSentences({});
    }
  };

  const revealAllTranslations = () => {
    const activeLesson = LESSONS_DATA[activeTab];
    const newReveals = { ...revealedSentences };
    activeLesson.sentences.forEach(s => {
      newReveals[`${activeTab}_${s.id}`] = true;
    });
    setRevealedSentences(newReveals);
  };

  const hideAllTranslations = () => {
    const activeLesson = LESSONS_DATA[activeTab];
    const newReveals = { ...revealedSentences };
    activeLesson.sentences.forEach(s => {
      newReveals[`${activeTab}_${s.id}`] = false;
    });
    setRevealedSentences(newReveals);
  };

  // Calculations
  const activeLesson = LESSONS_DATA[activeTab];
  const totalQuestionsList = Object.values(LESSONS_DATA).flatMap(l => l.questions);
  const totalQuestionsCount = totalQuestionsList.length;
  const answeredCount = Object.keys(answers).length;
  
  const correctCount = totalQuestionsList.reduce((acc, q) => {
    const userAnswer = answers[q.id];
    return acc + (userAnswer === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const correctRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 antialiased transition-all duration-200"
      style={{ fontSize: largeFont ? '18px' : '15px' }}
    >
      {/* Premium Header Container */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Español Interactivo</span>
                <span className="text-xs bg-orange-100 text-orange-850 px-2 py-0.5 rounded-full font-sans font-bold border border-orange-200">
                  ARM ↔ ESP
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'arm' 
                  ? "Ինտերակտիվ իսպաներենի ուսուցում հայախոսների համար՝ երեք հիմնական ժամանակաձևերով:" 
                  : "Интерактивный испанский для армяноязычных с тремя основными временами."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Lang toggler */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-250">
              <button 
                onClick={() => setLang('arm')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'arm' ? 'bg-white text-orange-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                🇦🇲 Հայ
              </button>
              <button 
                onClick={() => setLang('rus')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'rus' ? 'bg-white text-orange-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                🇷🇺 Рус
              </button>
            </div>

            {/* Font Size Button */}
            <button 
              onClick={() => setLargeFont(!largeFont)} 
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-250 flex items-center gap-1"
              title={lang === 'arm' ? 'Փոխել տառաչափը' : 'Изменить размер шрифта'}
            >
              <span className="font-mono">{largeFont ? "A+" : "A"}</span>
              <span className="text-[10px] text-slate-500">
                ({largeFont ? (lang === 'arm' ? "Մեծ" : "Крупный") : (lang === 'arm' ? "Միջին" : "Обычный")})
              </span>
            </button>

            {/* Global Reset */}
            <button 
              onClick={resetAllProgress} 
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent"
              title={lang === 'arm' ? 'Վերասկսել առաջընթացը' : 'Сбросить прогресс'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gamified Stat Dashboard Banner */}
      <div className="bg-slate-900 text-white relative overflow-hidden py-6 mb-8 border-b border-slate-950">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 opacity-5 text-[180px] select-none pointer-events-none font-extrabold uppercase">
          ESP
        </div>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'arm' ? 'Իմ Առաջընթացը' : 'Мой прогресс'}</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white leading-tight">
              {lang === 'arm' ? 'Իսպաներենի Ակադեմիա' : 'Академия Испанского'}
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              {lang === 'arm' 
                ? 'Կտտացրեք յուրաքանչյուր նախադասության վրա՝ բարձրաձայն լսելու և հայերեն թարգմանությունը վայրկենական տեսնելու համար:' 
                : 'Нажимайте на каждое предложение, чтобы прослушать его и сразу увидеть перевод.'}
            </p>
          </div>

          {/* Gamified stats indicator widgets */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-inner w-full md:w-auto">
            <div className="px-4 border-r border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'arm' ? "Հարցեր" : "Вопросы"}</p>
              <p className="text-xl font-display font-extrabold text-amber-400 font-mono">
                {answeredCount} / {totalQuestionsCount}
              </p>
            </div>
            <div className="px-4 border-r border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'arm' ? "Ճիշտ" : "Правильно"}</p>
              <p className="text-xl font-display font-extrabold text-emerald-400 font-mono">{correctCount}</p>
            </div>
            <div className="px-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'arm' ? "Ճշտություն" : "Точность"}</p>
              <p className="text-xl font-display font-extrabold text-indigo-400 font-mono">{correctRate}%</p>
            </div>
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-2xl text-slate-950 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Global progress indicator strip */}
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestionsCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4">
        {/* Navigation Tabs - Beautiful Tense Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {Object.entries(LESSONS_DATA).map(([key, value]) => {
            const isSelected = activeTab === key;
            const answeredInTab = value.questions.filter(q => answers[q.id] !== undefined).length;
            const isCompleted = answeredInTab === value.questions.length;
            
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`text-left p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? `bg-white border-slate-900 shadow-md ring-1 ring-slate-900/10` 
                    : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-xs'
                }`}
              >
                {/* Subtle top decoration bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${value.themeColor}`}></div>
                
                <div className="flex justify-between items-start gap-2 pt-1 font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">
                      {lang === 'arm' ? value.conceptArm : value.conceptSp}
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                      <span>{value.titleSp}</span>
                      <span className="text-xs font-normal text-slate-500 italic block">({value.titleArm})</span>
                    </h3>
                  </div>

                  <div className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : answeredInTab > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {answeredInTab} / {value.questions.length}
                  </div>
                </div>

                {/* Micro-indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${value.themeColor} transition-all duration-300`}
                      style={{ width: `${(answeredInTab / value.questions.length) * 100}%` }}
                    ></div>
                  </div>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Lesson Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Text Reading Deck & Quizzes */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Interactive Reading Panel */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs uppercase tracking-widest ${activeLesson.badgeColor}`}>
                    {activeLesson.conceptSp}
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-950">
                    {activeLesson.titleSp}
                  </h3>
                </div>

                {/* Translation Control helpers */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={revealAllTranslations}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 text-indigo-700 transition-all border border-slate-200"
                  >
                    {lang === 'arm' ? "Բացել բոլորը" : "Показать все переводы"}
                  </button>
                  <button 
                    onClick={hideAllTranslations}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 text-slate-600 transition-all border border-slate-200"
                  >
                    {lang === 'arm' ? "Թաքցնել բոլորը" : "Скрыть переводы"}
                  </button>
                </div>
              </div>

              {/* Instructions badge */}
              <div className="bg-blue-50/70 border border-blue-150 p-4 rounded-2xl mb-6 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed font-semibold">
                  {lang === 'arm' 
                    ? "💡 Սեղմեք ցանկացած նախադասության վրա՝ դրա հայերեն թարգմանությունը տեսնելու համար: Արտասանությունը լսելու համար սեղմեք աջ կողմի ձայնարկիչի կոճակը:" 
                    : "💡 Кликните на любое предложение, чтобы раскрыть его перевод. Для прослушивания произношения нажмите на значок аудио справа."}
                </p>
              </div>

              {/* Sentences Interactive Grid */}
              <div className="space-y-3">
                {activeLesson.sentences.map((s, idx) => {
                  const isRevealed = revealedSentences[`${activeTab}_${s.id}`];

                  return (
                    <div 
                      key={s.id}
                      onClick={() => toggleSentenceTranslation(activeTab, s.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isRevealed 
                          ? `bg-slate-50 border-slate-400 font-sans shadow-xs` 
                          : 'bg-white border-transparent hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Interactive block helper inside */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          {/* Spanish text block */}
                          <p className="text-slate-900 font-semibold tracking-wide leading-relaxed text-md sm:text-lg">
                            <span className="text-slate-400 font-mono text-sm mr-2">{idx + 1}.</span> 
                            {s.sp}
                          </p>
                          
                          {/* Revealed Translation Block with slide animation */}
                          <AnimatePresence>
                            {isRevealed && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18 }}
                                className="pt-2 border-t border-slate-200/60 font-medium"
                              >
                                <p className="text-indigo-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                  {lang === 'arm' ? s.arm : s.rus}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Speaker assistant badge */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(s.sp);
                          }}
                          className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all shrink-0 cursor-pointer"
                          title={lang === "arm" ? "Լսել արտասանությունը" : "Прослушать произношение"}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Entire Text Reading play help block */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => speakText(activeLesson.sentences.map(s => s.sp).join(" "))}
                  className={`px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md`}
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'arm' ? "Լսել ամբողջ տեքստը" : "Прослушать весь текст"}</span>
                </button>
              </div>
            </div>

            {/* Comprehension Quiz section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-slate-800" />
                <h3 className="text-xl font-display font-extrabold text-slate-900">
                  {lang === 'arm' ? "Ստուգեք ձեր իմացածը" : "Проверьте свое понимание"}
                </h3>
              </div>

              <div className="space-y-6">
                {activeLesson.questions.map((q, qIndex) => {
                  const userAnswerIndex = answers[q.id];
                  const hasAnswered = userAnswerIndex !== undefined;
                  const showExplanation = visibleExplanations[q.id];

                  return (
                    <div 
                      key={q.id}
                      id={`quiz_card_${q.id}`}
                      className={`bg-white rounded-3xl p-6 border transition-all ${
                        hasAnswered 
                          ? 'border-slate-200 shadow-xs' 
                          : 'border-slate-300 shadow-md ring-1 ring-slate-100'
                      }`}
                    >
                      {/* Header with question text & sound */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6.5 h-6.5 bg-slate-100 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 text-slate-600">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-base sm:text-md text-slate-950 font-display font-extrabold tracking-tight">
                            {q.question}
                          </h4>
                        </div>

                        {/* Talk Aloud assistance */}
                        <button 
                          onClick={() => speakText(q.question)} 
                          className="p-1.5 text-slate-400 hover:text-indigo-650 rounded-xl hover:bg-slate-50 transition-all shrink-0"
                          title={lang === "arm" ? "Լսել հարցը" : "Прослушать вопрос"}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customized round Radio option components */}
                      <div className="space-y-2.5">
                        {q.options.map((option, optIdx) => {
                          const isSelected = userAnswerIndex === optIdx;
                          const isCorrectOpt = q.correctAnswerIndex === optIdx;
                          
                          let cardStyle = "border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 text-slate-850";
                          let radialCircle = "border-slate-300 bg-transparent text-transparent";
                          
                          if (hasAnswered) {
                            if (isSelected) {
                              if (isCorrectOpt) {
                                cardStyle = "border-emerald-500 bg-emerald-50/30 text-emerald-950 font-bold";
                                radialCircle = "border-emerald-500 bg-emerald-550 text-white";
                              } else {
                                cardStyle = "border-rose-400 bg-rose-50/20 text-rose-950 font-semibold";
                                radialCircle = "border-rose-400 bg-rose-400 text-white";
                              }
                            } else if (isCorrectOpt) {
                              cardStyle = "border-emerald-250 bg-emerald-50/10 text-emerald-900 opacity-90";
                              radialCircle = "border-emerald-300 bg-transparent";
                            } else {
                              cardStyle = "border-slate-100 text-slate-400 opacity-55";
                              radialCircle = "border-slate-150";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleOptionClick(q.id, optIdx)}
                              className={`w-full text-left p-3 px-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-xs sm:text-sm focus:outline-hidden ${cardStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${radialCircle}`}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pop"></div>}
                                </div>
                                <span className="font-semibold font-mono">{option}</span>
                              </div>

                              {hasAnswered && isSelected && (
                                isCorrectOpt 
                                  ? <Check className="w-4 h-4 text-emerald-700 shrink-0 stroke-[3]" />
                                  : <span className="text-rose-600 text-bold font-mono text-xs shrink-0 bg-rose-100 px-1.5 py-0.5 rounded-md">X</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Explanation card - Reveals ALWAYS on Option selection */}
                      {showExplanation && (
                        <div className="mt-5 pt-4 border-t border-slate-100 animate-pop">
                          <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 text-indigo-950 text-xs sm:text-sm leading-relaxed">
                            <div className="flex items-center gap-2 font-display font-bold text-indigo-900 mb-1.5">
                              <HelpCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                              <span>{lang === 'arm' ? "Բացատրություն" : "Разбор грамматики и перевода"}</span>
                            </div>
                            <p className="whitespace-pre-line text-slate-750 font-medium">
                              {lang === 'arm' ? q.explanation.arm : q.explanation.rus}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: Interactive Vocabulary List & My Personal Dictionary */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* 1. Tense Vocabulary Accelerator */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-5 text-7xl select-none pointer-events-none">
                📖
              </div>
              <h3 className="text-md sm:text-lg font-display font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
                <BookMarked className="w-5 h-5 text-amber-500" />
                <span>{lang === 'arm' ? "Բառապաշար" : "Словарь урока"}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                {lang === 'arm' 
                  ? "Կարևոր բառերն ու արտահայտությունները այս դասից:" 
                  : "Ключевые слова из этого текста."}
              </p>

              <div className="space-y-3">
                {activeLesson.vocab.map((w, index) => (
                  <div 
                    key={index}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all text-left flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => speakText(w.sp)}
                        className="font-extrabold text-slate-900 hover:text-amber-600 flex items-center gap-1 transition-all"
                      >
                        <span className="text-sm font-mono tracking-wide">{w.sp}</span>
                        <Volume2 className="w-3.5 h-3.5 shrink-0 text-slate-405" />
                      </button>

                      <button
                        onClick={() => {
                          const existsInDict = personalDictionary.some(x => x.sp === w.sp);
                          if (!existsInDict) {
                            setPersonalDictionary(prev => [
                              { id: Date.now().toString(), sp: w.sp, arm: w.arm },
                              ...prev
                            ]);
                          }
                        }}
                        className="text-[10px] bg-white border border-slate-200 hover:border-slate-350 text-slate-600 rounded-md px-2 py-0.5 font-bold transition-all"
                        title={lang === "arm" ? "Ավելացնել իմ բառարան" : "Добавить в мой словарь"}
                      >
                        + {lang === 'arm' ? "Պահել" : "Сохр."}
                      </button>
                    </div>

                    <div className="text-slate-500 font-bold">
                      {lang === 'arm' ? `arm: ${w.arm}` : `rus: ${w.rus}`}
                    </div>

                    <div className="text-[10px] italic text-slate-400 mt-1">
                      {w.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. My Notebook & Dictionary Saver */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-md sm:text-lg font-display font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'arm' ? "Իմ Բառարանը" : "Мой словарик"}</span>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                  {personalDictionary.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                {lang === 'arm' 
                  ? "Գրառեք ձեր նոր բառերը այստեղ՝ մշտական սովորելու համար:" 
                  : "Сохраняйте новые слова здесь."}
              </p>

              {/* Add Custom Word Form */}
              <form onSubmit={handleAddWord} className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Palabra (իսպաներեն)..."
                  value={inputWordSp}
                  onChange={(e) => setInputWordSp(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-indigo-500 bg-white"
                />
                <input
                  type="text"
                  placeholder="Թարգմանություն..."
                  value={inputWordArm}
                  onChange={(e) => setInputWordArm(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-indigo-500 bg-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'arm' ? "Ավելացնել Բառարան" : "Добавить слово"}</span>
                </button>
              </form>

              {/* Saved words drawer */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {personalDictionary.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    {lang === 'arm' ? "Ձեր բառարանը դեռ դատարկ է:" : "Ваш словарик пока пуст."}
                  </p>
                ) : (
                  personalDictionary.map((item) => (
                    <div 
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-150 bg-slate-50/40 flex items-center justify-between gap-2 text-xs hover:bg-white hover:shadow-2xs transition-all"
                    >
                      <div className="text-left font-sans">
                        <button 
                          onClick={() => speakText(item.sp)}
                          className="font-extrabold text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors text-left font-mono"
                        >
                          <span>{item.sp}</span>
                          <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </button>
                        <p className="text-indigo-900 font-medium">{item.arm}</p>
                      </div>

                      <button 
                        onClick={() => handleDeleteWord(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title={lang === "arm" ? "Ջնջել" : "Удалить"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
