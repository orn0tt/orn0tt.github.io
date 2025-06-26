"use client"

import { useState, useEffect } from "react"
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Code2,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
} from "lucide-react"

// ===== CONFIGURAÇÕES =====
const CONFIG = {
  githubUsername: "orn0tt", // ← MUDE AQUI!
  email: "gabrielbraunclementedev@gmail.com",
  linkedin: "https://linkedin.com/in/gabriel-braun-clemente",
  location: "Petrópolis, RJ",
}

// ===== DADOS ESTÁTICOS =====
const TECH_CATEGORIES = [
  {
    title: "Backend",
    gradient: "from-emerald-500 to-teal-500",
    accent: "emerald",
    technologies: ["Java", "Spring Boot", "Spring Security", "Spring Data JPA", "Maven", "Hibernate"],
  },
  {
    title: "Frontend",
    gradient: "from-blue-500 to-cyan-500",
    accent: "blue",
    technologies: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Banco de Dados",
    gradient: "from-purple-500 to-pink-500",
    accent: "purple",
    technologies: ["PostgreSQL", "MySQL", "MongoDB", "H2 Database"],
  },
  {
    title: "Ferramentas & DevOps",
    gradient: "from-orange-500 to-red-500",
    accent: "orange",
    technologies: ["Git", "Docker", "Linux", "IntelliJ IDEA", "VS Code", "Postman"],
  },
]

const SPECIALTIES = [
  { name: "Java Spring Boot", gradient: "from-green-500 to-emerald-500", icon: "☕" },
  { name: "React", gradient: "from-blue-500 to-cyan-500", icon: "⚛️" },
  { name: "PostgreSQL", gradient: "from-blue-600 to-indigo-600", icon: "🐘" },
  { name: "REST APIs", gradient: "from-purple-500 to-pink-500", icon: "🔗" },
]

// ===== UTILITÁRIOS =====
const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer")
const openEmail = () => (window.location.href = `mailto:${CONFIG.email}`)

const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    HTML: "#e34c26",
    CSS: "#1572B6",
    React: "#61dafb",
    Vue: "#4FC08D",
    PHP: "#4F5D95",
    Go: "#00ADD8",
  }
  return colors[language] || "#6b7280"
}

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("pt-BR")
  } catch {
    return "Data inválida"
  }
}

// ===== API GITHUB =====
const fetchGitHubData = async (username) => {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-App",
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`, { headers }),
    ])

    const user = userRes.ok ? await userRes.json() : null
    const allRepos = reposRes.ok ? await reposRes.json() : []

    const repos = allRepos.filter(
      (repo) => !repo.fork && repo.description && repo.description.length > 5 && !repo.archived,
    )

    return { user, repos }
  } catch (error) {
    console.error("Erro ao buscar dados do GitHub:", error)
    return { user: null, repos: [] }
  }
}

// ===== COMPONENTES =====
const Button = ({ variant = "default", size = "md", className = "", children, onClick, ...props }) => {
  const baseClass =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 hover:scale-105"
  const variants = {
    default:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg",
    outline: "border border-white/20 text-slate-200 hover:bg-white/10 bg-transparent backdrop-blur-sm",
  }
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

const Card = ({ className = "", children }) => (
  <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ${className}`}>{children}</div>
)

const LoadingCard = () => (
  <Card className="p-6">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-700 rounded-lg" />
        <div className="h-5 bg-slate-700 rounded w-32" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-700 rounded w-3/4" />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="h-4 bg-slate-700 rounded w-16" />
          <div className="h-4 bg-slate-700 rounded w-8" />
        </div>
        <div className="h-4 bg-slate-700 rounded w-20" />
      </div>
    </div>
  </Card>
)

