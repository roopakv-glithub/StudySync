import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  CheckCircle, 
  X, 
  ArrowRight, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Bot, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  LogOut,
  Smartphone,
  Layers,
  FileText,
  Menu,
  Bell,
  HelpCircle,
  Info,
  Users,
  Send,
  RefreshCw,
  Clock,
  Check,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Task, StudyStat, ChatMessage } from "./types";

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function App() {
  // Simulator frame display option
  const [displayMode, setDisplayMode] = useState<"flat" | "3d">("flat");

  // Default User profile strictly set to values from the Settings screenshot to match immediately!
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("studysync_user");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return null; }
    }
    // High-fidelity pre-authenticated state matching screenshot
    return {
      email: "roopakv835@gmail.com",
      nickname: "user1",
      fullName: "user1"
    };
  });

  // Login form inputs
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Nav Tabs configuration: home, notes, chat, jarvis, tasks, settings
  const [activeTab, setActiveTab] = useState<"home" | "notes" | "chat" | "jarvis" | "tasks" | "settings">("home");

  // Dynamic Subjects List, preloaded with values from Settings and Notes screenshots
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem("studysync_subjects");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [
      { id: "sub-1", name: "Java", color: "#ff6b00" }, // Orange Dot
      { id: "sub-2", name: "Discrete Maths", color: "#0084ff" }, // Blue Dot
      { id: "sub-3", name: "Database System", color: "#ff2d55" } // Red Dot
    ];
  });

  // Persist Subjects
  useEffect(() => {
    localStorage.setItem("studysync_subjects", JSON.stringify(subjects));
  }, [subjects]);

  // Tasks state, populated with exact tasks from the screenshot
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("studysync_tasks_exact");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [
      { id: "t-1", title: "CAT - 1", category: "Java", dueDate: "2026-07-04", completed: false, priority: "High" },
      { id: "t-2", title: "DA-1", category: "Discrete Maths", dueDate: "2026-07-05", dueText: "Jul 05, 12:00 AM", completed: false, priority: "High" },
      { id: "t-3", title: "happyhappy", category: "Database System", description: "Nothing", dueDate: "2026-06-21", dueText: "Jun 21, 12:00 AM", completed: false, priority: "Medium" }
    ];
  });

  // Persist Tasks
  useEffect(() => {
    localStorage.setItem("studysync_tasks_exact", JSON.stringify(tasks));
  }, [tasks]);

  // Task Creation states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Java");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-07-04");
  const [newTaskDueTime, setNewTaskDueTime] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("High");

  // Subject Addition states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState("#ff6b00");

  // Active sub-views (like active notes detail or current DM channel)
  const [selectedNoteSubject, setSelectedNoteSubject] = useState<Subject | null>(null);
  const [activeChatChannel, setActiveChatChannel] = useState<{ id: string; name: string; isGroup: boolean; avatar: string } | null>(null);

  // Chat/DMs historical logs per channel to simulate conversations
  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([
    { sender: "jarvis", text: "Welcome to the StudySync Group Room! Feel free to coordinate with your study mates.", timestamp: "10:11 AM" },
    { sender: "jarvis", text: "user2: Hey everyone! Let's get together to review Java exception handling notes.", timestamp: "10:15 AM" },
    { sender: "jarvis", text: "user3: Sounds great, count me in!", timestamp: "10:18 AM" },
    { sender: "user", text: "user1: I'm in too! Let me open the study module.", timestamp: "10:20 AM" }
  ]);
  const [dmMessages, setDmMessages] = useState<Record<string, ChatMessage[]>>({
    "user2": [
      { sender: "jarvis", text: "user2: Hey! Let me know if you need to review Java exception handling notes today.", timestamp: "Yesterday" }
    ],
    "user3": [
      { sender: "jarvis", text: "user3: Hi! Did you complete the Discrete Maths truth tables homework?", timestamp: "Yesterday" }
    ],
    "user4": [
      { sender: "jarvis", text: "user4: Hello! Our Database Normalization test is coming up next week.", timestamp: "3 days ago" }
    ]
  });

  // Main Jarvis Assistant conversation state
  const [jarvisMessages, setJarvisMessages] = useState<ChatMessage[]>([
    { sender: "jarvis", text: "Hi! I'm Jarvis, your AI study assistant 🤖", timestamp: "10:42 AM" },
    { sender: "jarvis", text: "I've loaded your latest schedule from StudySync. What would you like to do today?", timestamp: "10:42 AM" }
  ]);
  const [jarvisInput, setJarvisInput] = useState("");
  const [isJarvisLoading, setIsJarvisLoading] = useState(false);

  // General App settings and info modals
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; description: string } | null>(null);

  // Chat window auto-scrollers
  const jarvisChatEndRef = useRef<HTMLDivElement | null>(null);
  const channelChatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    jarvisChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [jarvisMessages, isJarvisLoading]);

  useEffect(() => {
    channelChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages, dmMessages, activeChatChannel]);

  // Auth Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nickname.trim() || !fullName.trim()) {
      setLoginError("Please fill out all fields to decrypt your session.");
      return;
    }
    setIsLoggingIn(true);
    setLoginError("");

    setTimeout(() => {
      const newUserProfile: UserProfile = {
        email: email.trim(),
        nickname: nickname.trim(),
        fullName: fullName.trim()
      };
      localStorage.setItem("studysync_user", JSON.stringify(newUserProfile));
      setUser(newUserProfile);
      setIsLoggingIn(false);
    }, 1200);
  };

  // Logout
  const handleLogout = () => {
    if (window.confirm("Disconnect your secure session profile from this local station?")) {
      localStorage.removeItem("studysync_user");
      setUser(null);
      setEmail("");
      setNickname("");
      setFullName("");
    }
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    let displayDueText = "";
    if (newTaskDueDate) {
      const parts = newTaskDueDate.split("-");
      const monthNamesAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const year = parts[0];
      const monthIndex = parseInt(parts[1]) - 1;
      const day = parts[2];
      const monthName = monthNamesAbbr[monthIndex] || "Jul";
      displayDueText = `${monthName} ${day}`;
      if (newTaskDueTime) {
        displayDueText += `, ${newTaskDueTime}`;
      }
    }

    const newTaskItem: Task = {
      id: "t-" + Date.now(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      dueDate: newTaskDueDate || "2026-07-04",
      completed: false,
      priority: newTaskPriority,
      description: newTaskDesc.trim() || undefined,
      dueText: displayDueText || undefined
    };

    setTasks([newTaskItem, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskDueTime("");
    setShowTaskModal(false);
  };

  // Toggle Completed
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const newSub: Subject = {
      id: "sub-" + Date.now(),
      name: newSubjectName.trim(),
      color: newSubjectColor
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName("");
    setShowSubjectModal(false);
  };

  // Delete Subject
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Stats
  const activeCount = tasks.filter(t => !t.completed).length;
  const doneCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  // July 2026 Calendar days matrix (Wed is July 1st)
  // Calendar days array for July 2026
  const calendarDays = [
    { dayNum: null, isWeekend: false }, // Sun empty
    { dayNum: null, isWeekend: false }, // Mon empty
    { dayNum: null, isWeekend: false }, // Tue empty
    { dayNum: 1, isWeekend: false },
    { dayNum: 2, isWeekend: false },
    { dayNum: 3, isWeekend: false },
    { dayNum: 4, isWeekend: true, isSelected: true }, // Saturday, July 4th
    { dayNum: 5, isWeekend: true, hasDot: true }, // Sunday, July 5th (due date of DA-1)
    { dayNum: 6, isWeekend: false },
    { dayNum: 7, isWeekend: false },
    { dayNum: 8, isWeekend: false },
    { dayNum: 9, isWeekend: false },
    { dayNum: 10, isWeekend: false },
    { dayNum: 11, isWeekend: true },
    { dayNum: 12, isWeekend: true },
    { dayNum: 13, isWeekend: false },
    { dayNum: 14, isWeekend: false },
    { dayNum: 15, isWeekend: false },
    { dayNum: 16, isWeekend: false },
    { dayNum: 17, isWeekend: false },
    { dayNum: 18, isWeekend: true },
    { dayNum: 19, isWeekend: true },
    { dayNum: 20, isWeekend: false },
    { dayNum: 21, isWeekend: false, hasDot: true }, // Tuesday, July 21st (due date of happyhappy)
    { dayNum: 22, isWeekend: false },
    { dayNum: 23, isWeekend: false },
    { dayNum: 24, isWeekend: false },
    { dayNum: 25, isWeekend: true },
    { dayNum: 26, isWeekend: true },
    { dayNum: 27, isWeekend: false },
    { dayNum: 28, isWeekend: false },
    { dayNum: 29, isWeekend: false },
    { dayNum: 30, isWeekend: false },
    { dayNum: 31, isWeekend: false }
  ];

  // Selected date state (defaults to Jul 4, 2026)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(4);

  // Send message to Jarvis Assistant (interacts with backend API or uses intelligent fallback)
  const handleSendJarvis = async (customPrompt?: string) => {
    const textToSend = customPrompt || jarvisInput.trim();
    if (!textToSend || isJarvisLoading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: "user", text: textToSend, timestamp: timeString };

    setJarvisMessages(prev => [...prev, userMsg]);
    setJarvisInput("");
    setIsJarvisLoading(true);

    try {
      // Setup payload matching backend requirements
      const payloadHistory = jarvisMessages.slice(-8).map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: payloadHistory })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      if (data.reply) {
        setJarvisMessages(prev => [...prev, {
          sender: "jarvis",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("No response payload");
      }
    } catch (err) {
      // High fidelity smart fallback responses if server is offline or keys missing
      setTimeout(() => {
        let replyText = "I've processed your prompt. Let me know how I can help you compile, debug, or solve tasks for your subjects!";
        
        if (textToSend.toLowerCase().includes("schedule")) {
          replyText = `Absolutely! Based on your 3 active tasks, here is a highly optimized study schedule: \n\n📅 **9:00 AM - 11:00 AM**: Focus on **CAT - 1** (High priority). Break it into short, 25-minute Pomodoro sprints.\n\n📅 **1:00 PM - 2:30 PM**: Deep dive into **DA-1** (due Jul 05). Revise lecture notes before attempting problems.\n\n📅 **4:00 PM - 5:00 PM**: Review **happyhappy** (due Jun 21, currently overdue). Let's wrap up 'Nothing' and mark it completed!\n\nWould you like me to guide you through any of these subjects?`;
        } else if (textToSend.toLowerCase().includes("discuss")) {
          replyText = `Sure! I have loaded your subjects from StudySync:\n\n1. 📙 **Java**\n2. 📘 **Discrete Maths**\n3. 📕 **Database System**\n\nWhich of these study modules would you like to deep-dive into? Ask me to generate study guides, summary flashcards, or practice questions!`;
        } else if (textToSend.toLowerCase().includes("doubt")) {
          replyText = `Of course! Please describe your doubt or paste the question you're stuck on. I can explain complex terms, solve sample questions step-by-step, or clarify key textbook concepts.`;
        } else if (textToSend.toLowerCase().includes("java")) {
          replyText = `Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. \n\nKey Concepts to review for your **CAT - 1** exam:\n\n- **Inheritance & Polymorphism** (Reusing code & dynamic binding)\n- **Interface vs Abstract Class**\n- **Exceptions** (Checked vs Unchecked)\n\nWould you like a sample coding challenge?`;
        } else if (textToSend.toLowerCase().includes("maths")) {
          replyText = `Discrete Mathematics is the study of mathematical structures that are fundamentally discrete rather than continuous.\n\nLet's get your **DA-1** assignment fully polished! It focuses heavily on Set Theory and Propositional Logic. Would you like a quick overview of Truth Tables or De Morgan's Laws?`;
        } else if (textToSend.toLowerCase().includes("database") || textToSend.toLowerCase().includes("sql")) {
          replyText = `Database Systems manage large amounts of structured information.\n\nSince your **happyhappy** task is pending, let's nail Database Normalization! We can review: \n- **1NF**: Atomic values\n- **2NF**: No partial dependencies\n- **3NF**: No transitive dependencies\n\nShould we draft some sample SQL JOIN queries?`;
        }

        setJarvisMessages(prev => [...prev, {
          sender: "jarvis",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    } finally {
      setIsJarvisLoading(false);
    }
  };

  // Simulated live Chat channel replies
  const handleSendChannelMessage = (channelId: string, messageText: string) => {
    if (!messageText.trim()) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: "user", text: `${user?.nickname || "user1"}: ${messageText}`, timestamp: timeString };

    if (channelId === "group") {
      setGroupMessages(prev => [...prev, userMsg]);
      // Smart delayed reply from automated peer
      setTimeout(() => {
        const peers = ["user2", "user3", "user4"];
        const randomPeer = peers[Math.floor(Math.random() * peers.length)];
        const peerReplies = [
          "Nice! Let's get on a voice call to study Java later tonight.",
          "Agreed. Database normalization always trips me up, we should practice 3NF questions.",
          "Hey everyone! Don't forget that DA-1 is due tomorrow at 12:00 AM.",
          "Is anyone finished with the second question on Discrete Maths propositional logic?"
        ];
        const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

        setGroupMessages(prev => [...prev, {
          sender: "jarvis", // using as generic peer styling
          text: `${randomPeer}: ${randomReply}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1200);
    } else {
      setDmMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), userMsg]
      }));

      setTimeout(() => {
        const directReplies = [
          "Perfect, thanks for sending that! Let's review it together soon.",
          "Awesome. I am still working on the last module, but I'll update you.",
          "Hey! Thanks for messaging. Let's finish this database test assignment tonight.",
          "Got it. I'm joining the library study group room in 10 minutes, join us!"
        ];
        const randomReply = directReplies[Math.floor(Math.random() * directReplies.length)];

        setDmMessages(prev => ({
          ...prev,
          [channelId]: [...(prev[channelId] || []), {
            sender: "jarvis",
            text: `${channelId}: ${randomReply}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        }));
      }, 1000);
    }
  };

  // Tabs layout configuration
  const tabs = [
    { id: "home", label: "Home", icon: LayoutGrid },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "jarvis", label: "Jarvis", icon: Bot },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  // Specific content for note guides
  const getSubjectNotes = (subName: string) => {
    switch (subName) {
      case "Java":
        return [
          { title: "Module 1: Object-Oriented Principles", desc: "Understanding encapsulation, polymorphism, inheritance, and abstraction in core Java. Classes are templates; objects are instances.", code: "class Animal {\n  public void makeSound() {\n    System.out.println(\"Some sound\");\n  }\n}\nclass Dog extends Animal {\n  @Override\n  public void makeSound() {\n    System.out.println(\"Woof woof\");\n  }\n}" },
          { title: "Module 2: Exceptional Control Flows", desc: "How to use try-catch-finally blocks. Difference between Checked exceptions (verified at compile time) and Unchecked exceptions (runtime exceptions like NullPointerException).", code: "try {\n  int result = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.println(\"Division by zero blocked!\");\n} finally {\n  System.out.println(\"Execution completed.\");\n}" },
          { title: "Module 3: Java Collections Framework", desc: "Hierarchy of ArrayList, LinkedList, HashSet, HashMap, and the modern Streams API for functional pipelines.", code: "List<String> list = Arrays.asList(\"Java\", \"Python\", \"Go\");\nlist.stream()\n    .filter(s -> s.startsWith(\"J\"))\n    .forEach(System.out::println);" }
        ];
      case "Discrete Maths":
        return [
          { title: "Module 1: Propositional Logic", desc: "Working with propositional variables, logical connectives (and, or, implication, bi-conditional), and proving equivalences using Truth Tables.", code: "p | q | p ∧ q | p ∨ q | p → q\nT | T |   T   |   T   |   T\nT | F |   F   |   T   |   F\nF | T |   F   |   T   |   T\nF | F |   F   |   F   |   T" },
          { title: "Module 2: Set Theory and Functions", desc: "Set builders, Venn diagrams, union, intersection, subsets, cartesian products, and bijective functions mapping elements accurately.", code: "A = {1, 2, 3}, B = {3, 4, 5}\nA ∪ B = {1, 2, 3, 4, 5}\nA ∩ B = {3}\nA \\ B = {1, 2}" },
          { title: "Module 3: Basics of Graph Theory", desc: "Simple graphs, degree of vertices, Handshaking Lemma, path connectivity, Eulerian paths, Hamilton cycles, and tree node traversals.", code: "Degree(V) = 2 * Edges\nEulerian Path: exactly two vertices of odd degree.\nEulerian Circuit: all vertices of even degree." }
        ];
      case "Database System":
        return [
          { title: "Module 1: Relational Algebra & SQL", desc: "Core relational algebra operators: Selection, Projection, Join, Division. Translated into production SQL declarative queries.", code: "SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id\nWHERE e.salary > 75000\nGROUP BY d.dept_name;" },
          { title: "Module 2: Normalization Blueprints", desc: "Eliminating redundancy through Normal Forms. Key focus is checking partial dependencies (2NF) and transitive dependencies (3NF).", code: "1NF: Eliminate duplicate columns; atomic values\n2NF: Meet 1NF + no non-prime attribute is dependent on proper subset of candidate keys\n3NF: Meet 2NF + no non-prime attribute is transitively dependent on primary key" },
          { title: "Module 3: ACID Transactions", desc: "Understanding ACID transactions: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrency protocols), and Durability (persistence).", code: "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;" }
        ];
      default:
        return [
          { title: "Module 1: Foundations", desc: "Essential introductory definitions, core terms, and glossary key cards for reviewing this study material.", code: "// Standard study modules loaded." }
        ];
    }
  };

  // Render Simulator UI screens
  const renderMobileContent = () => {
    // SCREEN 1: LOGIN GATEWAY ("SyncJarvis")
    if (!user) {
      return (
        <div className="flex flex-col h-full bg-white font-sans overflow-y-auto relative animate-fadeIn">
          {/* Bezel padding spacing */}
          <div className="p-8 pb-4 flex flex-col items-center text-center mt-6">
            <div className="w-16 h-16 bg-[#d1fae5] rounded-[24px] flex items-center justify-center mb-6 shadow-xs border border-[#bbf7d0]">
              <Bot className="w-9 h-9 text-[#00c887]" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              SyncJarvis
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">
              Sign in to start studying smarter
            </p>
          </div>

          <div className="px-6 flex-1 flex flex-col justify-between pb-8">
            <form onSubmit={handleLoginSubmit} className="space-y-4.5 mt-2">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{loginError}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00c887] focus:bg-white transition-all text-slate-800 font-sans"
                  />
                </div>
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 tracking-wide">
                  Nickname
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Alex"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00c887] focus:bg-white transition-all text-slate-800 font-sans"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00c887] focus:bg-white transition-all text-slate-800 font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#00c887] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#00b278] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-md shadow-emerald-100"
              >
                {isLoggingIn ? (
                  <span>Saving Session...</span>
                ) : (
                  <>
                    <span>Save Gmail & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                type="button" 
                onClick={() => {
                  setUser({
                    email: "roopakv835@gmail.com",
                    nickname: "user1",
                    fullName: "user1"
                  });
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // MAIN APP CHASSIS
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-hidden">
        
        {/* Main Header panel (except on Jarvis assistant page which has a custom header) */}
        {activeTab !== "jarvis" && (
          <div className="bg-white px-5 py-4.5 flex items-center justify-between border-b border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-100 rounded-xl text-slate-700 bg-white hover:bg-slate-50">
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Profile badge */}
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-medium">Good evening,</p>
                <p className="text-sm font-bold text-slate-800 leading-none mt-0.5">{user.nickname}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#00c887] flex items-center justify-center text-white font-black text-sm shadow-xs">
                {user.nickname.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* View content container scroll area */}
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: HOME */}
            {activeTab === "home" && (
              <motion.div
                key="home-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Stats cards Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-[20px] p-4 border border-slate-100 flex flex-col items-start shadow-xs">
                    <div className="bg-emerald-50 text-[#00c887] p-2 rounded-xl">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 mt-2 font-sans">{activeCount}</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Active</span>
                  </div>

                  <div className="bg-white rounded-[20px] p-4 border border-slate-100 flex flex-col items-start shadow-xs">
                    <div className="bg-emerald-50 text-[#00c887] p-2 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 mt-2 font-sans">{doneCount}</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Done</span>
                  </div>

                  <div className="bg-white rounded-[20px] p-4 border border-slate-100 flex flex-col items-start shadow-xs">
                    <div className="bg-[#f3effc] text-[#7c3aed] p-2 rounded-xl">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 mt-2 font-sans">{totalCount}</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total</span>
                  </div>
                </div>

                {/* Copilot Jarvis Promo */}
                <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-xs flex items-start gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-[#00c887] rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-100">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-extrabold text-slate-900 text-lg">Ask Jarvis AI</h3>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Need help with your study plan?
                    </p>
                    <button 
                      onClick={() => setActiveTab("jarvis")}
                      className="mt-3 px-5 py-2 bg-[#00c887] hover:bg-[#00b278] text-white font-bold text-xs rounded-full cursor-pointer transition-colors"
                    >
                      Ask Jarvis
                    </button>
                  </div>
                </div>

                {/* Schedule & Calendar */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-slate-900 font-sans tracking-tight px-1">
                    Your Schedule
                  </h2>

                  <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-xs space-y-4">
                    {/* Month selector line */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                      <button className="p-1 text-slate-400 hover:text-slate-700">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-base font-bold text-slate-700 font-sans">
                        July 2026
                      </span>
                      <button className="p-1 text-slate-400 hover:text-slate-700">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Weekdays Row */}
                    <div className="grid grid-cols-7 gap-1 text-center font-sans">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd, i) => (
                        <span 
                          key={wd} 
                          className={`text-xs font-bold py-1 ${i === 0 || i === 6 ? "text-rose-500" : "text-slate-400"}`}
                        >
                          {wd}
                        </span>
                      ))}
                    </div>

                    {/* Calendar grid cells */}
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center font-sans font-medium">
                      {calendarDays.map((cell, idx) => {
                        if (cell.dayNum === null) {
                          return <div key={`empty-${idx}`} className="h-9 w-9"></div>;
                        }

                        const isSelected = selectedCalendarDate === cell.dayNum;
                        
                        return (
                          <button
                            key={`day-${cell.dayNum}`}
                            onClick={() => setSelectedCalendarDate(cell.dayNum)}
                            className={`h-9 w-9 text-xs rounded-full flex flex-col items-center justify-center relative transition-all mx-auto ${
                              isSelected 
                                ? "bg-[#00c887] text-white font-bold shadow-xs" 
                                : cell.isWeekend
                                  ? "text-rose-500 hover:bg-slate-50"
                                  : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{cell.dayNum}</span>
                            {/* Dot indicator representing scheduled task */}
                            {cell.hasDot && !isSelected && (
                              <span className="absolute bottom-1 w-1 h-1 bg-[#00c887] rounded-full"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Inline Schedule list for selected day */}
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
                    Deadlines on July {selectedCalendarDate}, 2026
                  </h3>
                  
                  {/* Filter tasks due on this calendar day */}
                  {tasks.filter(t => {
                    const dayStr = String(selectedCalendarDate).padStart(2, '0');
                    return t.dueDate === `2026-07-${dayStr}` || (selectedCalendarDate === 21 && t.dueDate === "2026-06-21");
                  }).length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 text-slate-400 text-xs">
                      No deliverables due on this date. Enjoy your day!
                    </div>
                  ) : (
                    tasks.filter(t => {
                      const dayStr = String(selectedCalendarDate).padStart(2, '0');
                      return t.dueDate === `2026-07-${dayStr}` || (selectedCalendarDate === 21 && t.dueDate === "2026-06-21");
                    }).map(task => {
                      const associatedSub = subjects.find(s => s.name === task.category);
                      return (
                        <div key={task.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: associatedSub?.color || "#cbd5e1" }}
                            />
                            <div>
                              <p className={`text-sm font-bold text-slate-800 ${task.completed ? "line-through text-slate-400" : ""}`}>{task.title}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{task.category} • {task.dueText || "No time constraint"}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              task.completed ? "bg-emerald-50 text-[#00c887]" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 2: STUDY MATERIALS / NOTES */}
            {activeTab === "notes" && (
              <motion.div
                key="notes-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {!selectedNoteSubject ? (
                  <>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans px-1">
                      Study Materials
                    </h2>

                    <div className="space-y-4">
                      {subjects.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedNoteSubject(sub)}
                          className="w-full text-left text-white rounded-[24px] p-5 flex items-center justify-between shadow-xs transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer"
                          style={{ backgroundColor: sub.color }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-white/15 p-3 rounded-2xl flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-lg font-bold font-sans tracking-wide">
                              {sub.name}
                            </span>
                          </div>
                          <ChevronRight className="w-6 h-6 text-white/80" />
                        </button>
                      ))}

                      {subjects.length === 0 && (
                        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 space-y-2">
                          <p className="text-slate-400 text-sm">No courses added. Head over to settings to build your subject list!</p>
                          <button 
                            onClick={() => setActiveTab("settings")}
                            className="bg-[#00c887] text-white px-5 py-2.5 rounded-full text-xs font-bold"
                          >
                            Go to Settings
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // Deep Dive Note View
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedNoteSubject(null)}
                        className="p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-slate-900 shadow-2xs"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                        {selectedNoteSubject.name} Notes
                      </h2>
                    </div>

                    <div className="bg-white rounded-[24px] p-5 border border-slate-100 space-y-4 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNoteSubject.color }} />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SyncJarvis Academic Curriculum</span>
                      </div>

                      <p className="text-slate-600 text-xs font-medium leading-relaxed">
                        These official summaries have been scanned and organized for your quick review. Click "Discuss with Jarvis" to generate custom exams, clarify formulas, or create flashcards.
                      </p>

                      <button
                        onClick={() => {
                          const query = `I would like to discuss ${selectedNoteSubject.name} study modules.`;
                          setActiveTab("jarvis");
                          handleSendJarvis(query);
                        }}
                        className="w-full bg-[#00c887] hover:bg-[#00b278] text-white font-bold py-3.5 rounded-full text-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Discuss with Jarvis AI</span>
                      </button>
                    </div>

                    {/* Curated list of high-fidelity notes modules */}
                    <div className="space-y-4">
                      {getSubjectNotes(selectedNoteSubject.name).map((mod, i) => (
                        <div key={i} className="bg-white rounded-[24px] p-5 border border-slate-100 space-y-3.5 shadow-2xs">
                          <h4 className="text-sm font-extrabold text-slate-900">{mod.title}</h4>
                          <p className="text-slate-600 text-xs font-medium leading-relaxed">{mod.desc}</p>
                          <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 font-mono text-[11px] text-slate-700 overflow-x-auto whitespace-pre">
                            {mod.code}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: CHAT */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5 h-full flex flex-col"
              >
                {!activeChatChannel ? (
                  <>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans px-1">
                      Chat
                    </h2>

                    {/* Group study card */}
                    <button
                      onClick={() => setActiveChatChannel({ id: "group", name: "Group Study Room", isGroup: true, avatar: "G" })}
                      className="w-full bg-white rounded-[24px] p-4.5 border border-slate-100 flex items-center justify-between shadow-2xs hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#e6fcf5] text-[#00c887] p-3 rounded-2xl">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-800">Group Study Room</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">Chat with everyone</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>

                    {/* Direct Messages */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-slate-500 font-sans tracking-tight px-1 mt-4">
                        Direct Messages
                      </h3>

                      <div className="space-y-3">
                        {[
                          { id: "user2", name: "user2", avatar: "U" },
                          { id: "user3", name: "user3", avatar: "U" },
                          { id: "user4", name: "user4", avatar: "U" }
                        ].map(peer => (
                          <button
                            key={peer.id}
                            onClick={() => setActiveChatChannel({ id: peer.id, name: peer.name, isGroup: false, avatar: peer.avatar })}
                            className="w-full bg-white rounded-[24px] p-4.5 border border-slate-100 flex items-center justify-between shadow-2xs hover:bg-slate-50 transition-colors text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-[#e6fcf5] text-[#00c887] font-black text-base w-10 h-10 rounded-full flex items-center justify-center shadow-2xs">
                                {peer.avatar}
                              </div>
                              <span className="text-base font-extrabold text-slate-800">{peer.name}</span>
                            </div>
                            <MessageSquare className="w-4 h-4 text-slate-300" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  // Active Chat Channel Screen
                  <div className="flex flex-col h-[520px] bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm relative">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setActiveChatChannel(null)}
                          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#00c887]/20 text-[#00c887] flex items-center justify-center font-black text-sm border border-[#00c887]/30">
                          {activeChatChannel.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold">{activeChatChannel.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">{activeChatChannel.isGroup ? "Automated Live Peer Room" : "Online"}</p>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 bg-[#00c887] rounded-full animate-pulse" />
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
                      {(activeChatChannel.id === "group" ? groupMessages : dmMessages[activeChatChannel.id] || []).map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] rounded-[20px] px-4 py-2.5 text-xs font-sans shadow-2xs ${
                            msg.sender === "user"
                              ? "bg-[#00c887] text-white rounded-tr-none"
                              : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                            <span className={`block text-[8px] font-mono mt-1 text-right ${
                              msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                            }`}>{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={channelChatEndRef} />
                    </div>

                    {/* Input send bar */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const inputEl = e.currentTarget.elements.namedItem("channelInput") as HTMLInputElement;
                        if (inputEl && inputEl.value.trim()) {
                          handleSendChannelMessage(activeChatChannel.id, inputEl.value);
                          inputEl.value = "";
                        }
                      }}
                      className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0"
                    >
                      <input
                        name="channelInput"
                        type="text"
                        placeholder={`Message ${activeChatChannel.name}...`}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:border-[#00c887] focus:bg-white text-slate-800 font-semibold"
                      />
                      <button 
                        type="submit"
                        className="bg-[#00c887] text-white p-2.5 rounded-full hover:bg-[#00b278] transition-colors shrink-0 cursor-pointer flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: JARVIS */}
            {activeTab === "jarvis" && (
              <motion.div
                key="jarvis-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-[520px] bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden relative"
              >
                {/* Jarvis Custom Header */}
                <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e6fcf5] text-[#00c887] rounded-2xl flex items-center justify-center shadow-2xs border border-emerald-50">
                      <Bot className="w-5 h-5 text-[#00c887]" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">Jarvis</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                  
                  {/* Reload clear history icon */}
                  <button 
                    onClick={() => {
                      if (window.confirm("Do you want to reset Jarvis chat history?")) {
                        setJarvisMessages([
                          { sender: "jarvis", text: "Hi! I'm Jarvis, your AI study assistant 🤖", timestamp: "10:42 AM" },
                          { sender: "jarvis", text: "I've loaded your latest schedule from StudySync. What would you like to do today?", timestamp: "10:42 AM" }
                        ]);
                      }
                    }}
                    className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages Body scroll section */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                  {jarvisMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-[24px] px-4.5 py-3 text-xs font-sans shadow-2xs ${
                        msg.sender === "user"
                          ? "bg-[#00c887] text-white rounded-br-none font-medium"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-100 font-medium"
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`block text-[8px] font-mono mt-1 text-right ${
                          msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                        }`}>{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {isJarvisLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 text-xs font-sans shadow-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#00c887] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#00c887] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-[#00c887] rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="font-mono text-[9px] text-slate-400 ml-1">Jarvis is processing...</span>
                      </div>
                    </div>
                  )}

                  {/* Suggestion cards (rendered only when not loading, to prompt helper tasks) */}
                  {!isJarvisLoading && jarvisMessages.length <= 3 && (
                    <div className="space-y-3.5 pt-2">
                      {/* Card 1: Schedule a Day */}
                      <button
                        onClick={() => handleSendJarvis("Can you help me schedule my day based on my current tasks?")}
                        className="w-full bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-left shadow-2xs hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#e6fcf5] text-[#00c887] p-2 rounded-xl">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 font-sans">Schedule a Day</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Plan based on your tasks</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>

                      {/* Card 2: Discuss Studies */}
                      <button
                        onClick={() => handleSendJarvis("I'd like to discuss my study materials.")}
                        className="w-full bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-left shadow-2xs hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 text-blue-500 p-2 rounded-xl">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 font-sans">Discuss Studies</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Deep dive using your notes</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>

                      {/* Card 3: Ask a Doubt */}
                      <button
                        onClick={() => handleSendJarvis("I have a doubt about my course.")}
                        className="w-full bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-left shadow-2xs hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-50 text-purple-500 p-2 rounded-xl">
                            <HelpCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 font-sans">Ask a Doubt</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">AI answers from your modules</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>
                  )}

                  <div ref={jarvisChatEndRef} />
                </div>

                {/* Input text send block */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendJarvis();
                  }}
                  className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Ask Jarvis anything..."
                    value={jarvisInput}
                    onChange={(e) => setJarvisInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:border-[#00c887] focus:bg-white text-slate-800 font-semibold"
                  />
                  <button 
                    type="submit"
                    disabled={isJarvisLoading || !jarvisInput.trim()}
                    className="bg-[#00c887] text-white p-2.5 rounded-full hover:bg-[#00b278] disabled:opacity-50 transition-colors shrink-0 cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 5: TASKS */}
            {activeTab === "tasks" && (
              <motion.div
                key="tasks-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans px-1">
                  Tasks
                </h2>

                {/* Task category switcher tabs */}
                <div className="flex border-b border-slate-100 pb-1 gap-6 px-1 mb-4 font-sans text-sm font-extrabold text-slate-400">
                  {["All", "Active", "Done"].map(tabName => {
                    const isTabActive = tabName === "All"; // Simplify high-fidelity visual matching
                    return (
                      <button
                        key={tabName}
                        className={`pb-2 relative ${isTabActive ? "text-[#00c887]" : "hover:text-slate-600"}`}
                      >
                        <span>{tabName}</span>
                        {isTabActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c887] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tasks List matches exact layout from Tasks screenshot */}
                <div className="space-y-3.5">
                  {tasks.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 text-slate-400 text-xs">
                      No tasks in this segment. Create a new target!
                    </div>
                  ) : (
                    tasks.map(task => {
                      const associatedSub = subjects.find(s => s.name === task.category);
                      return (
                        <div 
                          key={task.id}
                          className="bg-white rounded-[20px] p-4.5 border border-slate-100 shadow-xs flex items-center justify-between relative overflow-hidden pl-5"
                        >
                          {/* Green vertical thick line indicator */}
                          <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-[#00c887] rounded-r-md" />

                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className={`text-base font-extrabold text-slate-800 truncate ${task.completed ? "line-through text-slate-400" : ""}`}>
                              {task.title}
                            </h4>
                            
                            {/* Description subtext (e.g., 'Nothing') */}
                            {task.description && (
                              <p className="text-xs text-slate-400 font-semibold mt-1">
                                {task.description}
                              </p>
                            )}

                            {/* Due date time subtext */}
                            {task.dueText && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{task.dueText}</span>
                              </div>
                            )}
                          </div>

                          {/* Control buttons */}
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                task.completed 
                                  ? "bg-[#00c887] border-[#00c887] text-white" 
                                  : "border-slate-300 hover:border-[#00c887] bg-white"
                              }`}
                            >
                              {task.completed && <Check className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Floating Plus button */}
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-[#00c887] hover:bg-[#00b278] text-white p-4.5 rounded-full shadow-lg fixed bottom-24 right-8 z-30 cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-none"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </motion.div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans px-1">
                  Settings
                </h2>

                {/* User Info Card */}
                <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#00c887] text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 leading-none">{user.fullName}</h4>
                    <p className="text-xs text-[#00c887] font-bold mt-1.5">@{user.nickname}</p>
                    <p className="text-sm text-slate-400 font-semibold mt-0.5">{user.email}</p>
                  </div>
                </div>

                {/* Subjects Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                      Subjects
                    </h3>
                    <button
                      onClick={() => setShowSubjectModal(true)}
                      className="bg-[#dcfce7] text-[#00c887] px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {subjects.map(sub => (
                      <div 
                        key={sub.id}
                        className="bg-white rounded-xl p-4.5 border border-slate-100 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                          <span className="text-base font-extrabold text-slate-700">{sub.name}</span>
                        </div>
                        <button
                          onClick={() => deleteSubject(sub.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {subjects.length === 0 && (
                      <p className="text-xs text-slate-400 font-semibold text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">
                        No active subjects loaded. Click Add above to create one.
                      </p>
                    )}
                  </div>
                </div>

                {/* General Section */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-sans px-1 mt-4">
                    General
                  </h3>

                  <div className="space-y-3 font-sans font-bold">
                    {/* Item 1: Notifications */}
                    <button 
                      onClick={() => setInfoModalContent({
                        title: "Notifications",
                        description: "Push notifications and schedule reminders are active! SyncJarvis will notify you 15 minutes before your assignments and exam timings."
                      })}
                      className="w-full bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 text-slate-700">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <span className="text-base font-extrabold text-slate-800">Notifications</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>

                    {/* Item 2: Help & Support */}
                    <button 
                      onClick={() => setInfoModalContent({
                        title: "Help & Support",
                        description: "Need help? SyncJarvis supports offline local caching. Check your browser parameters or clear persistent state logs to decouple your profile anytime."
                      })}
                      className="w-full bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 text-slate-700">
                        <HelpCircle className="w-5 h-5 text-slate-400" />
                        <span className="text-base font-extrabold text-slate-800">Help & Support</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>

                    {/* Item 3: About StudySync */}
                    <button 
                      onClick={() => setInfoModalContent({
                        title: "About StudySync",
                        description: "StudySync is a futuristic academic co-pilot ecosystem designed to align your class deadlines, syllabus notes, and exam schedules into an elegant central dashboard."
                      })}
                      className="w-full bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 text-slate-700">
                        <Info className="w-5 h-5 text-slate-400" />
                        <span className="text-base font-extrabold text-slate-800">About StudySync</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                  </div>
                </div>

                {/* Decouple / Log out option */}
                <div className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-rose-50 border border-rose-100 text-rose-600 py-4 rounded-full font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Decouple Identity & Logout</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION BAR - EXACT REPLICA OF THE SCREENSHOTS */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-3 py-3 flex justify-around items-center shrink-0 z-40 shadow-lg pb-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  // Reset active views when switching main tabs
                  setSelectedNoteSubject(null);
                  setActiveChatChannel(null);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#cef2e0] text-[#00c887]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "text-[#00c887]" : "text-slate-400"}`} />
                {isActive && (
                  <span className="text-xs font-bold font-sans text-[#00a870] tracking-wide">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-100">
      
      {/* Dynamic Simulator Control Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-2xs z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" /> Precision Mockup Preview
            </span>
            <h1 className="text-lg md:text-xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              StudySync SyncJarvis Prototype
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setDisplayMode("flat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === "flat" 
                  ? "bg-white text-slate-800 shadow-xs border border-slate-200/50" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Flat Screen</span>
            </button>
            <button
              onClick={() => setDisplayMode("3d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === "3d" 
                  ? "bg-white text-slate-800 shadow-xs border border-slate-200/50" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Tilt View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Arena */}
      <div className="flex-1 w-full mx-auto p-4 md:p-10 flex items-center justify-center">
        {displayMode === "3d" ? (
          <div className="perspective-container py-12 w-full flex justify-center items-center">
            <div className="device-3d w-full max-w-[390px] h-[812px] rounded-[50px] border-[12px] border-slate-900 bg-white overflow-hidden relative shadow-2xl flex flex-col ring-4 ring-slate-800 ring-offset-2">
              
              {/* Speaker notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex justify-center items-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
              </div>

              {/* Simulated status bar */}
              <div className="h-6 bg-white shrink-0 z-50 flex justify-between items-center px-6 text-[10px] font-bold text-slate-800 pt-1.5">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>LTE</span>
                  <div className="w-4 h-2 bg-slate-800 rounded-2xs" />
                </div>
              </div>

              {/* Screen view content */}
              <div className="flex-1 h-full relative">
                {renderMobileContent()}
              </div>

              {/* Bottom Swipe Indicator */}
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-900 rounded-full z-50" />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center py-4">
            <div className="w-full max-w-[390px] h-[812px] border-[12px] border-slate-900 bg-white overflow-hidden rounded-[50px] shadow-2xl flex flex-col relative ring-1 ring-slate-100">
              
              {/* Simulated status bar */}
              <div className="h-6 bg-white shrink-0 z-50 flex justify-between items-center px-6 text-[10px] font-bold text-slate-800 pt-1.5">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>LTE</span>
                  <div className="w-4 h-2 bg-slate-800 rounded-2xs" />
                </div>
              </div>

              {/* Screen content space */}
              <div className="flex-1 h-full relative">
                {renderMobileContent()}
              </div>

              {/* Bottom Swipe Indicator */}
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-900 rounded-full z-50" />
            </div>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center p-4">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 space-y-4 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowTaskModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-slate-900 font-sans">New Assignment Target</h3>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Assignment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CAT - 1"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Nothing"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Course / Subject</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887] font-semibold text-slate-800"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887] text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Due Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 12:00 AM"
                      value={newTaskDueTime}
                      onChange={(e) => setNewTaskDueTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887] text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Priority Level</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887] font-semibold text-slate-800"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00c887] hover:bg-[#00b278] text-white py-3 rounded-full font-bold text-xs transition-all cursor-pointer"
                >
                  Deploy Target Assignment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showSubjectModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xs p-6 space-y-4 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowSubjectModal(false)}
                className="absolute right-4 top-4 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-slate-900 font-sans">Add Subject Module</h3>

              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Computer Networks"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c887]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Visual Theme Color</label>
                  <div className="flex gap-2 pt-1">
                    {[
                      "#ff6b00", // Orange
                      "#0084ff", // Blue
                      "#ff2d55", // Red
                      "#10b981", // Green
                      "#8b5cf6", // Purple
                      "#f59e0b"  // Amber
                    ].map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewSubjectColor(col)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          newSubjectColor === col ? "border-slate-800 scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00c887] hover:bg-[#00b278] text-white py-3 rounded-full font-bold text-xs transition-all cursor-pointer"
                >
                  Save Subject Module
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* General Settings info Modal */}
      <AnimatePresence>
        {infoModalContent && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xs p-6 space-y-3 relative shadow-2xl"
            >
              <button 
                onClick={() => setInfoModalContent(null)}
                className="absolute right-4 top-4 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-slate-900 font-sans">{infoModalContent.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                {infoModalContent.description}
              </p>

              <button
                onClick={() => setInfoModalContent(null)}
                className="w-full bg-[#00c887] hover:bg-[#00b278] text-white py-2.5 rounded-full font-bold text-xs mt-2 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info line */}
      <div className="bg-slate-900 text-slate-400 py-4 text-center border-t border-slate-800 text-xs font-mono">
        <span>UTC LOCAL TIME: 2026-07-04 • SYNCHRONIZED ACADEMIC STATIONS</span>
      </div>

    </div>
  );
}
