import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Eye, 
  ChevronRight,
  Menu,
  X,
  Bell,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { AuthModal } from "./components/AuthModal";
import { AIDocsModal } from "./components/AIDocsModal";
import { DepartmentModal } from "./components/DepartmentModal";

// Types
interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

const Navigation = ({ onAuthClick, user }: { onAuthClick: () => void, user: User | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-sm flex items-center justify-center transform rotate-45">
            <Cpu className="text-black transform -rotate-45 w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter">NEXUS</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase opacity-70">
          <a href="#ai" className="hover:text-brand-primary transition-colors">A.I. Systems</a>
          <a href="#robotics" className="hover:text-brand-primary transition-colors">Robotic Labs</a>
          <a href="#content" className="hover:text-brand-primary transition-colors">Future Content</a>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                <UserIcon className="w-4 h-4" />
                <span className="text-[10px] lowercase max-w-[100px] overflow-hidden text-ellipsis">{user.email}</span>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-2 rounded-full hover:bg-brand-primary/20 transition-all cursor-pointer"
            >
              Join Platform
            </button>
          )}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl p-8 flex flex-col gap-6 text-center md:hidden"
          >
            <a href="#ai" className="text-xl font-display" onClick={() => setMobileMenuOpen(false)}>A.I. Systems</a>
            <a href="#robotics" className="text-xl font-display" onClick={() => setMobileMenuOpen(false)}>Robotic Labs</a>
            <a href="#content" className="text-xl font-display" onClick={() => setMobileMenuOpen(false)}>Future Content</a>
            {!user && (
               <button onClick={() => { onAuthClick(); setMobileMenuOpen(false); }} className="text-brand-primary font-bold">Join Platform</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ children, subtitle, align = "center" }: { children: React.ReactNode, subtitle: string, align?: "left" | "center" }) => (
  <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-brand-primary font-display text-sm tracking-widest uppercase mb-4 block"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-6xl font-display font-bold leading-tight"
    >
      {children}
    </motion.h2>
  </div>
);

interface DeptCardProps {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  onExplore: () => void;
}

