/**
 * Database Seed Script
 * =============================================================================
 * Populates the database with realistic sample data for development.
 * India-focused with proper ATS career page URLs.
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
// URL GENERATORS - Real ATS career page URL patterns
// =============================================================================

function generateSourceUrl(
  atsType: JobSource,
  companySlug: string,
  jobId: string
): string {
  switch (atsType) {
    case 'GREENHOUSE':
      // Real pattern: https://boards.greenhouse.io/{company}/jobs/{jobId}
      return `https://boards.greenhouse.io/${companySlug}/jobs/${jobId}`;
    case 'LEVER':
      // Real pattern: https://jobs.lever.co/{company}/{jobId}
      return `https://jobs.lever.co/${companySlug}/${jobId}`;
    case 'ASHBY':
      // Real pattern: https://jobs.ashbyhq.com/{company}/{jobId}
      return `https://jobs.ashbyhq.com/${companySlug}/${jobId}`;
    case 'WORKABLE':
      // Real pattern: https://apply.workable.com/{company}/j/{jobId}
      return `https://apply.workable.com/${companySlug}/j/${jobId}`;
    case 'SMARTRECRUITERS':
      // Real pattern: https://jobs.smartrecruiters.com/{company}/{jobId}
      return `https://jobs.smartrecruiters.com/${companySlug}/${jobId}`;
    default:
      return `https://careers.${companySlug}.com/jobs/${jobId}`;
  }
}

function generateCareerPageUrl(atsType: JobSource, companySlug: string): string {
  switch (atsType) {
    case 'GREENHOUSE':
      return `https://boards.greenhouse.io/${companySlug}`;
    case 'LEVER':
      return `https://jobs.lever.co/${companySlug}`;
    case 'ASHBY':
      return `https://jobs.ashbyhq.com/${companySlug}`;
    default:
      return `https://careers.${companySlug}.com`;
  }
}

// =============================================================================
// SEED DATA - INDIAN COMPANIES (20 companies across 3 ATS platforms)
// =============================================================================

const companies: Prisma.CompanyCreateInput[] = [
  // FINTECH - Greenhouse
  {
    name: 'Razorpay',
    slug: 'razorpay',
    logo: 'https://logo.clearbit.com/razorpay.com',
    description: 'Razorpay is India\'s leading full-stack financial solutions company, powering payments for over 8 million businesses.',
    website: 'https://razorpay.com',
    careerPageUrl: 'https://boards.greenhouse.io/razorpay',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'PhonePe',
    slug: 'phonepe',
    logo: 'https://logo.clearbit.com/phonepe.com',
    description: 'PhonePe is India\'s largest digital payments platform with over 500 million registered users.',
    website: 'https://phonepe.com',
    careerPageUrl: 'https://boards.greenhouse.io/phonepe',
    industry: 'Financial Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'CRED',
    slug: 'cred',
    logo: 'https://logo.clearbit.com/cred.club',
    description: 'CRED is a members-only credit card bill payment platform that rewards users for responsible credit behavior.',
    website: 'https://cred.club',
    careerPageUrl: 'https://jobs.lever.co/cred',
    industry: 'Financial Technology',
    size: 'SIZE_501_1000',
    foundedYear: 2018,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'Groww',
    slug: 'groww',
    logo: 'https://logo.clearbit.com/groww.in',
    description: 'Groww is India\'s leading investment platform with 50 million+ users investing in stocks, mutual funds, and more.',
    website: 'https://groww.in',
    careerPageUrl: 'https://jobs.lever.co/groww',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2016,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  // E-COMMERCE - Mixed ATS
  {
    name: 'Flipkart',
    slug: 'flipkart',
    logo: 'https://logo.clearbit.com/flipkart.com',
    description: 'Flipkart is India\'s leading e-commerce marketplace with over 450 million registered users.',
    website: 'https://flipkart.com',
    careerPageUrl: 'https://boards.greenhouse.io/flipkart',
    industry: 'E-Commerce',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2007,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Meesho',
    slug: 'meesho',
    logo: 'https://logo.clearbit.com/meesho.com',
    description: 'Meesho is India\'s fastest-growing social commerce platform, enabling small businesses to sell online.',
    website: 'https://meesho.com',
    careerPageUrl: 'https://jobs.lever.co/meesho',
    industry: 'E-Commerce',
    size: 'SIZE_1001_5000',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'Myntra',
    slug: 'myntra',
    logo: 'https://logo.clearbit.com/myntra.com',
    description: 'Myntra is India\'s largest fashion e-commerce platform with 50 million+ monthly active users.',
    website: 'https://myntra.com',
    careerPageUrl: 'https://boards.greenhouse.io/myntra',
    industry: 'E-Commerce',
    size: 'SIZE_1001_5000',
    foundedYear: 2007,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  // FOOD & DELIVERY - Lever
  {
    name: 'Swiggy',
    slug: 'swiggy',
    logo: 'https://logo.clearbit.com/swiggy.com',
    description: 'Swiggy is India\'s largest food delivery platform, also offering grocery and quick commerce through Instamart.',
    website: 'https://swiggy.com',
    careerPageUrl: 'https://jobs.lever.co/swiggy',
    industry: 'Food Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'Zomato',
    slug: 'zomato',
    logo: 'https://logo.clearbit.com/zomato.com',
    description: 'Zomato is a technology platform connecting customers, restaurant partners, and delivery partners.',
    website: 'https://zomato.com',
    careerPageUrl: 'https://jobs.lever.co/zomato',
    industry: 'Food Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2008,
    headquarters: 'Gurugram, India',
    atsType: 'LEVER',
  },
  {
    name: 'Zepto',
    slug: 'zepto',
    logo: 'https://logo.clearbit.com/zeptonow.com',
    description: 'Zepto delivers groceries in 10 minutes. India\'s fastest-growing quick commerce startup.',
    website: 'https://zeptonow.com',
    careerPageUrl: 'https://boards.greenhouse.io/zepto',
    industry: 'Quick Commerce',
    size: 'SIZE_1001_5000',
    foundedYear: 2021,
    headquarters: 'Mumbai, India',
    atsType: 'GREENHOUSE',
  },
  // SAAS & B2B - Mixed
  {
    name: 'Freshworks',
    slug: 'freshworks',
    logo: 'https://logo.clearbit.com/freshworks.com',
    description: 'Freshworks provides modern SaaS products that are easy to use and quick to implement.',
    website: 'https://freshworks.com',
    careerPageUrl: 'https://boards.greenhouse.io/freshworks',
    industry: 'SaaS',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2010,
    headquarters: 'Chennai, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Postman',
    slug: 'postman',
    logo: 'https://logo.clearbit.com/postman.com',
    description: 'Postman is an API platform for building and using APIs, used by 25 million developers worldwide.',
    website: 'https://postman.com',
    careerPageUrl: 'https://jobs.ashbyhq.com/postman',
    industry: 'Developer Tools',
    size: 'SIZE_501_1000',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'ASHBY',
  },
  {
    name: 'Hasura',
    slug: 'hasura',
    logo: 'https://logo.clearbit.com/hasura.io',
    description: 'Hasura provides instant GraphQL APIs on new or existing data sources for modern applications.',
    website: 'https://hasura.io',
    careerPageUrl: 'https://jobs.ashbyhq.com/hasura',
    industry: 'Developer Tools',
    size: 'SIZE_201_500',
    foundedYear: 2017,
    headquarters: 'Bangalore, India',
    atsType: 'ASHBY',
  },
  {
    name: 'BrowserStack',
    slug: 'browserstack',
    logo: 'https://logo.clearbit.com/browserstack.com',
    description: 'BrowserStack is the world\'s leading software testing platform powering over two million tests daily.',
    website: 'https://browserstack.com',
    careerPageUrl: 'https://boards.greenhouse.io/browserstack',
    industry: 'Developer Tools',
    size: 'SIZE_501_1000',
    foundedYear: 2011,
    headquarters: 'Mumbai, India',
    atsType: 'GREENHOUSE',
  },
  // EDTECH
  {
    name: 'Unacademy',
    slug: 'unacademy',
    logo: 'https://logo.clearbit.com/unacademy.com',
    description: 'Unacademy is India\'s largest learning platform with 60 million+ learners preparing for various exams.',
    website: 'https://unacademy.com',
    careerPageUrl: 'https://jobs.lever.co/unacademy',
    industry: 'EdTech',
    size: 'SIZE_1001_5000',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'upGrad',
    slug: 'upgrad',
    logo: 'https://logo.clearbit.com/upgrad.com',
    description: 'upGrad is South Asia\'s largest online higher education company focused on working professionals.',
    website: 'https://upgrad.com',
    careerPageUrl: 'https://jobs.lever.co/upgrad',
    industry: 'EdTech',
    size: 'SIZE_1001_5000',
    foundedYear: 2015,
    headquarters: 'Mumbai, India',
    atsType: 'LEVER',
  },
  // TRAVEL & HOSPITALITY
  {
    name: 'MakeMyTrip',
    slug: 'makemytrip',
    logo: 'https://logo.clearbit.com/makemytrip.com',
    description: 'MakeMyTrip is India\'s leading travel company for booking flights, hotels, and holiday packages.',
    website: 'https://makemytrip.com',
    careerPageUrl: 'https://jobs.ashbyhq.com/makemytrip',
    industry: 'Travel',
    size: 'SIZE_1001_5000',
    foundedYear: 2000,
    headquarters: 'Gurugram, India',
    atsType: 'ASHBY',
  },
  {
    name: 'OYO',
    slug: 'oyo',
    logo: 'https://logo.clearbit.com/oyorooms.com',
    description: 'OYO is a global platform that empowers entrepreneurs and small businesses in the hospitality industry.',
    website: 'https://oyorooms.com',
    careerPageUrl: 'https://jobs.ashbyhq.com/oyo',
    industry: 'Hospitality',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2013,
    headquarters: 'Gurugram, India',
    atsType: 'ASHBY',
  },
  // MOBILITY
  {
    name: 'Ola',
    slug: 'olacabs',
    logo: 'https://logo.clearbit.com/olacabs.com',
    description: 'Ola is India\'s largest mobility platform offering rides across autos, bikes, and cabs.',
    website: 'https://olacabs.com',
    careerPageUrl: 'https://jobs.lever.co/olacabs',
    industry: 'Mobility',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2010,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'Rapido',
    slug: 'rapido',
    logo: 'https://logo.clearbit.com/rapido.bike',
    description: 'Rapido is India\'s largest bike taxi platform, also offering auto rides in 100+ cities.',
    website: 'https://rapido.bike',
    careerPageUrl: 'https://boards.greenhouse.io/rapido',
    industry: 'Mobility',
    size: 'SIZE_501_1000',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
];

// Job templates with realistic Indian salaries (in INR)
const jobTemplates = [
  // Engineering roles
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4500000,  // 45 LPA
  },
  {
    title: 'Staff Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'STAFF',
    skills: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'System Design'],
    salaryMin: 4500000,  // 45 LPA
    salaryMax: 8000000,  // 80 LPA
  },
  {
    title: 'Frontend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'GraphQL'],
    salaryMin: 1200000,  // 12 LPA
    salaryMax: 2200000,  // 22 LPA
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    salaryMin: 1400000,  // 14 LPA
    salaryMax: 2600000,  // 26 LPA
  },
  {
    title: 'SDE-2',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    salaryMin: 1800000,  // 18 LPA
    salaryMax: 3200000,  // 32 LPA
  },
  {
    title: 'SDE-3',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Java', 'Microservices', 'Kubernetes', 'AWS', 'System Design'],
    salaryMin: 3000000,  // 30 LPA
    salaryMax: 5000000,  // 50 LPA
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD'],
    salaryMin: 2000000,  // 20 LPA
    salaryMax: 3800000,  // 38 LPA
  },
  {
    title: 'Site Reliability Engineer',
    department: 'Infrastructure',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Kubernetes', 'Prometheus', 'Go', 'Linux', 'AWS'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4500000,  // 45 LPA
  },
  {
    title: 'Data Engineer',
    department: 'Data',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Python', 'Spark', 'Airflow', 'SQL', 'AWS'],
    salaryMin: 1600000,  // 16 LPA
    salaryMax: 3000000,  // 30 LPA
  },
  {
    title: 'Data Scientist',
    department: 'Data Science',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    salaryMin: 2200000,  // 22 LPA
    salaryMax: 4000000,  // 40 LPA
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'NLP'],
    salaryMin: 2800000,  // 28 LPA
    salaryMax: 5500000,  // 55 LPA
  },
  {
    title: 'Mobile Engineer (Android)',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Kotlin', 'Android', 'Jetpack Compose', 'MVVM', 'REST APIs'],
    salaryMin: 1400000,  // 14 LPA
    salaryMax: 2800000,  // 28 LPA
  },
  {
    title: 'Mobile Engineer (iOS)',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Swift', 'iOS', 'SwiftUI', 'Core Data', 'REST APIs'],
    salaryMin: 1400000,  // 14 LPA
    salaryMax: 2800000,  // 28 LPA
  },
  {
    title: 'React Native Developer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['React Native', 'TypeScript', 'Redux', 'Jest', 'REST APIs'],
    salaryMin: 1200000,  // 12 LPA
    salaryMax: 2400000,  // 24 LPA
  },
  {
    title: 'QA Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Selenium', 'Python', 'API Testing', 'Performance Testing', 'CI/CD'],
    salaryMin: 1000000,  // 10 LPA
    salaryMax: 2000000,  // 20 LPA
  },
  {
    title: 'SDE Intern',
    department: 'Engineering',
    employmentType: 'INTERNSHIP',
    experienceLevel: 'ENTRY',
    skills: ['Python', 'JavaScript', 'Data Structures', 'Algorithms'],
    salaryMin: 600000,   // 6 LPA (annualized)
    salaryMax: 1200000,  // 12 LPA (annualized)
  },
  // Product & Design
  {
    title: 'Product Manager',
    department: 'Product',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research', 'SQL'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4500000,  // 45 LPA
  },
  {
    title: 'Senior Product Designer',
    department: 'Design',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'UI/UX'],
    salaryMin: 2000000,  // 20 LPA
    salaryMax: 3500000,  // 35 LPA
  },
  {
    title: 'Engineering Manager',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'STAFF',
    skills: ['Team Leadership', 'System Design', 'Agile', 'Hiring', 'Mentoring'],
    salaryMin: 4000000,  // 40 LPA
    salaryMax: 7000000,  // 70 LPA
  },
  {
    title: 'Technical Program Manager',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Program Management', 'Technical Planning', 'Stakeholder Management', 'Agile'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4500000,  // 45 LPA
  },
];

// Indian cities for job locations
const locations = [
  'Bangalore, India',
  'Hyderabad, India',
  'Pune, India',
  'Chennai, India',
  'Mumbai, India',
  'Delhi-NCR, India',
  'Gurugram, India',
  'Noida, India',
  'Remote (India)',
];

// Location types distribution
const locationTypes: LocationType[] = [
  'REMOTE',
  'HYBRID',
  'HYBRID',
  'ONSITE',
  'HYBRID',
  'REMOTE',
];

// Description templates
const descriptionTemplates = [
  `We are looking for a talented {title} to join our {department} team. You will work on challenging problems at scale and help build products used by millions of users across India.

**What you'll do:**
- Design and implement scalable, reliable systems
- Collaborate with cross-functional teams including Product and Design
- Mentor junior engineers and contribute to technical decisions
- Write clean, maintainable, and well-tested code

**What we're looking for:**
- {experience} years of experience in software development
- Strong problem-solving skills and attention to detail
- Excellent communication and collaboration abilities
- Passion for building great products`,

  `Join our {department} team as a {title} and be part of building India's next-generation technology platform.

**Responsibilities:**
- Build and maintain high-quality software solutions
- Participate in code reviews and technical discussions
- Work closely with stakeholders to understand requirements
- Contribute to improving our engineering practices

**Requirements:**
- {experience}+ years of relevant experience
- Strong fundamentals in computer science
- Experience with modern development practices
- Ability to work in a fast-paced startup environment`,

  `We're hiring a {title} to join our growing {department} team!

**About the role:**
At our company, you'll get the opportunity to work on problems that impact millions of users daily. We believe in ownership, collaboration, and continuous learning.

**You'll be responsible for:**
- Building features end-to-end from ideation to production
- Optimizing performance and ensuring high availability
- Working with product managers to define technical requirements
- Contributing to architecture decisions and code reviews

**What we need:**
- {experience}+ years of hands-on experience
- Strong coding skills with focus on quality
- Experience working in agile environments
- Passion for technology and continuous learning`,
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

function generateJobId(): string {
  // Generate a realistic looking job ID
  return Math.floor(Math.random() * 9000000 + 1000000).toString();
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDescription(template: typeof jobTemplates[0]): string {
  const descTemplate = randomElement(descriptionTemplates);
  const experience = template.experienceLevel === 'ENTRY' ? '0-1' :
                    template.experienceLevel === 'MID' ? '2-4' :
                    template.experienceLevel === 'SENIOR' ? '5-8' : '8+';
  
  return descTemplate
    .replace('{title}', template.title)
    .replace(/{department}/g, template.department)
    .replace(/{experience}/g, experience);
}

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.job.deleteMany();
  await prisma.scrape.deleteMany();
  await prisma.company.deleteMany();

  // Create companies
  console.log('\nCreating companies...');
  const createdCompanies: { id: string; name: string; slug: string; atsType: JobSource }[] = [];

  for (const company of companies) {
    const created = await prisma.company.create({
      data: company,
    });
    createdCompanies.push({
      id: created.id,
      name: created.name,
      slug: created.slug,
      atsType: created.atsType,
    });
    console.log(`  ✓ ${company.name}`);
  }

  // Create jobs for each company
  console.log('\nCreating jobs...');
  let totalJobs = 0;

  for (const company of createdCompanies) {
    // Each company gets 4-8 random jobs
    const jobCount = Math.floor(Math.random() * 5) + 4;
    const selectedTemplates = [...jobTemplates]
      .sort(() => Math.random() - 0.5)
      .slice(0, jobCount);

    for (const template of selectedTemplates) {
      const jobId = generateJobId();
      const location = randomElement(locations);
      const locationType = randomElement(locationTypes);
      const daysAgo = Math.floor(Math.random() * 21); // Posted within last 3 weeks
      
      // Generate proper ATS URL
      const sourceUrl = generateSourceUrl(company.atsType, company.slug, jobId);
      
      await prisma.job.create({
        data: {
          externalId: jobId,
          source: company.atsType,
          title: template.title,
          description: generateDescription(template),
          requirements: [
            `${template.skills[0]} experience required`,
            'Strong problem-solving skills',
            'Excellent communication skills',
            'Ability to work in a team environment',
          ],
          location,
          isRemote: locationType === 'REMOTE',
          locationType,
          employmentType: template.employmentType as EmploymentType,
          experienceLevel: template.experienceLevel as ExperienceLevel,
          salaryMin: template.salaryMin,
          salaryMax: template.salaryMax,
          salaryCurrency: 'INR',
          salaryPeriod: 'YEARLY' as SalaryPeriod,
          skills: template.skills,
          department: template.department,
          postedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          sourceUrl,
          companyId: company.id,
        },
      });
      totalJobs++;
    }
    console.log(`  ✓ ${company.name}: ${jobCount} jobs`);
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Companies: ${createdCompanies.length}`);
  console.log(`   Jobs: ${totalJobs}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
