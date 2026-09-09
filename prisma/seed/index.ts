/**
 * Database Seed Script
 * =============================================================================
 * Populates the database with realistic sample data for development.
 * Uses real company names and realistic job postings.
 * 
 * Usage: npx prisma db seed
 */

import { 
  PrismaClient, 
  Prisma,
  JobSource,
  LocationType,
  EmploymentType,
  ExperienceLevel,
  SalaryPeriod,
} from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// SEED DATA
// =============================================================================

const companies: Prisma.CompanyCreateInput[] = [
  {
    name: 'Stripe',
    slug: 'stripe',
    logo: 'https://logo.clearbit.com/stripe.com',
    description: 'Financial infrastructure for the internet. Millions of companies use Stripe to accept payments, send payouts, and manage their businesses online.',
    website: 'https://stripe.com',
    careerPageUrl: 'https://stripe.com/jobs',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2010,
    headquarters: 'San Francisco, CA',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Figma',
    slug: 'figma',
    logo: 'https://logo.clearbit.com/figma.com',
    description: 'Figma is a collaborative interface design tool that helps teams create, test, and ship better designs from start to finish.',
    website: 'https://figma.com',
    careerPageUrl: 'https://www.figma.com/careers',
    industry: 'Design Software',
    size: 'SIZE_501_1000',
    foundedYear: 2012,
    headquarters: 'San Francisco, CA',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Vercel',
    slug: 'vercel',
    logo: 'https://logo.clearbit.com/vercel.com',
    description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
    website: 'https://vercel.com',
    careerPageUrl: 'https://vercel.com/careers',
    industry: 'Developer Tools',
    size: 'SIZE_201_500',
    foundedYear: 2015,
    headquarters: 'San Francisco, CA',
    atsType: 'LEVER',
  },
  {
    name: 'Linear',
    slug: 'linear',
    logo: 'https://logo.clearbit.com/linear.app',
    description: 'Linear is the issue tracking tool that streamlines software projects, sprints, tasks, and bug tracking.',
    website: 'https://linear.app',
    careerPageUrl: 'https://linear.app/careers',
    industry: 'Developer Tools',
    size: 'SIZE_51_200',
    foundedYear: 2019,
    headquarters: 'San Francisco, CA',
    atsType: 'ASHBY',
  },
  {
    name: 'Notion',
    slug: 'notion',
    logo: 'https://logo.clearbit.com/notion.so',
    description: 'Notion is the all-in-one workspace for notes, docs, wikis, projects, and collaboration.',
    website: 'https://notion.so',
    careerPageUrl: 'https://notion.so/careers',
    industry: 'Productivity Software',
    size: 'SIZE_501_1000',
    foundedYear: 2013,
    headquarters: 'San Francisco, CA',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Supabase',
    slug: 'supabase',
    logo: 'https://logo.clearbit.com/supabase.com',
    description: 'Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, and realtime subscriptions.',
    website: 'https://supabase.com',
    careerPageUrl: 'https://supabase.com/careers',
    industry: 'Developer Tools',
    size: 'SIZE_51_200',
    foundedYear: 2020,
    headquarters: 'Singapore',
    atsType: 'ASHBY',
  },
  {
    name: 'Shopify',
    slug: 'shopify',
    logo: 'https://logo.clearbit.com/shopify.com',
    description: 'Shopify is a complete commerce platform that lets you start, grow, and manage a business.',
    website: 'https://shopify.com',
    careerPageUrl: 'https://www.shopify.com/careers',
    industry: 'E-Commerce',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2006,
    headquarters: 'Ottawa, Canada',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Datadog',
    slug: 'datadog',
    logo: 'https://logo.clearbit.com/datadoghq.com',
    description: 'Datadog is the monitoring and security platform for cloud applications.',
    website: 'https://datadoghq.com',
    careerPageUrl: 'https://www.datadoghq.com/careers',
    industry: 'Cloud Infrastructure',
    size: 'SIZE_1001_5000',
    foundedYear: 2010,
    headquarters: 'New York, NY',
    atsType: 'GREENHOUSE',
  },
];

