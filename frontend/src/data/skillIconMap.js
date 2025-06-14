// skillIconMap.js
import {
  Activity, AlertTriangle, Anchor, Hand, Atom, BarChart, BarChart2, Book, BookOpen, Box, Brain, Briefcase,
  Brush, Building, Calculator, Calendar, Camera, ChartArea, ChartNetwork, ChartSpline, CheckCircle, ClipboardList, Clock, 
  Cloud, Code, Code2, Compass, Cpu, CreditCard, Database, Dna, DollarSign, DraftingCompass, Eye, FileSearch, FileText,
  Figma, Film, Flag, FlaskConical, Folder, Gamepad, Gavel, GitBranch, Github, GlassWater, Globe, 
  Handshake, Headphones, Heart, HeartPulse, Home, Image, Languages, Layout, Leaf, Lightbulb, LineChart, 
  Link, List, Lock, Mail, Map, Megaphone, MessageCircle, MessageSquare, Mic, Monitor, Music, Package, 
  Paintbrush2, 	Footprints, PenTool, Pencil, Percent, Phone, Pill, Play, Printer, Receipt, RefreshCw, Search, Server, 
  Settings, Share2, Shield, ShoppingCart, Sigma, Slice, Smile, Sun, Tag, Target, Terminal, TestTube, TrendingUp, Truck, Trash, 
  Users, User, UserPlus, Utensils, Video, Webhook, Wrench, Worm, Zap, Globe2,
  Pen
} from "lucide-react";

