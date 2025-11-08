import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Zap,
  CheckCircle2,
  Star,
  TrendingUp,
  Shield,
  Users,
  Target,
  Rocket,
  Globe,
  Database,
  Search,
  BarChart3,
  Award,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="LexiCase Logo" className="h-6 w-6" />
              <span className="text-lg font-bold text-zinc-300">
                LexiCase
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#technology" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Technology
              </a>
              <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Testimonials
              </a>
              <Button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/20"
              >
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge className="px-4 py-2 bg-blue-600/10 text-blue-400 border-blue-600/20 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-2" />
              Innovative AI solution 2025 by Team Nirvana
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-white mb-2">Manage and simulate</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent  leading-[1.15] pb-2">
                legal workflows
              </span>
            </h1>
            <p className="text-xl md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              We empower lawyers and legal teams to create, simulate, and
              manage AI-driven workflows visually for legal intelligence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-600/40 px-8 py-6 text-lg"
            >
              Start building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a href="#pricing">
              <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-6 text-lg">
                View pricing
              </Button>
            </a>
          </div>

          {/* Trusted By */}
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
            <div className="flex -space-x-2">
              {[
                'https://i.pravatar.cc/150?img=12',
                'https://i.pravatar.cc/150?img=33',
                'https://i.pravatar.cc/150?img=47',
                'https://i.pravatar.cc/150?img=58',
                'https://i.pravatar.cc/150?img=68',
              ].map((avatar, i) => (
                <img 
                  key={i} 
                  src={avatar} 
                  alt={`User ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover"
                />
              ))}
            </div>
            <span className="text-zinc-400">Trusted by fast growing legal firms</span>
          </div>
          {/* Hero Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800/50 shadow-2xl shadow-black/50 bg-zinc-900/50 backdrop-blur-sm">
              <div className="p-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      <Scale className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: '128 Active cases', value: '86.7%', trend: '+12.5%' },
                    { label: 'Task completion', value: '12.4k', trend: '27%' },
                    { label: 'Average resolution', value: '2.3 days', trend: 'Improved' },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-zinc-800/50 border-zinc-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-400">{stat.label}</span>
                          <span className="text-xs text-green-400">{stat.trend}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Workflow Monitor */}
                <Card className="bg-zinc-800/30 border-zinc-700/50">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Contract Review AI', model: 'Gemini-Pro', status: 'Active', time: '2 min ago' },
                        { name: 'Case Research Agent', model: 'GPT-4', status: 'Complete', time: '15 min ago' },
                        { name: 'Document Analysis', model: 'Claude-3', status: 'Processing', time: '1 hour ago' },
                      ].map((workflow, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                            <span className="text-sm text-white">{workflow.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <span className="px-2 py-1 rounded bg-blue-600/20 text-blue-400">{workflow.model}</span>
                            <span>{workflow.status}</span>
                            <span>{workflow.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-purple-600/10 text-purple-400 border-purple-600/20">
              Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Built for Legal Intelligence
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Build, test and deploy AI agents with a powerful visual interface designed
              for legal professionals and law firms.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Triple AI integration with Gemini, Pinecone vectors, and DuckDuckGo web agent for comprehensive legal intelligence.',
              },
              {
                icon: MessageSquare,
                title: 'Intelligent Chatbot',
                description: 'Context-aware AI assistant with semantic search and real-time web citations for legal research.',
              },
              {
                icon: Calendar,
                title: 'Smart Calendar & Tasks',
                description: 'Enterprise-grade task management with 4-stage workflow, auto-sync, and click-any-date quick actions.',
              },
              {
                icon: FileText,
                title: 'Case Management',
                description: 'Centralized case organization with document repository, meeting tracking, and action items.',
              },
              {
                icon: Search,
                title: 'Web Search Agent',
                description: 'First legal AI with built-in DuckDuckGo integration for real-time case law and citation lookup.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Live dashboard with 5 statistics cards, critical insights tracking, and deadline monitoring.',
              },
            ].map((feature, i) => (
              <Card key={i} className="group bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8 relative">
                  <div className="p-3 rounded-xl bg-blue-600/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Workflow Design Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 px-4 py-2 bg-blue-600/10 text-blue-400 border-blue-600/20">
                <Rocket className="h-3 w-3 mr-2" />
                Design your Workflow
              </Badge>
              <h2 className="text-5xl font-bold text-white mb-6">
                A drag-and-drop interface to create, connect, and configure agents
              </h2>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                Build complex legal workflows visually with our intuitive interface. Connect AI agents,
                configure tasks, and deploy sophisticated case management systems in minutes.
              </p>
              <div className="space-y-4">
                {[
                  'Visual workflow builder with 60+ modular components',
                  'Real-time collaboration and version control',
                  'Pre-built templates for common legal scenarios',
                  'Seamless integration with 40+ API endpoints',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-600/20 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-zinc-900/80 border-zinc-800 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600/20">
                          <Brain className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">AI Analysis Agent</div>
                          <div className="text-xs text-zinc-400">Processing meeting transcript</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Active</Badge>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-12 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-600/20">
                          <Database className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Vector Search</div>
                          <div className="text-xs text-zinc-400">Semantic indexing with Pinecone</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Running</Badge>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-12 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-600/20">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Task Creation</div>
                          <div className="text-xs text-zinc-400">Auto-sync to calendar</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-green-600/10 text-green-400 border-green-600/20">
              <Zap className="h-3 w-3 mr-2" />
              Technology
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Production-Grade Tech Stack
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Built with modern technologies for scalability, performance, and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: 'Backend Excellence',
                items: [
                  'FastAPI - High-performance async API',
                  'Google Gemini AI - Advanced NLP',
                  'Pinecone - Vector database',
                  'SQLAlchemy - Powerful ORM',
                  'DuckDuckGo API - Web search',
                  'LangChain - AI orchestration',
                ],
              },
              {
                title: 'Frontend Innovation',
                items: [
                  'React 18 - Modern UI library',
                  'TypeScript - Type-safe code',
                  'TailwindCSS v4 - Utility styling',
                  'Shadcn UI - Beautiful components',
                  'TanStack Query - State management',
                  'Vite - Lightning-fast builds',
                ],
              },
            ].map((section, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-400" />
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">{section.title}</h3>
                  <div className="space-y-3">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30 group-hover:bg-zinc-800/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                        <span className="text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: '60+', label: 'Components', icon: Target },
              { value: '40+', label: 'API Endpoints', icon: Globe },
              { value: '97%', label: 'Time Saved', icon: TrendingUp },
              { value: '0', label: 'Critical Bugs', icon: Shield },
            ].map((stat, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800/50 text-center group hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-purple-600/10 text-purple-400 border-purple-600/20">
              <Award className="h-3 w-3 mr-2" />
              Pricing
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Flexible pricing designed for teams of all sizes. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Freemium',
                price: '$0',
                period: 'forever',
                description: 'Perfect for trying out LEXICASE',
                features: [
                  '5 AI conversations/day',
                  'Basic task management',
                  'Single user access',
                  'Email support',
                  'Mobile app access',
                ],
                cta: 'Get Started Free',
                highlighted: false,
              },
              {
                name: 'Professional',
                price: '$49',
                period: '/user/month',
                description: 'Ideal for growing legal teams',
                features: [
                  'Unlimited AI conversations',
                  'Advanced task management',
                  'Up to 50 users',
                  'Priority support',
                  'API access',
                  'Custom workflows',
                  'Analytics dashboard',
                  'Web search agent',
                ],
                cta: 'Start 14-Day Trial',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: '$299',
                period: '/user/month',
                description: 'For large organizations',
                features: [
                  'Everything in Professional',
                  'Unlimited users',
                  'Dedicated support',
                  'Custom AI models',
                  'On-premise deployment',
                  'SLA guarantee',
                  'Advanced security',
                  'Custom integrations',
                ],
                cta: 'Contact Sales',
                highlighted: false,
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-blue-600/10 to-purple-600/10 border-blue-600/50 scale-105 shadow-2xl shadow-blue-600/20'
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-400" />
                )}
                <CardContent className="p-8">
                  {plan.highlighted && (
                    <Badge className="mb-4 bg-blue-600/20 text-blue-400 border-blue-600/30">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-400">{plan.period}</span>
                  </div>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>
                  
                  <Button
                    className={`w-full mb-6 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-zinc-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-zinc-400">
              All plans include 99.9% uptime SLA and SSL encryption.{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Compare plans </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-pink-600/10 text-pink-400 border-pink-600/20">
              <Users className="h-3 w-3 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              See how LEXICASE is transforming legal workflows across firms of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mitchell',
                role: 'Partner, Mitchell & Associates',
                avatar: 'https://i.pravatar.cc/150?img=10',
                content:
                  'LEXICASE has completely transformed how we manage cases. The AI-powered analysis saves us hours every day, and the task management is better than Jira for legal work.',
                rating: 5,
              },
              {
                name: 'David Chen',
                role: 'Legal Counsel, TechCorp',
                avatar: 'https://i.pravatar.cc/150?img=13',
                content:
                  'The web search agent is a game-changer. What used to take 6 hours of research now takes 5 minutes. The accuracy is incredible, and the workflow automation is seamless.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Senior Associate, Global Law Firm',
                avatar: 'https://i.pravatar.cc/150?img=20',
                content:
                  'We deployed LEXICASE across 200+ attorneys. The adoption rate was 98% within the first month. The productivity gains have been measurable and significant.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-zinc-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="mb-6 px-4 py-2 bg-green-600/10 text-green-400 border-green-600/20">
            <Rocket className="h-3 w-3 mr-2" />
            Ready to Transform Your Legal Workflow?
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Start Building with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LEXICASE
            </span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of legal professionals who are saving 97% of their time with AI-powered workflows.
            Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <a href="#pricing">
              <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 text-lg px-8 py-6">
                Schedule Demo
                <Calendar className="h-5 w-5 ml-2" />
              </Button>
            </a>
          </div>
          <p className="text-sm text-zinc-500 mt-8">
            14-day free trial  No credit card required  Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="LexiCase Logo" className="h-10 w-10" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LexiCase
                </span>
              </div>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                AI-powered legal workflow automation platform designed for modern legal professionals.
                Built by Team Nirvana.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-900">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-900">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Technology', 'Integrations', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Security', 'Compliance', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
               2025 LEXICASE by Team Nirvana. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Status</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}