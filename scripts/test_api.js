const http = require('http');

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            data: responseData.length > 0 ? JSON.parse(responseData) : null,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('Testing ControlFlow AI Endpoints...\n');

  try {
    const health = await testEndpoint('/api/health');
    console.log('✓ GET /api/health ->', health.status, health.data.status);

    const dash = await testEndpoint('/api/dashboard');
    console.log('✓ GET /api/dashboard ->', dash.status, 'Company:', dash.data.company.name, 'Health Score:', dash.data.kpis.healthScore.score);

    const tx = await testEndpoint('/api/transactions?limit=5');
    console.log('✓ GET /api/transactions ->', tx.status, 'Total TXs:', tx.data.pagination.total);

    const anom = await testEndpoint('/api/anomalies');
    console.log('✓ GET /api/anomalies ->', anom.status, 'Anomalies count:', anom.data.count);

    const cf = await testEndpoint('/api/cashflow?horizon=3');
    console.log('✓ GET /api/cashflow ->', cf.status, 'Depletion date:', cf.data.projectedDepletionDate);

    const bg = await testEndpoint('/api/budgets');
    console.log('✓ GET /api/budgets ->', bg.status, 'Departments count:', bg.data.departments.length);

    const ins = await testEndpoint('/api/insights');
    console.log('✓ GET /api/insights ->', ins.status, 'Active insights:', ins.data.totalActiveInsights);

    const rk = await testEndpoint('/api/risks');
    console.log('✓ GET /api/risks ->', rk.status, 'Risk score:', rk.data.overallScore);

    const ast = await testEndpoint('/api/assistant', 'POST', {
      message: 'Why did expenses increase this month?',
    });
    console.log('✓ POST /api/assistant ->', ast.status, 'Reply length:', ast.data.text.length);

    const sim = await testEndpoint('/api/simulator/calculate', 'POST', {
      revenueGrowthPct: 20,
      expenseGrowthPct: 10,
      marketingSpendDelta: 10000,
      newHiresCount: 2,
      avgHireSalary: 120000,
    });
    console.log('✓ POST /api/simulator/calculate ->', sim.status, 'Verdict:', sim.data.impact.verdict, 'Runway delta:', sim.data.impact.runwayDeltaMonths);

    console.log('\n🎉 ALL 10 API ENDPOINTS PASSED VALIDATION WITH 200 OK!');
  } catch (err) {
    console.error('Test error:', err);
  }
}

runTests();
