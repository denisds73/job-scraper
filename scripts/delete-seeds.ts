import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fakeCompanySlugs = [
  'razorpay', 'phonepe', 'cred', 'groww', 'flipkart', 'meesho', 'myntra', 
  'swiggy', 'zomato', 'zepto', 'freshworks', 'postman', 'hasura', 
  'browserstack', 'unacademy', 'upgrad', 'makemytrip', 'oyo', 'olacabs', 'rapido'
];

async function main() {
  // Get IDs of fake companies
  const fakeCompanies = await prisma.company.findMany({
    where: { slug: { in: fakeCompanySlugs } },
    select: { id: true, name: true }
  });
  
  console.log(`Found ${fakeCompanies.length} seed companies to delete`);
  
  const fakeIds = fakeCompanies.map(c => c.id);
  
  if (fakeIds.length === 0) {
    console.log('No seed companies found to delete');
    return;
  }
  
  // Delete jobs from these companies
  const deletedJobs = await prisma.job.deleteMany({
    where: { companyId: { in: fakeIds } }
  });
  console.log(`Deleted ${deletedJobs.count} fake jobs`);
  
  // Delete scrapes for these companies
  await prisma.scrape.deleteMany({
    where: { companyId: { in: fakeIds } }
  });
  
  // Delete the companies
  const deletedCompanies = await prisma.company.deleteMany({
    where: { id: { in: fakeIds } }
  });
  console.log(`Deleted ${deletedCompanies.count} seed companies`);
  
  // Count remaining
  const jobCount = await prisma.job.count();
  const companyCount = await prisma.company.count();
  console.log(`\nRemaining: ${companyCount} companies, ${jobCount} jobs`);
}

main().finally(() => prisma.$disconnect());
