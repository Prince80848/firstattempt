const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// User Schema (inline to avoid module path issues)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// TestSeries Schema
const testSeriesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    features: [{ type: String }],
    category: { type: String, required: true },
    duration: { type: String, default: '3 months' },
    totalTests: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const TestSeries = mongoose.model('TestSeries', testSeriesSchema);

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await TestSeries.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@firstattempt.com',
            mobile: '9931278403',
            password: hashedPassword,
            isAdmin: true
        });
        console.log('Admin user created:', adminUser.email);

        // Create sample test series
        const testSeriesData = [
            {
                title: 'CA Foundation Complete Test Series',
                description: 'Comprehensive test series covering all subjects for CA Foundation exam preparation.',
                price: 999,
                features: ['50+ Mock Tests', 'Subject-wise Tests', 'Detailed Solutions', 'Performance Analytics', '1:1 Doubt Sessions'],
                category: 'CA Foundation',
                duration: '3 months',
                totalTests: 50
            },
            {
                title: 'CA Foundation Paper-wise Practice',
                description: 'Paper-wise practice tests for focused preparation.',
                price: 499,
                features: ['Paper 1 & 2 Tests', 'Paper 3 & 4 Tests', 'Previous Year Questions', 'Expert Tips'],
                category: 'CA Foundation',
                duration: '2 months',
                totalTests: 30
            },
            {
                title: 'CA Inter Group 1 Test Series',
                description: 'Complete test series for CA Intermediate Group 1 subjects.',
                price: 1499,
                features: ['Advanced Accounting', 'Corporate Laws', 'Cost Accounting', 'Weekly Tests', 'Mentor Support'],
                category: 'CA Inter',
                duration: '4 months',
                totalTests: 40
            },
            {
                title: 'CA Inter Group 2 Test Series',
                description: 'Comprehensive preparation for CA Intermediate Group 2.',
                price: 1499,
                features: ['Taxation', 'Audit', 'EIS-SM', 'FM-ECO', 'Mock Finals'],
                category: 'CA Inter',
                duration: '4 months',
                totalTests: 40
            },
            {
                title: 'CA Final Full Course Test Series',
                description: 'Complete test series for CA Final examination.',
                price: 2499,
                features: ['Group 1 & 2 Tests', 'Case Studies', 'RTPs & MTPs', 'All India Mock', 'Topper Interaction'],
                category: 'CA Final',
                duration: '6 months',
                totalTests: 60
            }
        ];

        await TestSeries.insertMany(testSeriesData);
        console.log('Test series data created');

        console.log('\n========================================');
        console.log('Database seeded successfully!');
        console.log('========================================');
        console.log('\nAdmin Login Credentials:');
        console.log('Email: admin@firstattempt.com');
        console.log('Password: admin123');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
