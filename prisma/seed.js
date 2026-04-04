const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/password');

const prisma = new PrismaClient();

// Indian dummy data
const users = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    password: 'Admin@123',
    role: 'ADMIN'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    password: 'Analyst@123',
    role: 'ANALYST'
  },
  {
    name: 'Arjun Patel',
    email: 'arjun.patel@outlook.com',
    password: 'User@123',
    role: 'VIEWER'
  },
  {
    name: 'Anita Gupta',
    email: 'anita.gupta@gmail.com',
    password: 'Analyst@123',
    role: 'ANALYST'
  },
  {
    name: 'Sanjay Singh',
    email: 'sanjay.singh@hotmail.com',
    password: 'User@123',
    role: 'VIEWER'
  }
];

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Indian transaction categories and data
const incomeTransactions = [
  { category: 'Salary', descriptions: ['Monthly salary', 'Salary credit', 'October salary', 'November salary', 'December salary'] },
  { category: 'Freelancing', descriptions: ['Web development project', 'Consulting fees', 'Graphic design work', 'Mobile app development'] },
  { category: 'Investment Returns', descriptions: ['Mutual fund returns', 'Stock dividend', 'FD interest', 'PPF returns'] },
  { category: 'Rental Income', descriptions: ['House rent', 'Shop rent', 'Flat rental', 'Commercial property rent'] },
  { category: 'Business Income', descriptions: ['Online store sales', 'Service charges', 'Product sales', 'Business consulting'] },
  { category: 'Bonus', descriptions: ['Festival bonus', 'Performance bonus', 'Diwali bonus', 'Year-end bonus'] },
  { category: 'Side Hustle', descriptions: ['Tutoring fees', 'Food delivery', 'Uber driving', 'YouTube earnings'] }
];

const expenseTransactions = [
  { category: 'Food & Dining', descriptions: ['Swiggy order', 'Restaurant dinner', 'Grocery shopping', 'Street food', 'Cafe coffee', 'Zomato order'] },
  { category: 'Transportation', descriptions: ['Metro card recharge', 'Uber ride', 'Petrol', 'Auto rickshaw', 'Bus ticket', 'Train ticket'] },
  { category: 'Utilities', descriptions: ['Electricity bill', 'Water bill', 'Gas cylinder', 'Internet bill', 'Mobile recharge', 'DTH recharge'] },
  { category: 'Shopping', descriptions: ['Clothes shopping', 'Amazon purchase', 'Flipkart order', 'Electronics', 'Books', 'Home appliances'] },
  { category: 'Entertainment', descriptions: ['Movie tickets', 'Netflix subscription', 'Concert tickets', 'Gaming', 'Spotify premium'] },
  { category: 'Healthcare', descriptions: ['Doctor consultation', 'Medicines', 'Health checkup', 'Dental treatment', 'Eye checkup'] },
  { category: 'Education', descriptions: ['Online course fees', 'Book purchase', 'Certification exam', 'Workshop fees', 'Library subscription'] },
  { category: 'Insurance', descriptions: ['Health insurance', 'Car insurance', 'Life insurance', 'Term insurance premium'] },
  { category: 'Rent', descriptions: ['House rent', 'Office rent', 'Parking rent', 'Storage rent'] },
  { category: 'Personal Care', descriptions: ['Salon visit', 'Gym membership', 'Spa treatment', 'Cosmetics', 'Grooming products'] },
  { category: 'Travel', descriptions: ['Flight tickets', 'Hotel booking', 'Holiday trip', 'Vacation expenses', 'Weekend getaway'] },
  { category: 'Gifts & Donations', descriptions: ['Birthday gift', 'Wedding gift', 'Festival shopping', 'Charity donation', 'Temple donation'] }
];

