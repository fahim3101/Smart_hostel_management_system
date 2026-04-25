const bcrypt = require('bcryptjs');

const generateHash = async () => {
  try {
    const password = 'password123';
    
    // Generate hash with 10 salt rounds
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n✅ Copy this hash and use in MySQL');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

generateHash();