const skillIconMap = {
  // Technology
  "Android Development": Phone,
  "Angular": Code2,
  "API Development": Webhook,
  "Artificial Intelligence": Brain,
  "AWS": Cloud,
  "Azure": Cloud,
  "Blockchain": Link,
  "C": Code,
  "C++": Code2,
  "Cloud Computing": Cloud,
  "CSS": Code2,
  "Cybersecurity": Shield,
  "Data Analysis": BarChart2,
  "Data Engineering": Database,
  "Data Science": Activity,
  "Database Management": Database,
  "Django": Code2,
  "Docker": Package,
  "Figma": Figma,
  "Flutter": Phone,
  "Frontend Development": Layout,
  "Git": GitBranch,
  "GitHub": Github,
  "Go": Code2,
  "HTML": Code2,
  "iOS Development": Phone,
  "Java": Code2,
  "JavaScript": Code2,
  "Jenkins": Server,
  "Kotlin": Code2,
  "Kubernetes": Server,
  "Linux": Terminal,
  "Machine Learning": Brain,
  "MATLAB": Code2,
  "MongoDB": Database,
  "MySQL": Database,
  "NodeJS": Server,
  "NoSQL": Database,
  "PHP": Code2,
  "PostgreSQL": Database,
  "Python": Code2,
  "R": Code2,
  "React": Atom,
  "React Native": Phone,
  "Ruby": Code2,
  "Ruby on Rails": Code2,
  "Scala": Code2,
  "SQL": Database,
  "Swift": Code2,
  "TensorFlow": Brain,
  "TypeScript": Code2,
  "Unity": Gamepad,
  "Unreal Engine": Gamepad,
  "VueJS": Code2,
  "Web Development": Globe,
  "WordPress": PenTool,
  "Algorithms": Cpu,
  "Apache": Server,
  "Big Data": Database,
  "Computer Globeing": Globe,
  "Computer Programming": Code2,
  "Google Cloud Platform": Cloud,
  "Mobile Development": Phone,
  "Network Architecture": Globe,
  "Operating Systems": Terminal,
  "Software Engineering": Code2,
  "Statistical Programming": Code2,
  
  // Soft Skills
  "Adaptability": RefreshCw,
  "Collaboration": Users,
  "Communication": MessageCircle,
  "Creativity": Lightbulb,
  "Critical Thinking": Brain,
  "Emotional Intelligence": Heart,
  "Leadership": Flag,
  "Negotiation": Handshake,
  "Organization": List,
  "Problem Solving": Wrench,
  "Project Management": ClipboardList,
  "Public Speaking": Mic,
  "Teamwork": Users,
  "Time Management": Clock,
  "Resilience": Shield,
  "Writing": PenTool,
  
  // Design & Creative
  "3D Modeling": Box,
  "Adobe After Effects": Film,
  "Adobe Illustrator": PenTool,
  "Adobe InDesign": BookOpen,
  "Adobe Photoshop": Image,
  "Animation": Play,
  "Art Direction": Compass,
  "Audio Editing": Music,
  "Branding": Tag,
  "Canva": Image,
  "Content Creation": FileText,
  "Digital Illustration": PenTool,
  "Graphic Design": Paintbrush2,
  "Logo Design": PenTool,
  "Photography": Camera,
  "Sketch": Pencil,
  "UI/UX Design": Layout,
  "Video Editing": Video,
  "Visual Design": Layout,
  
  // Business & Management
  "Account Management": Briefcase,
  "Analytics": BarChart,
  "Budgeting": DollarSign,
  "Business Development": TrendingUp,
  "Business Strategy": Target,
  "Client Relations": Handshake,
  "Consulting": Briefcase,
  "CRM Management": Users,
  "Customer Service": Headphones,
  "E-commerce": ShoppingCart,
  "Event Planning": Calendar,
  "Finance": DollarSign,
  "Human Resources": Users,
  "Inventory Management": Package,
  "Market Research": Search,
  "Marketing Strategy": Target,
  "Operations Management": Settings,
  "Procurement": ShoppingCart,
  "Product Management": Package,
  "Project Coordination": ClipboardList,
  "Quality Assurance": CheckCircle,
  "Risk Management": AlertTriangle,
  "Sales": TrendingUp,
  "Scrum": RefreshCw,
  "Supply Chain Management": Truck,
  "Business Intelligence": BarChart,
  "Mergers & Acquisitions": Handshake,
  "Organizational Development": Users,
  "Process Analysis": Settings,
  "Recruitment": UserPlus,
  "Strategy": Target,
  
  // Healthcare & Medical
  "Anatomy": Heart,
  "Clinical Research": FlaskConical,
  "Dentistry": Smile,
  "First Aid": HeartPulse,
  "Healthcare Management": ClipboardList,
  "Medical Coding": Code,
  "Medical Writing": FileText,
  "Nursing": HeartPulse,
  "Pharmacy": Pill,
  "Physical Therapy": Hand,
  "Public Health": Shield,
  "Surgery": Slice,
  "Telemedicine": Phone,
  "Bioinformatics": Dna,
  "Epidemiology": Worm,
  
  // Education & Training
  "Classroom Management": Book,
  "Curriculum Development": BookOpen,
  "E-Learning": Monitor,
  "Instructional Design": BookOpen,
  "Lesson Planning": Book,
  "Online Teaching": Monitor,
  "Special Education": Book,
  "Student Counseling": MessageCircle,
  "Teaching": Book,
  "Training and Development": BookOpen,
  
  // Finance & Accounting
  "Accounting": Calculator,
  "Auditing": FileSearch,
  "Bookkeeping": Book,
  "Cost Accounting": Calculator,
  "Financial Analysis": BarChart,
  "Financial Modeling": LineChart,
  "Investment Analysis": ChartArea,
  "Payroll Management": CreditCard,
  "Tax Preparation": Receipt,
  "Basic Descriptive Statistics": BarChart,
  "Econometrics": LineChart,
  "Entrepreneurial Finance": DollarSign,
  "Estimation": Percent,
  "General Statistics": BarChart,
  "Probability & Statistics": BarChart,
  "Regression": LineChart,
  
  // Legal
  "Contract Negotiation": Handshake,
  "Corporate Law": Building,
  "Criminal Law": Gavel,
  "Family Law": Home,
  "Intellectual Property": Lightbulb,
  "Legal Research": Search,
  "Litigation": Gavel,
  "Mediation": Handshake,
  "Regulatory Compliance": Shield,
  
  // Manufacturing & Engineering
  "3D Printing": Printer,
  "AutoCAD": DraftingCompass,
  "CAD Design": DraftingCompass,
  "Civil Engineering": Building,
  "Electrical Engineering": Zap,
  "Industrial Automation": Cpu,
  "Lean Manufacturing": Settings,
  "Mechanical Engineering": Settings,
  "Process Improvement": RefreshCw,
  "Quality Control": CheckCircle,
  "Robotics": Cpu,
  "SolidWorks": Box,
  "Structural Engineering": Building,
  
  // Marketing & Advertising
  "Affiliate Marketing": Share2,
  "Brand Management": Tag,
  "Campaign Management": Megaphone,
  "Content Marketing": FileText,
  "Copywriting": PenTool,
  "Digital Advertising": Monitor,
  "Email Marketing": Mail,
  "Google Ads": Search,
  "Influencer Marketing": User,
  "Market Analysis": BarChart,
  "Public Relations": Megaphone,
  "SEO": Search,
  "Social Media Marketing": Share2,
  "Web Analytics": BarChart,
  "Advertising": Megaphone,
  
  // Hospitality & Tourism
  "Bartending": GlassWater,
  "Catering": Utensils,
  "Event Management": Calendar,
  "Food Preparation": Utensils,
  "Hotel Management": Home,
  "Housekeeping": Home,
  "Tour Guiding": Map,
  "Travel Planning": Map,
  "Waitstaff Service": Utensils,
  
  // Environment & Sustainability
  "Environmental Assessment": Leaf,
  "Environmental Compliance": Shield,
  "Renewable Energy": Sun,
  "Sustainability Planning": Leaf,
  "Waste Management": Trash,
  "Wildlife Conservation": 	Footprints,
  
  // Miscellaneous & Emerging Skills
  "Augmented Reality (AR)": Box,
  "Chatbot Development": MessageCircle,
  "Cryptography": Lock,
  "Drone Operation": Cpu,
  "Internet of Things (IoT)": Cpu,
  "Quantum Computing": Cpu,
  "Virtual Reality (VR)": Box,
  "Business Psychology": Brain,
  "FinTech": DollarSign,
  "Planning": Calendar,
  "Research and Design": FlaskConical,
  
  // Languages
  "English": Languages,
  "Spanish": Languages,
  "French": Languages,
  "German": Languages,
  "Mandarin": Languages,
  "Japanese": Languages,
  "Hindi": Languages,
  
  // New Additions
  "Accounting Software": Calculator,
  "Accounts Payable and Receivable": Calculator,
  "Billing & Invoicing": Receipt,
  "Cloud API": Cloud,
  "Cloud Clients": Cloud,
  "Cloud Engineering": Cloud,
  "Cloud Load Balancing": Cloud,
  "Cloud Management": Cloud,
  "Cloud Platforms": Cloud,
  "Cloud Standards": Cloud,
  "Cloud Storage": Cloud,
  "Cloud-Based Integration": Cloud,
  "Computer Architecture": Cpu,
  "Computer Programming Tools": Code,
  "Data Analysis Software": BarChart,
  "Data Architecture": Database,
  "Data Mining": Database,
  "Data Structures": Code,
  "Data Visualization Software": BarChart,
  "Data Warehousing": Database,
  "Database Administration": Database,
  "Database Application": Database,
  "Database Theory": Database,
  "Devops Tools": Server,
  "Differential Equations": ChartSpline,
  "Distributed Computing Architecture": Globe,
  "Game Theory": Gamepad,
  "GIS Software": Map,
  "Graph Theory": ChartNetwork,
  "Hardware Design": Cpu,
  "IBM Cloud": Cloud,
  "Jira (Software)": ClipboardList,
  "Knitr": Code,
  "Leadership Development": Flag,
  "Machine Learning Software": Brain,
  "Media Strategy & Planning": Calendar,
  "Microarchitecture": Cpu,
  "Minitab": Code,
  "Mobile Development Tools": Phone,
  "Network Analysis": Globe,
  "Network Model": Globe2,
  "Networking Hardware": Globe2,
  "Operational Analysis": Settings,
  "Operations Research": Search,
  "Other Cloud Platforms and Tools": Cloud,
  "Other Programming Languages": Code,
  "Other Web Frameworks": Code,
  "SAS (Software)": Code,
  "Scientific Visualization": Eye,
  "Security Software": Shield,
  "Semantic Web": Globe,
  "Software Architecture": Cpu,
  "Software As A Service": Cloud,
  "Software Framework": Code,
  "Software Security": Shield,
  "Software Testing": TestTube,
  "Software-Defined Networking": Globe2,
  "Spatial Analysis": Map,
  "Spatial Data Analysis": Map,
  "Statistical Analysis": BarChart,
  "Statistical Machine Learning": Brain,
  "Statistical Tests": BarChart,
  "Statistical Visualization": BarChart,
  "Store Management": Home,
  "System Programming": Cpu,
  "System Software": Cpu,
  "Systems Design": Globe2,
  "Tableau Software": BarChart,
  "Talent Management": User,
  "Technical Product Management": Package,
  "Theoretical Computer Science": Cpu,
  "Transportation Operations Management": Truck,
  "Underwriting": FileText,
  "Web Development Tools": Code
};

export default skillIconMap;