const GitHubStats = ({ user }) => {
  if (!user) return null

  const stats = [
    { value: user.public_repos, label: "Repositórios", gradient: "from-indigo-400 to-purple-400" },
    { value: user.followers, label: "Seguidores", gradient: "from-purple-400 to-pink-400" },
    { value: user.following, label: "Seguindo", gradient: "from-emerald-400 to-teal-400" },
  ]

  return (
    <div className="flex justify-center gap-8 mb-12">
      {stats.map((stat, i) => (
        <div key={i} className="text-center group">
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

const GitHubProjects = ({ repos }) => {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
          <Github className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-200">Nenhum repositório encontrado</h3>
        <p className="text-slate-400">Verifique se o username do GitHub está correto</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {repos.map((repo) => (
        <Card key={repo.id} className="p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Github className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                {repo.name}
              </h3>
            </div>
            <button
              onClick={() => openLink(repo.html_url)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-white/10 rounded-lg"
              aria-label={`Ver repositório ${repo.name}`}
            >
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-indigo-300" />
            </button>
          </div>

          <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {repo.description || "Sem descrição disponível"}
          </p>

          {repo.topics?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="text-xs border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors rounded-full px-2.5 py-0.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-4">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                  <span className="text-slate-300 text-xs">{repo.language}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-300 text-xs">{repo.stargazers_count}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300 text-xs">{repo.forks_count}</span>
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDate(repo.updated_at)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ===== COMPONENTE PRINCIPAL =====
const App = () => {
  const [githubData, setGithubData] = useState({ user: null, repos: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadGitHubData = async () => {
      setLoading(true)
      setError(null)

      const data = await fetchGitHubData(CONFIG.githubUsername)

      if (!data.user && data.repos.length === 0) {
        setError("Erro ao carregar dados do GitHub")
      }

      setGithubData(data)
      setLoading(false)
    }

    loadGitHubData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <div className="inline-block relative">
            <div className="w-36 h-36 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold mb-8 shadow-2xl shadow-indigo-500/25 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full blur opacity-75 animate-pulse" />
              <span className="relative z-10">GB</span>
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Gabriel Braun
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light">
              Desenvolvedor FullStack em formação
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{CONFIG.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button size="lg" onClick={() => openLink(`https://github.com/${CONFIG.githubUsername}`)}>
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
            <Button size="lg" variant="outline" onClick={() => openLink(CONFIG.linkedin)}>
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>
            <Button size="lg" variant="outline" onClick={openEmail}>
              <Mail className="w-5 h-5 mr-2" />
              Contato
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Briefcase,
              title: "Objetivo",
              gradient: "from-indigo-500 to-purple-500",
              text: "Busco oportunidades como desenvolvedor júnior ou estagiário para aplicar conhecimentos e crescer profissionalmente",
            },
            {
              icon: GraduationCap,
              title: "Formação",
              gradient: "from-purple-500 to-pink-500",
              text: "Análise e Desenvolvimento de Sistemas (Descomplica) + Tecnólogo FullStack (SENAI)",
            },
            {
              icon: Code2,
              title: "Foco",
              gradient: "from-emerald-500 to-teal-500",
              text: "Desenvolvimento de APIs robustas com Java Spring Boot e interfaces modernas com React",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="p-8 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            >
              <div
                className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">{item.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Stack Tecnológico
          </h2>
          <p className="text-slate-300 text-lg">Tecnologias que domino e utilizo em meus projetos</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TECH_CATEGORIES.map((category, i) => (
            <Card key={i} className="p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100">{category.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {category.technologies.map((tech, j) => (
                  <div
                    key={j}
                    className={`bg-${category.accent}-500/10 border border-${category.accent}-500/30 text-${category.accent}-300 hover:bg-${category.accent}-500/20 backdrop-blur-sm rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center text-center`}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-slate-200">Principais Especializações</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {SPECIALTIES.map((specialty, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${specialty.gradient} px-6 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3`}
              >
                <span className="text-xl">{specialty.icon}</span>
                <span>{specialty.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Projects Section */}
      <section className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Projetos no GitHub
          </h2>
          <p className="text-slate-300 mb-12 text-lg">Meus projetos e contribuições mais recentes</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
              <p className="text-red-400 mb-2">{error}</p>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse text-center">
                  <div className="w-16 h-8 bg-slate-700 rounded mb-2 mx-auto" />
                  <div className="w-20 h-4 bg-slate-700 rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <GitHubStats user={githubData.user} />
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <GitHubProjects repos={githubData.repos} />
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => openLink(`https://github.com/${CONFIG.githubUsername}?tab=repositories`)}
          >
            <Github className="w-4 h-4 mr-2" />
            Ver todos os projetos
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative max-w-4xl mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-white/20 shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Vamos conversar?
          </h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Estou sempre aberto a novas oportunidades e colaborações. Entre em contato para discutirmos como posso
            contribuir com seu projeto ou equipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" onClick={openEmail}>
              <Mail className="w-5 h-5 mr-2" />
              {CONFIG.email}
            </Button>
            <Button size="lg" variant="outline" onClick={() => openLink(`https://github.com/${CONFIG.githubUsername}`)}>
              <Github className="w-5 h-5 mr-2" />
              Acessar GitHub
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>&copy; 2024 Gabriel Braun Clemente</p>
        </div>
      </footer>
    </div>
  )
}

export default App