const generateTransactions = (userId, startDate, endDate, count) => {
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() < 0.3; // 30% income, 70% expense
    const transactionType = isIncome ? 'INCOME' : 'EXPENSE';
    
    let category, description, amount;
    
    if (isIncome) {
      const incomeCategory = incomeTransactions[Math.floor(Math.random() * incomeTransactions.length)];
      category = incomeCategory.category;
      description = incomeCategory.descriptions[Math.floor(Math.random() * incomeCategory.descriptions.length)];
      
      // Income amounts in INR
      if (category === 'Salary') amount = getRandomAmount(30000, 80000);
      else if (category === 'Freelancing') amount = getRandomAmount(5000, 25000);
      else if (category === 'Investment Returns') amount = getRandomAmount(1000, 15000);
      else if (category === 'Rental Income') amount = getRandomAmount(8000, 30000);
      else if (category === 'Business Income') amount = getRandomAmount(10000, 50000);
      else if (category === 'Bonus') amount = getRandomAmount(15000, 40000);
      else amount = getRandomAmount(2000, 12000);
    } else {
      const expenseCategory = expenseTransactions[Math.floor(Math.random() * expenseTransactions.length)];
      category = expenseCategory.category;
      description = expenseCategory.descriptions[Math.floor(Math.random() * expenseCategory.descriptions.length)];
      
      // Expense amounts in INR
      if (category === 'Rent') amount = getRandomAmount(8000, 25000);
      else if (category === 'Food & Dining') amount = getRandomAmount(200, 1500);
      else if (category === 'Transportation') amount = getRandomAmount(50, 800);
      else if (category === 'Utilities') amount = getRandomAmount(500, 3000);
      else if (category === 'Shopping') amount = getRandomAmount(1000, 8000);
      else if (category === 'Entertainment') amount = getRandomAmount(300, 2000);
      else if (category === 'Healthcare') amount = getRandomAmount(500, 5000);
      else if (category === 'Education') amount = getRandomAmount(1000, 10000);
      else if (category === 'Insurance') amount = getRandomAmount(2000, 8000);
      else if (category === 'Personal Care') amount = getRandomAmount(500, 3000);
      else if (category === 'Travel') amount = getRandomAmount(3000, 20000);
      else amount = getRandomAmount(500, 5000);
    }
    
    transactions.push({
      amount: amount,
      type: transactionType,
      category: category,
      date: getRandomDate(startDate, endDate),
      description: description,
      createdBy: userId
    });
  }
  
  return transactions;
};

async function main() {
  console.log('🌱 Seeding database with Indian dummy data...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of users) {
      const hashedPassword = await hashPassword(userData.password);
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });
      
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Generate transactions for the last 6 months
    console.log('💰 Creating transactions...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    let totalTransactions = 0;
    
    for (const user of createdUsers) {
      // Generate different number of transactions based on role
      let transactionCount;
      if (user.role === 'ADMIN') transactionCount = 80;
      else if (user.role === 'ANALYST') transactionCount = 60;
      else transactionCount = 40;
      
      const userTransactions = generateTransactions(user.id, startDate, endDate, transactionCount);
      
      for (const transaction of userTransactions) {
        await prisma.transaction.create({
          data: transaction
        });
      }
      
      totalTransactions += transactionCount;
      console.log(`✅ Created ${transactionCount} transactions for ${user.name}`);
    }

    // Print summary
    console.log('\n📊 Seed Summary:');
    console.log(`👥 Users created: ${createdUsers.length}`);
    console.log(`💰 Transactions created: ${totalTransactions}`);
    console.log('\n🎯 User Credentials:');
    console.log('┌─────────────────────┬─────────────────────────────┬─────────────┬──────────┐');
    console.log('│ Name                │ Email                       │ Password    │ Role     │');
    console.log('├─────────────────────┼─────────────────────────────┼─────────────┼──────────┤');
    
    users.forEach(user => {
      const name = user.name.padEnd(19);
      const email = user.email.padEnd(27);
      const password = user.password.padEnd(11);
      const role = user.role.padEnd(8);
      console.log(`│ ${name} │ ${email} │ ${password} │ ${role} │`);
    });
    
    console.log('└─────────────────────┴─────────────────────────────┴─────────────┴──────────┘');
    
    console.log('\n🚀 Database seeding completed successfully!');
    console.log('💡 You can now login with any of the above credentials');
    console.log('🌐 Visit http://localhost:3000/api-docs to test the APIs');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });