/**
 * Skill Extractor
 * =============================================================================
 * Extract technology skills from job descriptions.
 */

// Comprehensive skill list organized by category
const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Golang', 'Rust',
    'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Elixir',
    'Haskell', 'Clojure', 'R', 'Julia', 'Perl', 'Lua', 'Dart', 'Objective-C',
  ],
  frontend: [
    'React', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt',
    'Gatsby', 'Remix', 'HTML', 'CSS', 'SCSS', 'SASS', 'Less', 'Tailwind',
    'Bootstrap', 'Material UI', 'Chakra UI', 'Styled Components', 'Emotion',
    'Redux', 'MobX', 'Zustand', 'Recoil', 'Webpack', 'Vite', 'Rollup',
  ],
  backend: [
    'Node.js', 'Express', 'Fastify', 'NestJS', 'Koa', 'Hapi',
    'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot',
    'Rails', 'Ruby on Rails', 'Laravel', 'Symfony', 'ASP.NET',
    'Gin', 'Echo', 'Fiber', 'Phoenix', 'Actix',
  ],
  databases: [
    'PostgreSQL', 'Postgres', 'MySQL', 'MariaDB', 'SQLite', 'Oracle',
    'SQL Server', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra',
    'DynamoDB', 'CouchDB', 'Neo4j', 'InfluxDB', 'TimescaleDB',
    'Prisma', 'Drizzle', 'TypeORM', 'Sequelize', 'Mongoose',
  ],
  cloud: [
    'AWS', 'Amazon Web Services', 'GCP', 'Google Cloud', 'Azure',
    'Heroku', 'Vercel', 'Netlify', 'Cloudflare', 'DigitalOcean',
    'EC2', 'S3', 'Lambda', 'ECS', 'EKS', 'RDS', 'CloudFront',
    'Cloud Functions', 'Cloud Run', 'BigQuery', 'Pub/Sub',
  ],
  devops: [
    'Docker', 'Kubernetes', 'K8s', 'Terraform', 'Ansible', 'Puppet',
    'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI',
    'ArgoCD', 'Helm', 'Prometheus', 'Grafana', 'Datadog', 'New Relic',
    'ELK', 'Logstash', 'Kibana', 'Splunk', 'PagerDuty',
  ],
  data: [
    'SQL', 'NoSQL', 'GraphQL', 'REST', 'gRPC', 'Apache Kafka', 'Kafka',
    'RabbitMQ', 'Apache Spark', 'Spark', 'Hadoop', 'Airflow',
    'dbt', 'Snowflake', 'Redshift', 'Databricks', 'Fivetran',
    'Tableau', 'Looker', 'Power BI', 'Metabase', 'Superset',
  ],
  ml: [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Keras', 'scikit-learn', 'sklearn', 'Pandas', 'NumPy',
    'OpenAI', 'GPT', 'LLM', 'NLP', 'Computer Vision', 'MLOps',
    'Hugging Face', 'BERT', 'Transformers', 'RAG', 'LangChain',
  ],
  mobile: [
    'React Native', 'Flutter', 'iOS', 'Android', 'SwiftUI',
    'Jetpack Compose', 'Expo', 'Capacitor', 'Ionic', 'Xamarin',
  ],
  testing: [
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Selenium',
    'Puppeteer', 'Testing Library', 'Vitest', 'pytest', 'JUnit',
    'RSpec', 'PHPUnit', 'TDD', 'BDD', 'E2E Testing', 'Unit Testing',
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Linear',
    'Figma', 'Sketch', 'VS Code', 'IntelliJ', 'Vim', 'Neovim',
    'Postman', 'Insomnia', 'Swagger', 'OpenAPI', 'Notion', 'Confluence',
  ],
};

// Build a lookup map for faster matching
const SKILL_LOOKUP = new Map<string, string>();
for (const skills of Object.values(SKILLS_BY_CATEGORY)) {
  for (const skill of skills) {
    SKILL_LOOKUP.set(skill.toLowerCase(), skill);
  }
}

// Additional aliases for common variations
const SKILL_ALIASES: Record<string, string> = {
  'js': 'JavaScript',
  'ts': 'TypeScript',
  'py': 'Python',
  'rb': 'Ruby',
  'node': 'Node.js',
  'react.js': 'React',
  'reactjs': 'React',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular.js': 'Angular',
  'angularjs': 'Angular',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'nuxt.js': 'Nuxt',
  'nuxtjs': 'Nuxt',
  'postgres': 'PostgreSQL',
  'mongo': 'MongoDB',
  'k8s': 'Kubernetes',
  'gcp': 'GCP',
  'amazon web services': 'AWS',
  'google cloud platform': 'GCP',
  'microsoft azure': 'Azure',
  'ruby on rails': 'Rails',
  'ror': 'Rails',
  'spring boot': 'Spring Boot',
  'scikit-learn': 'scikit-learn',
  'sci-kit learn': 'scikit-learn',
};

// Add aliases to lookup
for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
  SKILL_LOOKUP.set(alias.toLowerCase(), canonical);
}

/**
 * Extract skills from text
 */
export function extractSkills(text: string): string[] {
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  // Direct matching
  for (const [lowerSkill, canonicalSkill] of SKILL_LOOKUP.entries()) {
    // Use word boundaries to avoid partial matches
    const pattern = new RegExp(`\\b${escapeRegex(lowerSkill)}\\b`, 'i');
    if (pattern.test(lowerText)) {
      foundSkills.add(canonicalSkill);
    }
  }

  // Sort by category importance and return
  return Array.from(foundSkills).sort((a, b) => {
    const aIndex = getSkillPriority(a);
    const bIndex = getSkillPriority(b);
    return aIndex - bIndex;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSkillPriority(skill: string): number {
  const priorities = ['languages', 'frontend', 'backend', 'databases', 'cloud', 'devops', 'data', 'ml', 'mobile', 'testing', 'tools'];
  
  for (let i = 0; i < priorities.length; i++) {
    const category = priorities[i];
    if (SKILLS_BY_CATEGORY[category]?.some(s => s === skill)) {
      return i;
    }
  }
  return 999;
}

/**
 * Get skill category
 */
export function getSkillCategory(skill: string): string | null {
  for (const [category, skills] of Object.entries(SKILLS_BY_CATEGORY)) {
    if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return category;
    }
  }
  return null;
}

/**
 * Get all available skills
 */
export function getAllSkills(): string[] {
  return Array.from(new Set(Object.values(SKILLS_BY_CATEGORY).flat()));
}