// Job templates with realistic data
const jobTemplates = [
  // Engineering roles
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    salaryMin: 180000,
    salaryMax: 250000,
  },
  {
    title: 'Staff Engineer, Platform',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'STAFF',
    skills: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'System Design'],
    salaryMin: 250000,
    salaryMax: 350000,
  },
  {
    title: 'Frontend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'GraphQL'],
    salaryMin: 140000,
    salaryMax: 190000,
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    salaryMin: 150000,
    salaryMax: 200000,
  },
  {
    title: 'Full Stack Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'GraphQL'],
    salaryMin: 145000,
    salaryMax: 195000,
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Python'],
    salaryMin: 170000,
    salaryMax: 230000,
  },
  {
    title: 'Machine Learning Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'SQL'],
    salaryMin: 200000,
    salaryMax: 280000,
  },
  {
    title: 'Engineering Manager',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Leadership', 'Agile', 'Technical Strategy', 'Hiring'],
    salaryMin: 220000,
    salaryMax: 300000,
  },
  {
    title: 'Software Engineer, New Grad',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    skills: ['JavaScript', 'Python', 'Data Structures', 'Algorithms'],
    salaryMin: 120000,
    salaryMax: 160000,
  },
  {
    title: 'Software Engineering Intern',
    department: 'Engineering',
    employmentType: 'INTERNSHIP',
    experienceLevel: 'ENTRY',
    skills: ['JavaScript', 'Python', 'Git', 'Problem Solving'],
    salaryMin: 8000,
    salaryMax: 12000,
  },
  // Product & Design
  {
    title: 'Product Manager',
    department: 'Product',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Product Strategy', 'Analytics', 'SQL', 'User Research'],
    salaryMin: 150000,
    salaryMax: 210000,
  },
  {
    title: 'Senior Product Designer',
    department: 'Design',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    salaryMin: 160000,
    salaryMax: 220000,
  },
  {
    title: 'UX Researcher',
    department: 'Design',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['User Research', 'Usability Testing', 'Data Analysis', 'Survey Design'],
    salaryMin: 130000,
    salaryMax: 175000,
  },
  // Data
  {
    title: 'Data Engineer',
    department: 'Data',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Python', 'SQL', 'Spark', 'Airflow', 'dbt'],
    salaryMin: 160000,
    salaryMax: 220000,
  },
  {
    title: 'Data Scientist',
    department: 'Data',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'A/B Testing'],
    salaryMin: 180000,
    salaryMax: 250000,
  },
];

const locations = [
  { location: 'San Francisco, CA', locationType: 'HYBRID', isRemote: false },
  { location: 'New York, NY', locationType: 'HYBRID', isRemote: false },
  { location: 'Remote (US)', locationType: 'REMOTE', isRemote: true },
  { location: 'Remote (Worldwide)', locationType: 'REMOTE', isRemote: true },
  { location: 'Seattle, WA', locationType: 'HYBRID', isRemote: false },
  { location: 'Austin, TX', locationType: 'ONSITE', isRemote: false },
  { location: 'London, UK', locationType: 'HYBRID', isRemote: false },
  { location: 'Remote (EU)', locationType: 'REMOTE', isRemote: true },
];

const descriptions = {
  engineering: `## About the Role

We're looking for a talented engineer to join our team and help build the future of our platform. You'll work on challenging problems, collaborate with a world-class team, and have a direct impact on millions of users.

## What You'll Do

- Design, build, and maintain scalable systems that power our core product
- Collaborate with product managers, designers, and other engineers to deliver impactful features
- Mentor junior engineers and contribute to our engineering culture
- Participate in code reviews and help maintain high code quality standards
- Contribute to architectural decisions and technical strategy

## What We're Looking For

- Strong programming skills and computer science fundamentals
- Experience building and operating production systems
- Excellent problem-solving and communication skills
- A track record of shipping high-quality software
- Passion for building great products

## Benefits

- Competitive salary and equity
- Comprehensive health, dental, and vision insurance
- Flexible PTO and work arrangements
- Learning and development budget
- Home office setup allowance
- Regular team offsites and events`,

  product: `## About the Role

We're seeking a Product Manager to help define and execute our product strategy. You'll work closely with engineering, design, and business teams to build products that delight our customers.

## What You'll Do

- Define product vision and strategy for your area
- Gather and analyze customer feedback and market research
- Work with engineering and design to deliver great products
- Define and track key metrics for product success
- Communicate product updates to stakeholders

## What We're Looking For

- Experience in product management at a technology company
- Strong analytical and problem-solving skills
- Excellent written and verbal communication
- Ability to work cross-functionally
- Technical background preferred`,

  design: `## About the Role

We're looking for a designer to help create beautiful, intuitive experiences for our users. You'll work on end-to-end design challenges, from research to final implementation.

## What You'll Do

- Lead design projects from concept to launch
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Collaborate with engineers to ensure design quality
- Contribute to and maintain our design system

## What We're Looking For

- Portfolio demonstrating strong design skills
- Experience with modern design tools (Figma, etc.)
- Understanding of interaction design and usability principles
- Ability to take feedback and iterate quickly
- Strong communication skills`,
};

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

