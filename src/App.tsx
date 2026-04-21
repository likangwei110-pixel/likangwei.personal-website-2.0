import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Linkedin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Camera, 
  Film, 
  ArrowUpRight,
  ChevronRight,
  Edit3,
  Plus,
  Save,
  X,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { Language, translations, Translation, Internship } from './types';

// --- Components ---

const LangButton = ({ lang, current, onClick }: { lang: Language, current: Language, onClick: (l: Language) => void }) => (
  <button 
    onClick={() => onClick(lang)}
    className={`px-3 py-1 text-[10px] font-bold tracking-widest transition-all border border-transparent ${current === lang ? 'bg-white text-black border-white shadow-sm' : 'opacity-40 hover:opacity-80'}`}
  >
    {lang}
  </button>
);

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const EditableText = ({ value, onSave, isEditing, className = "", multiline = false, as: Component = 'div' }: EditableTextProps) => {
  const [temp, setTemp] = useState(value);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTemp(value);
  }, [value]);

  if (isEditing) {
    if (active) {
      return (
        <div className={`relative inline-block w-full ${className}`}>
          {multiline ? (
            <textarea 
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full bg-gray-50 border-2 border-brand-accent p-2 text-inherit font-inherit focus:outline-none ring-0 text-black rounded-lg shadow-inner"
              autoFocus
              onBlur={() => {
                onSave(temp);
                setActive(false);
              }}
            />
          ) : (
            <input 
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full bg-gray-50 border-2 border-brand-accent p-2 text-inherit font-inherit focus:outline-none ring-0 text-black rounded-full shadow-inner"
              autoFocus
              onBlur={() => {
                onSave(temp);
                setActive(false);
              }}
            />
          )}
        </div>
      );
    }
    return (
      <div 
        className={`group relative cursor-help border border-dashed border-brand-accent/20 hover:border-brand-accent p-1 transition-all rounded-md ${className}`}
        onClick={() => setActive(true)}
      >
        <Component>{value}</Component>
        <div className="absolute -top-3 -right-3 p-1 opacity-0 group-hover:opacity-100 bg-brand-accent text-white rounded-full shadow-lg z-50">
           <Edit3 size={10} />
        </div>
      </div>
    );
  }
  return <Component className={className}>{value}</Component>;
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>('CN');
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<Record<Language, Translation>>(translations);
  const [photos, setPhotos] = useState<{ 
    id: string; 
    url: string; 
    details: Record<Language, { title: string; desc: string }> 
  }[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Photo Persistence Configuration ---
  // To keep your photos permanent for the open-source version, 
  // place your public image URLs and details here:
  const defaultPhotos = [
    { 
      id: '1', 
      url: 'https://picsum.photos/seed/minimal_arch_1/1200/1500', 
      details: {
        CN: { title: '极简建筑', desc: '北京。大面积留白与光影的对话。' },
        EN: { title: 'Minimal Arch', desc: 'Beijing. A dialogue between white space and light.' },
        DE: { title: 'Minimal Architektur', desc: 'Peking. Ein Dialog zwischen Leerraum und Licht.' }
      }
    },
    { 
      id: '2', 
      url: 'https://picsum.photos/seed/minimal_ocean_1/1200/1500', 
      details: {
        CN: { title: '静谧海洋', desc: '无尽的蓝。' },
        EN: { title: 'Quiet Ocean', desc: 'Endless blue.' },
        DE: { title: 'Stilles Meer', desc: 'Unendliches Blau.' }
      }
    }
  ];

  // Load from LocalStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('portfolio_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Failed to load content", e);
      }
    }
    const savedPhotos = localStorage.getItem('portfolio_photos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      setPhotos(defaultPhotos);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('portfolio_content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('portfolio_photos', JSON.stringify(photos));
  }, [photos]);

  const activeT = content[lang];

  // --- Handlers ---

  const scrollGallery = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newPhoto = {
          id: Date.now().toString(),
          url,
          details: {
            CN: { title: '新照片', desc: '点击编辑简介' },
            EN: { title: 'New Photo', desc: 'Click to edit description' },
            DE: { title: 'Neues Foto', desc: 'Klicken zum Bearbeiten' }
          }
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePhotoDetail = (id: string, l: Language, field: 'title' | 'desc', val: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          details: {
            ...p.details,
            [l]: { ...p.details[l], [field]: val }
          }
        };
      }
      return p;
    }));
  };

  const updateField = (path: string[], value: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      let current: any = newContent[lang];
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  const updateInternship = (index: number, field: keyof Internship, value: string | string[]) => {
    setContent(prev => {
      const newContent = { ...prev };
      const items = [...newContent[lang].experience.items];
      items[index] = { ...items[index], [field]: value };
      newContent[lang].experience.items = items;
      return newContent;
    });
  };

  const deletePhoto = (id: string) => {
     if(window.confirm('Delete photo?')) {
       setPhotos(prev => prev.filter(p => p.id !== id));
       if (selectedPhotoId === id) setSelectedPhotoId(null);
     }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink selection:bg-brand-accent selection:text-white flex flex-col font-sans transition-colors duration-500">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <a href="#home" className="text-2xl font-bold tracking-tighter text-brand-accent transition-all hover:opacity-80">
            {activeT.hero.name}
          </a>
        </div>
        
        <div className="hidden lg:flex items-center space-x-10">
          {[
            { label: activeT.navigation.home, href: '#home' },
            { label: activeT.navigation.experience, href: '#internships' },
            { label: activeT.navigation.hobbies, href: '#hobby' },
            { label: activeT.navigation.contact, href: '#connect' }
          ].map(link => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-all lowercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
            <LangButton lang="CN" current={lang} onClick={setLang} />
            <LangButton lang="EN" current={lang} onClick={setLang} />
            <LangButton lang="DE" current={lang} onClick={setLang} />
          </div>
          <div className="flex space-x-4">
             <a href="https://www.linkedin.com/in/%E5%BA%B7%E7%82%9C-%E6%9D%8E-39735634a/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-accent transition-colors"><Linkedin size={18} /></a>
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-2 rounded-full transition-all border ${isEditMode ? 'bg-brand-accent text-white border-brand-accent shadow-lg' : 'text-gray-400 hover:text-brand-accent border-transparent hover:border-brand-accent/20'}`}
          >
            {isEditMode ? <Save size={16} /> : <Edit3 size={16} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        
        {/* HERO SECTION - REPLICA OF SCREENSHOT */}
        <section id="home" className="min-h-screen flex flex-col justify-center px-6 md:px-24 mb-20 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Greeting & Intro */}
            <div className="space-y-10">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <div className="flex items-baseline space-x-4 mb-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight flex flex-wrap items-baseline">
                       <EditableText 
                        value={activeT.hero.greeting} 
                        onSave={(v) => updateField(['hero', 'greeting'], v)} 
                        isEditing={isEditMode}
                        as="span"
                        className="mr-4"
                      />
                       <span className="text-brand-accent italic md:not-italic">
                         <EditableText 
                          value={activeT.hero.name} 
                          onSave={(v) => updateField(['hero', 'name'], v)} 
                          isEditing={isEditMode}
                          as="span"
                        />
                       </span>
                    </h1>
                 </div>
                 
                 <div className="max-w-xl">
                    <EditableText 
                      value={activeT.hero.subLabel}
                      onSave={(v) => updateField(['hero', 'subLabel'], v)}
                      isEditing={isEditMode}
                      className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium"
                      multiline
                    />
                    <div className="mt-8">
                       <a href="#connect" className="text-2xl font-bold text-brand-accent underline underline-offset-8 decoration-2 hover:opacity-70 transition-all">
                         <EditableText 
                          value={activeT.hero.cta}
                          onSave={(v) => updateField(['hero', 'cta'], v)}
                          isEditing={isEditMode}
                          as="span"
                        />
                       </a>
                    </div>
                 </div>
               </motion.div>
            </div>

            {/* Right Column: Q&A Cards */}
            <div className="relative">
               <div className="space-y-8">
                  <h3 className="text-3xl font-extrabold tracking-tight">
                     <EditableText 
                      value={activeT.hero.questionsLabel}
                      onSave={(v) => updateField(['hero', 'questionsLabel'], v)}
                      isEditing={isEditMode}
                      as="span"
                    />
                  </h3>
                  
                  <div className="flex flex-col space-y-4 max-w-md lg:ml-auto">
                     {activeT.hero.questions.map((q, idx) => (
                       <motion.div
                         key={idx}
                         initial={{ opacity: 0, x: 20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.1 * idx }}
                         className={`qa-card ${idx % 2 === 0 ? 'bg-[#E85D33]' : 'bg-[#D14D2A]'}`}
                       >
                          <EditableText 
                            value={q}
                            onSave={(v) => {
                              const newQs = [...activeT.hero.questions];
                              newQs[idx] = v;
                              updateField(['hero', 'questions'], newQs as any);
                            }}
                            isEditing={isEditMode}
                          />
                       </motion.div>
                     ))}
                  </div>
               </div>

               {/* Avatar - Caleb Style Replcia */}
               <div className="absolute -bottom-24 right-0 w-32 h-32 md:w-56 md:h-56 z-20 pointer-events-none">
                  <img 
                    src="https://calebixca.com/assets/img/caleb-avatar.webp" 
                    alt="Avatar" 
                    className="w-full h-full object-contain animate-bounce-subtle pointer-events-auto"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/adventurer/svg?seed=LKW";
                    }}
                  />
               </div>
            </div>
          </div>

          {/* Search Bar Area */}
          <div className="mt-32 max-w-2xl w-full flex items-center space-x-4">
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={activeT.hero.searchPlaceholder}
                  className="search-bar"
                />
             </div>
             <button className="bg-brand-accent text-white p-5 rounded-full shadow-lg hover:scale-110 transition-all active:scale-95">
                <ArrowRight size={20} />
             </button>
          </div>

          {/* Tag Pills */}
          <div className="mt-16 flex flex-wrap gap-3">
             {activeT.hero.tags.map(tag => (
               <span key={tag} className="pill">{tag}</span>
             ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="internships" className="px-6 md:px-24 py-32 bg-gray-50/50">
           <div className="flex justify-between items-baseline mb-20 border-b-2 border-gray-100 pb-12">
              <EditableText 
                value={activeT.experience.title}
                onSave={(v) => updateField(['experience', 'title'], v)}
                isEditing={isEditMode}
                className="text-6xl font-black tracking-tighter"
                as="h2"
              />
              <span className="mono font-bold text-gray-300">01 / EXPERIENCE</span>
           </div>

           <div className="space-y-32">
              {activeT.experience.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-12 group">
                   <div className="lg:col-span-4">
                      <div className="sticky top-40 space-y-4">
                         <div className="flex items-center space-x-2 text-brand-accent font-black">
                            <span className="text-[10px] uppercase tracking-widest">{item.period}</span>
                         </div>
                         <EditableText 
                            value={item.company}
                            onSave={(v) => updateInternship(idx, 'company', v)}
                            isEditing={isEditMode}
                            className="text-5xl font-black tracking-tight group-hover:text-brand-accent transition-colors"
                         />
                         <EditableText 
                            value={item.role}
                            onSave={(v) => updateInternship(idx, 'role', v)}
                            isEditing={isEditMode}
                            className="text-xl font-bold text-gray-400 italic"
                         />
                      </div>
                   </div>
                   <div className="lg:col-span-8 space-y-12 bg-white p-12 rounded-[50px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
                      <div className="space-y-6">
                         <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-200">The Mission</h4>
                         <EditableText 
                            value={item.task}
                            onSave={(v) => updateInternship(idx, 'task', v)}
                            isEditing={isEditMode}
                            className="text-2xl font-bold leading-snug"
                            multiline
                         />
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-200">Execution</h4>
                         <ul className="space-y-4">
                            {item.action.map((a, i) => (
                              <li key={i} className="flex items-start space-x-4">
                                 <Plus size={14} className="mt-1.5 text-brand-accent flex-shrink-0" />
                                 <EditableText 
                                    value={a}
                                    onSave={(v) => {
                                       const newActions = [...item.action];
                                       newActions[i] = v;
                                       updateInternship(idx, 'action', newActions);
                                    }}
                                    isEditing={isEditMode}
                                    className="text-xl text-gray-600 leading-relaxed"
                                 />
                              </li>
                            ))}
                         </ul>
                      </div>
                      <div className="pt-12 border-t border-gray-50 flex items-center space-x-6">
                         <div className="bg-brand-accent/5 border border-brand-accent/10 px-8 py-5 rounded-[30px]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">Outcome</h4>
                            <EditableText 
                                value={item.impact}
                                onSave={(v) => updateInternship(idx, 'impact', v)}
                                isEditing={isEditMode}
                                className="text-2xl font-black"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="px-6 md:px-24 py-32 bg-white">
           <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <EditableText 
                value={activeT.skills.title}
                onSave={(v) => updateField(['skills', 'title'], v)}
                isEditing={isEditMode}
                className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none"
              />
              <span className="mono font-bold text-gray-300">Global Ops & AI Workflows</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
              {[
                { field: 'competitive', path: ['skills', 'competitive'], tags: ["TikTok Ads", "Audi Strategy", "FastMoss Growth"] },
                { field: 'market', path: ['skills', 'market'], tags: ["EU Expansion", "Localization", "Growth Hacking"] },
                { field: 'aigc', path: ['skills', 'aigc'], tags: ["Cursor.ai", "Claude 3.5", "Automation Agents"] },
                { field: 'crossCultural', path: ['skills', 'crossCultural'], tags: ["German Fluency", "Cross-Team Sync", "BFSU Network"] }
              ].map((skill, i) => (
                 <div key={i} className="flex flex-col space-y-8 group/skill">
                    <div className="h-1 w-full bg-gray-100 group-hover/skill:bg-brand-accent transition-colors duration-500" />
                    <div className="space-y-4">
                      <p className="mono font-bold text-gray-300">Capability 0{i + 1}</p>
                      <EditableText 
                        value={(activeT.skills as any)[skill.field]}
                        onSave={(v) => updateField(skill.path, v)}
                        isEditing={isEditMode}
                        className="text-2xl font-black uppercase tracking-tight"
                        as="h3"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-2 rounded-full text-gray-400 hover:bg-brand-accent hover:text-white transition-all cursor-default">{tag}</span>
                      ))}
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* HOBBY / GALLERY */}
        <section id="hobby" className="px-6 md:px-24 py-32 bg-white">
           <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
              <div>
                <EditableText 
                  value={activeT.hobbies.title}
                  onSave={(v) => updateField(['hobbies', 'title'], v)}
                  isEditing={isEditMode}
                  className="text-6xl font-black tracking-tighter"
                />
              </div>
              <div className="flex items-center space-x-6">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="bg-brand-accent text-white py-4 px-10 rounded-full font-extrabold text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/30 flex items-center space-x-3 uppercase"
                 >
                   <Plus size={20} />
                   <span>Add Photo</span>
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                 <div className="flex space-x-3">
                    <button onClick={() => scrollGallery('left')} className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all shadow-sm"><ArrowRight className="rotate-180" size={20} /></button>
                    <button onClick={() => scrollGallery('right')} className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all shadow-sm"><ArrowRight size={20} /></button>
                 </div>
              </div>
           </div>

           <div className="relative group">
              <div 
                ref={scrollContainerRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-12"
              >
                 {photos.map(p => (
                   <div 
                    key={p.id} 
                    className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] aspect-[4/5] rounded-[50px] overflow-hidden relative group cursor-pointer snap-start shadow-xl border border-gray-100"
                    onClick={() => setSelectedPhotoId(p.id)}
                   >
                      <img 
                        src={p.url} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white pt-24">
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Capture ID / {p.id.slice(-4)}</p>
                         <h4 className="text-2xl font-black uppercase tracking-tight">{p.details[lang].title}</h4>
                      </div>
                      {isEditMode && (
                        <button 
                           onClick={(e) => { e.stopPropagation(); deletePhoto(p.id); }}
                           className="absolute top-8 right-8 bg-white/20 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 text-white"
                        >
                           <Trash2 size={16} />
                        </button>
                      )}
                   </div>
                 ))}
                 {photos.length === 0 && (
                   <div className="min-w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[50px] text-gray-300">
                      <ImageIcon size={48} className="mb-4 opacity-20" />
                      <p className="font-black uppercase tracking-widest text-sm italic">Gallery is empty</p>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* PHOTO DETAIL MODAL */}
        <AnimatePresence>
          {selectedPhotoId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setSelectedPhotoId(null)}
            >
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-[60px] shadow-2xl max-w-6xl w-full h-[85vh] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative border border-gray-100"
                onClick={e => e.stopPropagation()}
              >
                 <div className="h-full bg-gray-100">
                    <img 
                      src={photos.find(p => p.id === selectedPhotoId)?.url} 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="p-12 md:p-20 flex flex-col justify-between overflow-y-auto">
                    <div>
                       <div className="flex justify-between items-center mb-16">
                          <span className="mono font-bold text-gray-300 uppercase">Archive / Trilingual</span>
                          <button onClick={() => setSelectedPhotoId(null)} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400">
                             <X size={24} />
                          </button>
                       </div>
                       
                       <div className="space-y-16">
                          {(['CN', 'EN', 'DE'] as Language[]).map(l => (
                            <div key={l} className="group/detail">
                               <div className="flex items-center space-x-3 mb-6">
                                  <span className={`px-4 py-1 rounded-full text-[10px] font-black border transition-all ${lang === l ? 'bg-brand-accent text-white border-brand-accent' : 'border-gray-100 text-gray-400 group-hover/detail:border-brand-accent'}`}>{l}</span>
                               </div>
                               <div className="space-y-4">
                                  <EditableText 
                                    value={photos.find(p => p.id === selectedPhotoId)?.details[l].title || ''}
                                    onSave={(v) => updatePhotoDetail(selectedPhotoId!, l, 'title', v)}
                                    isEditing={true}
                                    className="text-4xl font-black tracking-tight"
                                  />
                                  <EditableText 
                                    value={photos.find(p => p.id === selectedPhotoId)?.details[l].desc || ''}
                                    onSave={(v) => updatePhotoDetail(selectedPhotoId!, l, 'desc', v)}
                                    isEditing={true}
                                    className="text-lg text-gray-500 font-medium leading-relaxed"
                                    multiline
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedPhotoId(null)}
                      className="mt-16 w-full bg-brand-accent text-white py-6 rounded-[30px] font-black text-sm tracking-[0.3em] shadow-xl shadow-brand-accent/20 hover:-translate-y-1 active:translate-y-0 transition-all uppercase"
                    >
                       Close Details
                    </button>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PASSIONS SECTION */}
        <section id="passions" className="px-6 md:px-24 py-32 bg-gray-50/30">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="bg-white p-12 rounded-[60px] shadow-sm border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all duration-700">
                 <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mb-12 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                    <Film size={32} />
                 </div>
                 <EditableText 
                    value={activeT.hobbies.cinema}
                    onSave={(v) => updateField(['hobbies', 'cinema'], v)}
                    isEditing={isEditMode}
                    className="text-5xl font-black tracking-tighter mb-6 uppercase"
                 />
                 <EditableText 
                    value={activeT.hobbies.cinemaDesc}
                    onSave={(v) => updateField(['hobbies', 'cinemaDesc'], v)}
                    isEditing={isEditMode}
                    className="text-xl text-gray-500 font-medium leading-relaxed mb-8"
                    multiline
                 />
                 <a 
                   href="https://likangwei110-pixel.github.io/zhangziyi-memoir/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center space-x-3 text-brand-accent font-black uppercase tracking-widest text-sm border-b-2 border-brand-accent hover:opacity-50 transition-all pb-1"
                 >
                   <span>View My Cinema Project</span>
                   <ArrowUpRight size={16} />
                 </a>
              </div>

              <div className="space-y-12 flex flex-col justify-center">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-1 bg-brand-accent" />
                    <span className="mono font-black text-gray-300 uppercase tracking-widest">Core Passions</span>
                 </div>
                 <div className="flex flex-wrap gap-x-12 gap-y-6">
                    {['Automotive', 'UI/UX', 'AIGC', 'Winter Sports', 'Branding'].map((item) => (
                       <span key={item} className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-gray-200 hover:text-brand-accent hover:italic transition-all duration-700 cursor-default">
                          {item}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* CONNECT SECTION */}
        <section id="connect" className="px-6 md:px-24 py-48 bg-[#111] text-white rounded-t-[100px] mt-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
              <div className="grid grid-cols-12 h-full">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="border-l border-white h-full" />
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
              <div className="space-y-20">
                 <h2 className="text-8xl md:text-[14rem] font-black tracking-[-0.05em] leading-[0.8] transition-all hover:tracking-[-0.08em] duration-1000">
                    Let's<br />
                    <span className="text-brand-accent italic font-medium">talk.</span>
                 </h2>
                 <div className="flex flex-col md:flex-row gap-16">
                    <div className="space-y-6">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Contact</p>
                       <div className="space-y-4">
                          <a href="mailto:lkwbfsu@outlook.com" className="text-3xl font-medium block hover:text-brand-accent transition-colors underline decoration-brand-accent/30 underline-offset-8">lkwbfsu@outlook.com</a>
                          <p className="text-3xl font-medium">+86 138-5057-5980</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Social</p>
                       <div className="space-y-4 flex flex-col items-start font-medium">
                          <a href="https://www.linkedin.com/in/%E5%BA%B7%E7%82%9C-%E6%9D%8E-39735634a/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-brand-accent flex items-center gap-3 transition-colors">LinkedIn <ArrowUpRight size={20} /></a>
                          
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col justify-end items-start md:items-end">
                 <div className="w-32 h-32 rounded-full bg-brand-accent flex items-center justify-center animate-bounce-subtle cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-brand-accent/40">
                    <ArrowRight className="-rotate-45" size={48} color="white" />
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#111] text-white px-6 md:px-24 py-16 border-t border-white/5">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex space-x-12 font-bold opacity-40 text-xs tracking-widest uppercase">
               <span>BFSU / 2027</span>
               <span>PM PORTFOLIO</span>
            </div>
            <div className="flex space-x-8">
               <a href="https://www.linkedin.com/in/%E5%BA%B7%E7%82%9C-%E6%9D%8E-39735634a/" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-brand-accent transition-all"><Linkedin size={20} /></a>
            </div>
            <div className="text-[10px] font-black opacity-20 uppercase tracking-[0.5em]">Built with Precision / Li Kangwei</div>
         </div>
      </footer>
    </div>
  );
}
