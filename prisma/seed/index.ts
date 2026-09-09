/**
 * Database Seed Script
 * =============================================================================
 * Populates the database with realistic sample data for development.
 * Updated for India-focused job platform with Indian companies and INR salaries.
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
// SEED DATA - INDIAN COMPANIES
// =============================================================================

const companies: Prisma.CompanyCreateInput[] = [
  {
    name: 'Razorpay',
    slug: 'razorpay',
    logo: 'https://logo.clearbit.com/razorpay.com',
    description: 'Razorpay is India\'s leading full-stack financial solutions company, helping businesses accept, process and disburse payments.',
    website: 'https://razorpay.com',
    careerPageUrl: 'https://razorpay.com/jobs',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Swiggy',
    slug: 'swiggy',
    logo: 'https://logo.clearbit.com/swiggy.com',
    description: 'Swiggy is India\'s largest and most valuable online food ordering and delivery platform.',
    website: 'https://swiggy.com',
    careerPageUrl: 'https://careers.swiggy.com',
    industry: 'Food Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
  {
    name: 'CRED',
    slug: 'cred',
    logo: 'https://logo.clearbit.com/cred.club',
    description: 'CRED is a members-only credit card bill payment platform that rewards its users for timely payments.',
    website: 'https://cred.club',
    careerPageUrl: 'https://careers.cred.club',
    industry: 'Financial Technology',
    size: 'SIZE_501_1000',
    foundedYear: 2018,
    headquarters: 'Bangalore, India',
    atsType: 'ASHBY',
  },
  {
    name: 'Flipkart',
    slug: 'flipkart',
    logo: 'https://logo.clearbit.com/flipkart.com',
    description: 'Flipkart is India\'s leading e-commerce marketplace with over 450 million registered users.',
    website: 'https://flipkart.com',
    careerPageUrl: 'https://www.flipkartcareers.com',
    industry: 'E-Commerce',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2007,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Groww',
    slug: 'groww',
    logo: 'https://logo.clearbit.com/groww.in',
    description: 'Groww is a leading investment platform that enables users to invest in stocks, mutual funds, and more.',
    website: 'https://groww.in',
    careerPageUrl: 'https://groww.in/careers',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2016,
    headquarters: 'Bangalore, India',
    atsType: 'ASHBY',
  },
  {
    name: 'Zomato',
    slug: 'zomato',
    logo: 'https://logo.clearbit.com/zomato.com',
    description: 'Zomato is a technology platform that connects customers, restaurant partners and delivery partners.',
    website: 'https://zomato.com',
    careerPageUrl: 'https://www.zomato.com/careers',
    industry: 'Food Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2008,
    headquarters: 'Gurugram, India',
    atsType: 'LEVER',
  },
  {
    name: 'PhonePe',
    slug: 'phonepe',
    logo: 'https://logo.clearbit.com/phonepe.com',
    description: 'PhonePe is India\'s leading digital payments platform with over 400 million registered users.',
    website: 'https://phonepe.com',
    careerPageUrl: 'https://www.phonepe.com/careers',
    industry: 'Financial Technology',
    size: 'SIZE_5000_PLUS',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  {
    name: 'Meesho',
    slug: 'meesho',
    logo: 'https://logo.clearbit.com/meesho.com',
    description: 'Meesho is India\'s fastest growing e-commerce platform, enabling small businesses to start with zero investment.',
    website: 'https://meesho.com',
    careerPageUrl: 'https://careers.meesho.com',
    industry: 'E-Commerce',
    size: 'SIZE_1001_5000',
    foundedYear: 2015,
    headquarters: 'Bangalore, India',
    atsType: 'LEVER',
  },
];

// Job templates with realistic Indian salaries (in INR)
// Salaries are annual in absolute values: 30L = 3000000
const jobTemplates = [
  // Engineering roles
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    salaryMin: 3000000,  // 30 LPA
    salaryMax: 5000000,  // 50 LPA
  },
  {
    title: 'Staff Engineer, Platform',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'STAFF',
    skills: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'System Design'],
    salaryMin: 5000000,  // 50 LPA
    salaryMax: 8000000,  // 80 LPA
  },
  {
    title: 'Frontend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'GraphQL'],
    salaryMin: 1500000,  // 15 LPA
    salaryMax: 2500000,  // 25 LPA
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    salaryMin: 1800000,  // 18 LPA
    salaryMax: 3000000,  // 30 LPA
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4000000,  // 40 LPA
  },
  {
    title: 'Data Engineer',
    department: 'Data',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Python', 'Spark', 'Airflow', 'SQL', 'AWS'],
    salaryMin: 2000000,  // 20 LPA
    salaryMax: 3500000,  // 35 LPA
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'NLP'],
    salaryMin: 3500000,  // 35 LPA
    salaryMax: 6000000,  // 60 LPA
  },
  {
    title: 'Mobile Engineer (Android)',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Kotlin', 'Android', 'Jetpack Compose', 'MVVM', 'REST APIs'],
    salaryMin: 1500000,  // 15 LPA
    salaryMax: 2800000,  // 28 LPA
  },
  {
    title: 'Mobile Engineer (iOS)',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    skills: ['Swift', 'iOS', 'SwiftUI', 'Core Data', 'REST APIs'],
    salaryMin: 1500000,  // 15 LPA
    salaryMax: 2800000,  // 28 LPA
  },
  {
    title: 'SDE Intern',
    department: 'Engineering',
    employmentType: 'INTERNSHIP',
    experienceLevel: 'ENTRY',
    skills: ['Python', 'JavaScript', 'Data Structures', 'Algorithms'],
    salaryMin: 500000,   // 5 LPA (annualized)
    salaryMax: 1000000,  // 10 LPA (annualized)
  },
  // Product & Design
  {
    title: 'Product Manager',
    department: 'Product',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research', 'SQL'],
    salaryMin: 3000000,  // 30 LPA
    salaryMax: 5000000,  // 50 LPA
  },
  {
    title: 'Senior Product Designer',
    department: 'Design',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'UI/UX'],
    salaryMin: 2500000,  // 25 LPA
    salaryMax: 4000000,  // 40 LPA
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

  `Join our {department} team as a {title} and be part of building India's next-generation technology platform. We're looking for someone who is passionate about technology and excited to work on problems that impact millions of users.

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
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

function generateExternalId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
    .replace('{department}', template.department)
    .replace('{experience}', experience);
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
    // Each company gets 3-6 random jobs
    const jobCount = Math.floor(Math.random() * 4) + 3;
    const selectedTemplates = [...jobTemplates]
      .sort(() => Math.random() - 0.5)
      .slice(0, jobCount);

    for (const template of selectedTemplates) {
      const slug = company.slug;
      const location = randomElement(locations);
      const locationType = randomElement(locationTypes);
      const daysAgo = Math.floor(Math.random() * 14); // Posted within last 2 weeks
      
      await prisma.job.create({
        data: {
          externalId: generateExternalId(),
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
          sourceUrl: `https://example.com/jobs/${slug}/${generateExternalId()}`,
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