function generateExternalId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDaysAgo(maxDays: number): Date {
  const daysAgo = Math.floor(Math.random() * maxDays);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function getDescription(department: string): string {
  if (department === 'Product') return descriptions.product;
  if (department === 'Design') return descriptions.design;
  return descriptions.engineering;
}

async function seedCompanies(): Promise<Map<string, string>> {
  console.log('Seeding companies...');
  const companyIds = new Map<string, string>();

  for (const company of companies) {
    const created = await prisma.company.upsert({
      where: { slug: company.slug },
      update: {},
      create: company,
    });
    companyIds.set(company.slug, created.id);
    console.log(`  ✓ ${company.name}`);
  }

  return companyIds;
}

async function seedJobs(companyIds: Map<string, string>): Promise<void> {
  console.log('Seeding jobs...');
  let jobCount = 0;

  for (const [slug, companyId] of companyIds) {
    // Each company gets 3-8 random jobs
    const numJobs = 3 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numJobs; i++) {
      const template = randomItem(jobTemplates);
      const loc = randomItem(locations);

      const job: Prisma.JobCreateInput = {
        externalId: generateExternalId(),
        source: randomItem([JobSource.GREENHOUSE, JobSource.LEVER, JobSource.ASHBY]),
        title: template.title,
        description: getDescription(template.department),
        requirements: [
          `${template.skills[0]} experience required`,
          'Strong problem-solving skills',
          'Excellent communication skills',
          'Ability to work in a fast-paced environment',
        ],
        location: loc.location,
        isRemote: loc.isRemote,
        locationType: loc.locationType as LocationType,
        employmentType: template.employmentType as EmploymentType,
        experienceLevel: template.experienceLevel as ExperienceLevel,
        department: template.department,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        salaryCurrency: 'USD',
        salaryPeriod: template.employmentType === 'FULL_TIME' ? SalaryPeriod.YEARLY : 
                      template.employmentType === 'INTERNSHIP' ? SalaryPeriod.MONTHLY : SalaryPeriod.YEARLY,
        skills: template.skills,
        postedAt: randomDaysAgo(30),
        sourceUrl: `https://example.com/jobs/${slug}/${generateExternalId()}`,
        company: { connect: { id: companyId } },
      };

      await prisma.job.create({ data: job });
      jobCount++;
    }
  }

  console.log(`  ✓ Created ${jobCount} jobs`);
}

async function seedSkills(): Promise<void> {
  console.log('Seeding skills...');

  const skills = [
    { name: 'TypeScript', slug: 'typescript', category: 'Programming Language' },
    { name: 'JavaScript', slug: 'javascript', category: 'Programming Language' },
    { name: 'Python', slug: 'python', category: 'Programming Language' },
    { name: 'Go', slug: 'go', category: 'Programming Language' },
    { name: 'Rust', slug: 'rust', category: 'Programming Language' },
    { name: 'Java', slug: 'java', category: 'Programming Language' },
    { name: 'React', slug: 'react', category: 'Framework' },
    { name: 'Next.js', slug: 'nextjs', category: 'Framework' },
    { name: 'Node.js', slug: 'nodejs', category: 'Runtime' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
    { name: 'MongoDB', slug: 'mongodb', category: 'Database' },
    { name: 'Redis', slug: 'redis', category: 'Database' },
    { name: 'AWS', slug: 'aws', category: 'Cloud' },
    { name: 'GCP', slug: 'gcp', category: 'Cloud' },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'Infrastructure' },
    { name: 'Docker', slug: 'docker', category: 'Infrastructure' },
    { name: 'Terraform', slug: 'terraform', category: 'Infrastructure' },
    { name: 'GraphQL', slug: 'graphql', category: 'API' },
    { name: 'REST', slug: 'rest', category: 'API' },
    { name: 'Figma', slug: 'figma', category: 'Design Tool' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: {
        ...skill,
        aliases: [],
      },
    });
  }

  console.log(`  ✓ Created ${skills.length} skills`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (optional - comment out to preserve data)
    console.log('Clearing existing data...');
    await prisma.job.deleteMany();
    await prisma.scrape.deleteMany();
    await prisma.company.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.savedSearch.deleteMany();
    console.log('  ✓ Cleared\n');

    // Seed data
    const companyIds = await seedCompanies();
    console.log('');
    await seedJobs(companyIds);
    console.log('');
    await seedSkills();

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
