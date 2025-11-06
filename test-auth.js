import fetch from 'node-fetch';
import 'dotenv/config';

const BASE_URL = 'http://localhost:4000';
let authToken = '';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Test authentication flow
async function testAuthentication() {
  console.log('🧪 Testing Authentication System\n');

  // Test 1: Register a new user
  console.log('1. Testing user registration...');
  const registerData = {
    username: 'testuser',
    email: 'test@papeleria.com',
    password: 'testpassword123',
    roleName: 'user'
  };

  const registerResult = await apiRequest('/auth/register', {
    method: 'POST',
    body: registerData
  });

  if (registerResult.status === 201) {
    console.log('✅ Registration successful');
    console.log('   User created:', registerResult.data.user);
  } else {
    console.log('❌ Registration failed:', registerResult.data.message);
  }

  // Test 2: Login with the registered user
  console.log('\n2. Testing user login...');
  const loginData = {
    email: 'test@papeleria.com',
    password: 'testpassword123'
  };

  const loginResult = await apiRequest('/auth/login', {
    method: 'POST',
    body: loginData
  });

  if (loginResult.status === 200) {
    console.log('✅ Login successful');
    console.log('   User logged in:', loginResult.data.user);
    authToken = loginResult.data.token || 'cookie-based';
  } else {
    console.log('❌ Login failed:', loginResult.data.message);
  }

  // Test 3: Verify authentication
  console.log('\n3. Testing authentication verification...');
  const verifyResult = await apiRequest('/auth/verify', {
    method: 'GET'
  });

  if (verifyResult.status === 200) {
    console.log('✅ Authentication verification successful');
    console.log('   Authenticated user:', verifyResult.data.user);
  } else {
    console.log('❌ Authentication verification failed:', verifyResult.data.message);
  }

  // Test 4: Get user profile
  console.log('\n4. Testing profile retrieval...');
  const profileResult = await apiRequest('/auth/profile', {
    method: 'GET'
  });

  if (profileResult.status === 200) {
    console.log('✅ Profile retrieval successful');
    console.log('   User profile:', profileResult.data.user);
  } else {
    console.log('❌ Profile retrieval failed:', profileResult.data.message);
  }

  // Test 5: Test protected routes access
  console.log('\n5. Testing protected routes...');

  // Test products route
  const productsResult = await apiRequest('/products', {
    method: 'GET'
  });

  if (productsResult.status === 200) {
    console.log('✅ Products route accessible');
  } else if (productsResult.status === 401) {
    console.log('❌ Products route requires authentication');
  } else {
    console.log('⚠️  Products route returned:', productsResult.status);
  }

  // Test 6: Logout
  console.log('\n6. Testing logout...');
  const logoutResult = await apiRequest('/auth/logout', {
    method: 'POST'
  });

  if (logoutResult.status === 200) {
    console.log('✅ Logout successful');
  } else {
    console.log('❌ Logout failed:', logoutResult.data.message);
  }

  // Test 7: Verify logout (should fail)
  console.log('\n7. Testing authentication after logout...');
  const postLogoutVerify = await apiRequest('/auth/verify', {
    method: 'GET'
  });

  if (postLogoutVerify.status === 401) {
    console.log('✅ Authentication correctly invalidated after logout');
  } else {
    console.log('❌ Authentication still valid after logout');
  }

  console.log('\n🎉 Authentication test completed!');
}

// Test role-based access
async function testRoleBasedAccess() {
  console.log('\n🧪 Testing Role-Based Access Control\n');

  // Login as admin (using seeded admin user)
  console.log('1. Logging in as admin...');
  const adminLogin = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@papeleria.com',
      password: 'admin123'
    }
  });

  if (adminLogin.status === 200) {
    console.log('✅ Admin login successful');

    // Test admin permissions
    console.log('\n2. Testing admin permissions...');

    // Test creating a product (should work for admin)
    const createProduct = await apiRequest('/products', {
      method: 'POST',
      body: {
        name: 'Test Product',
        description: 'A test product',
        category: '65a1b2c3d4e5f67890123456', // Mock category ID
        price: 19.99,
        image: 'test.jpg'
      }
    });

    if (createProduct.status === 201) {
      console.log('✅ Admin can create products');
    } else if (createProduct.status === 403) {
      console.log('❌ Admin cannot create products (unexpected)');
    } else {
      console.log('⚠️  Product creation returned:', createProduct.status);
    }

    // Logout admin
    await apiRequest('/auth/logout', { method: 'POST' });
  } else {
    console.log('❌ Admin login failed - make sure to run npm run seed first');
  }

  // Login as regular user
  console.log('\n3. Testing user permissions...');
  const userLogin = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      email: 'test@papeleria.com',
      password: 'testpassword123'
    }
  });

  if (userLogin.status === 200) {
    console.log('✅ User login successful');

    // Test user permissions (should only be able to read)
    const readProducts = await apiRequest('/products', {
      method: 'GET'
    });

    if (readProducts.status === 200) {
      console.log('✅ User can read products');
    } else {
      console.log('❌ User cannot read products');
    }

    // Test if user can create (should fail)
    const userCreateProduct = await apiRequest('/products', {
      method: 'POST',
      body: {
        name: 'User Product',
        description: 'A product created by user',
        category: '65a1b2c3d4e5f67890123456',
        price: 9.99,
        image: 'user-product.jpg'
      }
    });

    if (userCreateProduct.status === 403) {
      console.log('✅ User correctly cannot create products');
    } else {
      console.log('❌ User can create products (security issue!)');
    }

    await apiRequest('/auth/logout', { method: 'POST' });
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Backend Authentication Tests\n');

  try {
    await testAuthentication();
    await testRoleBasedAccess();

    console.log('\n🎊 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - Authentication system: JWT + Cookies');
    console.log('   - Password hashing: bcrypt');
    console.log('   - Role-based access control: admin, manager, user');
    console.log('   - Protected routes with middleware');
    console.log('   - Cookie-based session management');

  } catch (error) {
    console.error('❌ Test runner error:', error);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