const DepartmentCard: React.FC<DeptCardProps> = ({ id, icon: Icon, title, description, color, onExplore }) => (
  <motion.div 
    id={id}
    whileHover={{ y: -5 }}
    className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-20 transition-opacity group-hover:opacity-40`} style={{ backgroundColor: color }}></div>
    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${color}20` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6">
      {description}
    </p>
    <button 
      onClick={onExplore}
      className="flex items-center gap-2 group-hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider cursor-pointer"
    >
      Explore Department <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  </motion.div>
);

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const addNotification = (message: string, type: Notification["type"] = "info") => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleApiAction = async (endpoint: string, actionId: string, email?: string) => {
    setIsLoading(actionId);
    try {
      const response = await fetch(`/api/action/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        addNotification(data.message, "success");
      } else {
        addNotification(data.message || "Action failed", "error");
      }
    } catch (err) {
      addNotification("Nexus connection error. Ensure backend is running.", "error");
    } finally {
      setIsLoading(null);
    }
  };

  const departments = [
    {
      id: "ai-card",
      icon: Bot,
      title: "A.I. Systems",
      description: "Deep learning neural networks optimized for generative accuracy and predictive analytics beyond conventional boundaries.",
      color: "#00f2ff"
    },
    {
      id: "robotics-card",
      icon: ShieldCheck,
      title: "Robotic Labs",
      description: "Precision-engineered hardware interfaces designed for physical task automation and human-robot synergy.",
      color: "#a855f7"
    },
    {
      id: "content-card",
      icon: Layers,
      title: "Future Content",
      description: "Autonomous media generation pipelines creating high-fidelity promotional assets in real-time through cross-modal synthesis.",
      color: "#ff8c00"
    }
  ];

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-black">
      <Navigation user={user} onAuthClick={() => setIsAuthOpen(true)} />

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(msg) => addNotification(msg, "success")} />
      <AIDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <DepartmentModal dept={selectedDept} onClose={() => setSelectedDept(null)} />

      {/* Notifications Portal */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl glass-panel shadow-2xl min-w-[300px] ${
                n.type === "success" ? "border-l-4 border-l-brand-primary" : 
                n.type === "error" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-brand-secondary"
              }`}
            >
              <Bell className={`w-5 h-5 ${n.type === "success" ? "text-brand-primary" : n.type === "error" ? "text-red-500" : "text-brand-secondary"}`} />
              <p className="font-medium text-sm">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/50 to-brand-bg z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1620712943543-bcc4628c6750?auto=format&fit=crop&q=80&w=2000" 
            alt="Futuristic VR Interface" 
            className="w-full h-full object-cover opacity-40 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_70%)]"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-bold tracking-[0.2em] uppercase mb-8"
          >
            <Zap className="w-3 h-3 text-brand-primary" fill="currentColor" />
            Next Gen Technological Evolution
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8"
          >
            PROMOTION OF <span className="text-brand-primary glow-text italic">MIXED</span> <br className="hidden md:block" /> CONTENT FUTURES
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto text-xl text-gray-400 mb-12"
          >
            Integrating high-performance A.I., advanced Robotics, and Generative content 
            into a singular, dynamic promotional experience for the digital age.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => {
                if (!user) {
                  setIsAuthOpen(true);
                  addNotification("Authorization required for system initialization.", "info");
                } else {
                  handleApiAction("initialize", "hero-init");
                }
              }}
              disabled={isLoading === "hero-init"}
              className="px-8 py-4 bg-brand-primary text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === "hero-init" ? "Connecting..." : user ? "Initialize System" : "Sign In to Access"}
            </button>
            <a href="#departments" className="px-8 py-4 glass-panel rounded-full hover:bg-white/10 transition-all font-bold block">
              View Departments
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Departments */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="departments">
        <SectionHeading subtitle="Convergence Core">Our Advanced Departments</SectionHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.map(dept => (
            <DepartmentCard 
              key={dept.id}
              id={dept.id}
              icon={dept.icon}
              title={dept.title}
              description={dept.description}
              color={dept.color}
              onExplore={() => setSelectedDept(dept)}
            />
          ))}
        </div>
      </section>

      {/* Dynamic Content Showcase */}
      <section className="py-24 bg-black/30 relative overflow-hidden" id="ai">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <SectionHeading subtitle="Artificial Intelligence" align="left">
              The Intelligence <br /> Behind The Future
            </SectionHeading>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our AI department focuses on "Mixed Content" promotion — generating 
              dynamic graphics, copy, and structural designs that adapt in real-time 
              to user interaction and environmental data.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { label: "Neural Fidelity", value: "99.8%" },
                { label: "Gen-Speed", value: "0.4ms" },
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl border-l-4 border-l-brand-primary">
                  <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-2 text-brand-primary font-bold group cursor-pointer"
            >
              View AI Integration Docs <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flex-1 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10 rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl shadow-brand-primary/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Visualization" 
                className="rounded-xl w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 -m-10 border border-brand-primary/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-0 -m-20 border border-purple-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
          </div>
        </div>
      </section>

      {/* Robotics Visual */}
      <section className="py-24" id="robotics">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <SectionHeading subtitle="Robotic Departments" align="left">
                Physical Nexus <br /> Precision Engineering
              </SectionHeading>
              <ul className="space-y-6 mb-10">
                {[
                  { icon: Eye, title: "Sensor Convergence", desc: "Omni-directional visual feedback for tactile response." },
                  { icon: Globe, title: "Global Sync", desc: "Low-latency remote operation across distributed nodes." },
                  { icon: Zap, title: "Hyper-Efficiency", desc: "Low-energy consumption models for sustained operation." },
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden h-64 glass-panel p-2"
                  >
                    <img src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" alt="Robot 1" referrerPolicy="no-referrer" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl overflow-hidden h-40 glass-panel p-2"
                  >
                    <img src="https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" alt="Robot 2" referrerPolicy="no-referrer" />
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl overflow-hidden h-40 glass-panel p-2"
                  >
                    {/* FIXED BROKEN IMAGE LINK WITH MORE STABLE SOURCE */}
                    <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" alt="Robot 3" referrerPolicy="no-referrer" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl overflow-hidden h-64 glass-panel p-2"
                  >
                    <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" alt="Robot 4" referrerPolicy="no-referrer" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VR Experience Promotion */}
      <section className="py-24 relative overflow-hidden" id="content">
        <div className="absolute inset-0 bg-brand-primary/5"></div>
        <div className="max-w-5xl mx-auto px-6 glass-panel rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#00f2ff_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ff8c00_0%,transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10">
            <SectionHeading subtitle="Promotional Nexus">Experience The Vision</SectionHeading>
            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
              Our generated content department leverages VR technology to put you at 
              the center of future promotional narratives. Dynamic graphics, immersive 
              soundscapes, and AI-driven environments await.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => handleApiAction("launch-vr", "vr-launch")}
                disabled={isLoading === "vr-launch"}
                className="px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
              >
                {isLoading === "vr-launch" ? "Syncing..." : "Launch VR Experience"}
              </button>
              <button 
                onClick={() => addNotification("Assets are being compiled. Check back in T-minus 2 minutes.", "info")}
                className="px-10 py-5 border border-white/20 hover:bg-white/5 font-bold rounded-full transition-all cursor-pointer"
              >
                Download Assets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Join Modal/Section */}
      <section className="py-24 max-w-xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-display font-bold mb-8">Join the Nexus Grid</h3>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="nexus@id.node" 
            id="email-input"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 focus:outline-none focus:border-brand-primary"
          />
          <button 
            onClick={() => {
              const emailInput = document.getElementById("email-input") as HTMLInputElement;
              if (emailInput?.value) {
                handleApiAction("join", "join-action", emailInput.value);
              } else {
                addNotification("Identification required.", "error");
              }
            }}
            disabled={isLoading === "join-action"}
            className="px-8 py-4 bg-brand-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading === "join-action" ? "Syncing..." : "Sync Node"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="text-brand-primary w-6 h-6" />
              <span className="font-display font-bold text-2xl tracking-tighter uppercase">Nexus</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Pioneering the intersection of intelligence and robotics. 
              Promoting a world where high-fidelity content meets physical reality.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-50">Departments</h5>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-primary transition-colors">AI Research</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Robotic Engineering</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Media Synthesis</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Content Strategy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-50">Company</h5>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Nexus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Technical Papers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Core</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2026 NEXUS CONVERGENCE. ALL INTERFACES SECURED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Neural</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Sync</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
