import { AssistantMessage } from '../types';
import { MONTHLY_HISTORICALS, DEPARTMENT_BUDGETS, AI_INSIGHTS, COMPANY_PROFILE } from '../data/mockFinancials';
import { anomalyService } from './anomalyService';
import { riskService } from './riskService';
import { scenarioService } from './scenarioService';

export class AssistantService {
  public async handleQuery(userQuery: string): Promise<AssistantMessage> {
    const q = userQuery.toLowerCase().trim();
    const historicals = MONTHLY_HISTORICALS;
    const current = historicals[historicals.length - 1];
    const prev = historicals[historicals.length - 2];
    const risk = riskService.getRiskAssessment();
    const anomalies = anomalyService.getAnomalies();
    const budgets = DEPARTMENT_BUDGETS;

    let replyText = '';
    let metrics: Array<{ label: string; value: string; delta?: string }> | undefined = undefined;
    let suggestedFollowUps: string[] = [];

    // 1. Why did expenses increase / spending spike
    if (q.includes('why') && (q.includes('expense') || q.includes('spend') || q.includes('increase') || q.includes('spike'))) {
      const expDelta = current.expenses - prev.expenses;
      const expDeltaPct = ((expDelta / prev.expenses) * 100).toFixed(1);

      replyText = `**Operating Expenses increased by ₹${(expDelta / 100000).toFixed(2)}L (+${expDeltaPct}%)** from ₹${(
        prev.expenses / 100000
      ).toFixed(2)}L in Jan '26 to ₹${(current.expenses / 100000).toFixed(2)}L in Feb '26.\n\n### Primary Cost Drivers:\n1. **Cloud Infrastructure Spike (+₹1.82L)**: AWS compute and RDS database overages reached ₹2,84,500 (vs ₹1,02,000 baseline).\n2. **Paid Acquisition Acceleration (+₹1.25L)**: Meta Ads and Google search campaigns expanded to ₹6,42,000 as part of Q1 acquisition push.\n3. **One-Time Audit & Legal Fees (+₹1.85L)**: Deloitte tax audit retainer and annual compliance filing.\n\n**Actionable Advice**: Capping AWS compute autoscaling and pausing unoptimized Meta lookalike ad sets will immediately recover ~₹2.73L/month in baseline expenses.`;

      metrics = [
        { label: 'Current Expenses', value: `₹${(current.expenses / 100000).toFixed(2)}L`, delta: `+${expDeltaPct}% MoM` },
        { label: 'Cloud Spike (AWS)', value: '₹2,84,500', delta: '+178% surge' },
        { label: 'Marketing Ad Spend', value: '₹6,42,000', delta: '92% budget used' },
      ];

      suggestedFollowUps = [
        'How much cash runway do we have?',
        'Which category is overspending?',
        'What is our biggest financial risk?',
      ];
    }
    // 2. What is our biggest financial risk / risk assessment
    else if (q.includes('biggest risk') || q.includes('financial risk') || q.includes('risk score') || q.includes('vulnerabilit')) {
      replyText = `Our composite Financial Risk Score is **${risk.overallScore}/100 (${risk.riskLevel.toUpperCase()})**.\n\n### Top 3 Financial Vulnerabilities:\n1. **Runway Contraction (7.2 Months Remaining)**: Cash reserves (₹1.25 Cr) will hit the safety reserve boundary (₹40L) in ~4.5 months without expense intervention.\n2. **Cloud Infrastructure Cost Drift**: AWS bills surged to 2.8x historical baseline due to unindexed database load.\n3. **Department Budget Velocity**: Marketing and Engineering have both exceeded 90% budget utilization at 74% cycle elapsed.\n\n**Recommended Priority**: Execute ₹3.0L/mo expense containment to lift runway to 9.5 months.`;

      metrics = [
        { label: 'Risk Score', value: `${risk.overallScore}/100`, delta: 'Elevated' },
        { label: 'Cash Runway', value: '7.2 Months', delta: '-1.1 mos MoM' },
        { label: 'Active Anomalies', value: `${anomalies.length} Flagged`, delta: '₹10.83L volume' },
      ];

      suggestedFollowUps = [
        'What happens if expenses increase by 20%?',
        'How can we extend runway to 12 months?',
        'Show me flagged transaction anomalies',
      ];
    }
    // 3. Runway inquiry
    else if (q.includes('runway') || q.includes('cash balance') || q.includes('how long') || q.includes('out of cash') || q.includes('burn rate')) {
      const burn = current.burnRate;
      const runway = current.runwayMonths;

      replyText = `Apex Technologies currently has **${runway} months of cash runway** based on:\n- **Current Cash Balance**: ₹${(
        current.cashBalance / 10000000
      ).toFixed(2)} Cr\n- **Monthly Net Cash Burn**: ₹${(burn / 100000).toFixed(2)}L/month\n- **Monthly Revenue**: ₹${(
        current.revenue / 100000
      ).toFixed(2)}L\n- **Monthly Expenses**: ₹${(current.expenses / 100000).toFixed(2)}L\n\nAt this current burn rate, cash reserves are projected to reach the minimum policy reserve (₹40L) by **September 2026**.`;

      metrics = [
        { label: 'Current Runway', value: `${runway} Months`, delta: 'Target: 12.0 mos' },
        { label: 'Cash Reserves', value: `₹${(current.cashBalance / 10000000).toFixed(2)} Cr`, delta: '-₹17.29L/mo' },
        { label: 'Monthly Burn', value: `₹${(burn / 100000).toFixed(2)}L`, delta: '+10.4% MoM' },
      ];

      suggestedFollowUps = [
        'What happens if expenses increase by 20%?',
        'How can we extend runway to 12 months?',
        'Why did expenses increase this month?',
      ];
    }
    // 4. Which category or department is overspending
    else if (q.includes('overspend') || q.includes('budget') || q.includes('department') || q.includes('category')) {
      replyText = `### Department Spending Analysis (74% Month Elapsed):\n\n- **Engineering (OVER BUDGET 🔴)**: ₹16,25,000 spent of ₹14,00,000 allocated (**116.1% used**). Projected overrun is **+₹3.82L**, caused by AWS compute surges and contractor fees.\n- **Marketing (AT RISK 🟡)**: ₹8,74,000 spent of ₹9,50,000 allocated (**92.0% used**). Projected overrun is **+₹1.89L** from frontloaded Meta Ads.\n- **Sales (CAUTION 🟡)**: ₹7,12,000 spent of ₹8,00,000 allocated (**89.0% used**).\n- **Operations, HR, & Legal (ON TRACK 🟢)**: Operating within normal parameters (~85% used).\n\n**Controller Recommendation**: Enforce spending freeze on non-critical engineering SaaS tools and cap weekly marketing campaign budgets.`;

      metrics = [
        { label: 'Engineering Spend', value: '116.1%', delta: '+₹2.25L overrun' },
        { label: 'Marketing Spend', value: '92.0%', delta: 'At Risk' },
        { label: 'Total Budget Used', value: '96.2%', delta: '74% period elapsed' },
      ];

      suggestedFollowUps = [
        'Why did expenses increase this month?',
        'Show me flagged transaction anomalies',
        'How can we extend runway to 12 months?',
      ];
    }
    // 5. What if scenario / simulation
    else if (q.includes('what if') || q.includes('increase by') || q.includes('decrease by') || q.includes('scenario') || q.includes('hiring')) {
      let pct = 20;
      const match = q.match(/(\d+)%/);
      if (match) pct = parseInt(match[1], 10);

      const sim = scenarioService.simulateScenario({
        revenueGrowthPct: 0,
        expenseGrowthPct: pct,
        marketingSpendDelta: 0,
        newHiresCount: 0,
        avgHireSalary: 1200000,
      });

      replyText = `### What-If Analysis: ${pct}% Expense Increase\n\nIf operating expenses increase by **${pct}%** (₹${(
        current.expenses / 100000
      ).toFixed(2)}L ➔ ₹${(sim.simulated.monthlyExpenses / 100000).toFixed(
        2
      )}L/mo) while revenue remains constant at ₹${(current.revenue / 100000).toFixed(2)}L/mo:\n\n- **Projected Cash Runway**: Drops from **7.2 months** down to **${
        sim.simulated.cashRunwayMonths
      } months** (-${Math.abs(sim.impact.runwayDeltaMonths)} months).\n- **New Monthly Net Burn**: Increases from ₹17.29L to **₹${(
        (sim.simulated.monthlyExpenses - current.revenue) / 100000
      ).toFixed(2)}L/mo** (+₹${(sim.impact.monthlyBurnDelta / 100000).toFixed(2)}L faster burn).\n- **Risk Score Impact**: Jumps from 68/100 to **${
        sim.simulated.riskScore
      }/100 (${sim.impact.verdict.toUpperCase()})**.\n- **Cash Depletion Date**: Cash reaches safety reserve in just **${Math.max(
        1,
        Math.round((current.cashBalance - 4000000) / (sim.simulated.monthlyExpenses - current.revenue))
      )} months**.\n\n👉 You can test more custom parameters in the **Scenario Simulator** tab.`;

      metrics = [
        { label: 'Simulated Runway', value: `${sim.simulated.cashRunwayMonths} mos`, delta: `${sim.impact.runwayDeltaMonths} mos` },
        { label: 'Simulated Burn', value: `₹${((sim.simulated.monthlyExpenses - current.revenue) / 100000).toFixed(2)}L/mo`, delta: `+₹${(sim.impact.monthlyBurnDelta / 100000).toFixed(2)}L` },
        { label: 'Simulated Risk', value: `${sim.simulated.riskScore}/100`, delta: `+${sim.impact.riskScoreDelta} pts` },
      ];

      suggestedFollowUps = [
        'How can we extend runway to 12 months?',
        'What is our biggest financial risk?',
        'Which category is overspending?',
      ];
    }
    // 6. How to extend runway
    else if (q.includes('extend runway') || q.includes('12 months') || q.includes('save money') || q.includes('cut costs') || q.includes('recommendation')) {
      replyText = `### Strategy to Extend Cash Runway from 7.2 to 12.4 Months:\n\nTo achieve a **12+ month safety corridor**, we need to reduce net monthly burn by **₹7.25L/month**:\n\n1. **Cloud Cost Containment (-₹1.48L/mo)**: Rightsize AWS RDS instances, delete orphaned EBS disks, and commit to 1-yr reserved compute.\n2. **Paid Ads Re-targeting (-₹1.80L/mo)**: Cap Meta Ads and refocus on high-intent inbound SEO and direct outbound SDR campaigns.\n3. **SaaS Sprawl Rationalization (-₹42k/mo)**: Deprovision 38 inactive Miro seats and duplicate Loom licenses.\n4. **Travel & Discretionary Freeze (-₹55k/mo)**: Enforce 14-day advance booking window on corporate travel.\n5. **Top-Line ARR Expansion (+₹3.0L/mo)**: Convert 3 enterprise POCs currently in late-stage pipeline.\n\n**Net Result**: Runway extends to **12.4 months**, preserving ₹1.02 Cr cash through Q1 2027.`;

      metrics = [
        { label: 'Target Runway', value: '12.4 Months', delta: '+5.2 mos extended' },
        { label: 'Target Monthly Burn', value: '₹10.04L/mo', delta: '-₹7.25L/mo saved' },
        { label: 'Safety Threshold', value: 'Protected', delta: 'Extended past Q1 2027' },
      ];

      suggestedFollowUps = [
        'Why did expenses increase this month?',
        'What is our biggest financial risk?',
        'Show me flagged transaction anomalies',
      ];
    }
    // 7. Anomalies inquiry
    else if (q.includes('anomal') || q.includes('flagged') || q.includes('suspicious') || q.includes('fraud')) {
      replyText = `### Active Transaction Anomalies Identified (${anomalies.length} Flagged):\n\n1. 🚨 **Amazon Web Services (₹2,84,500.00)** — *Critical Risk*: 2.8x higher than historical baseline (₹1.02L). RDS query inefficiency.\n2. 🚨 **Apex Global Logistics (₹1,28,000.00)** — *Critical Risk*: First-time overseas wire without matching Master Service Agreement.\n3. ⚠️ **Meta Ads (₹4,25,000.00)** — *High Risk*: Weekly spend surge exceeded 240% of campaign target ceiling.\n4. ⚠️ **Synthesia AI (₹99,000.00)** — *High Risk*: Unscheduled weekend annual license purchase without PO.\n5. ⚠️ **Air India / Vistara (₹34,500.00)** — *High Risk*: Potential duplicate billing within 48h window.\n\n**Action**: Navigate to the **Transactions** or **AI Insights** tabs to inspect and resolve these items with 1-click workflows.`;

      metrics = [
        { label: 'Flagged Volume', value: '₹10,83,000', delta: `${anomalies.length} Transactions` },
        { label: 'Critical Items', value: '2 Items', delta: 'Immediate Review' },
        { label: 'Potential Savings', value: '₹3,43,500', delta: 'Actionable' },
      ];

      suggestedFollowUps = [
        'Why did expenses increase this month?',
        'How much cash runway do we have?',
        'What is our biggest financial risk?',
      ];
    }
    // Default Fallback
    else {
      replyText = `Here is the current financial controller summary for **${COMPANY_PROFILE.name}**:\n\n- **ARR**: ₹${(
        COMPANY_PROFILE.arr / 10000000
      ).toFixed(2)} Cr across 28 team members.\n- **Cash Runway**: **${
        current.runwayMonths
      } months** (₹${(current.cashBalance / 10000000).toFixed(2)} Cr cash balance, ₹${(
        current.burnRate / 100000
      ).toFixed(2)}L net burn).\n- **Financial Health Score**: **${
        risk.healthScore
      }/100 (${risk.healthStatus})**.\n- **Active Flags**: ${
        anomalies.length
      } anomalous transactions detected totaling ₹10.83L.\n\nFeel free to ask specific questions about runway extensions, departmental overspending, anomaly root causes, or what-if scenarios!`;

      metrics = [
        { label: 'Cash Balance', value: `₹${(current.cashBalance / 10000000).toFixed(2)} Cr`, delta: `${current.runwayMonths} mos runway` },
        { label: 'Health Score', value: `${risk.healthScore}/100`, delta: risk.healthStatus },
        { label: 'Risk Score', value: `${risk.overallScore}/100`, delta: risk.riskLevel },
      ];

      suggestedFollowUps = [
        'Why did expenses increase this month?',
        'What is our biggest financial risk?',
        'Which category is overspending?',
        'What happens if expenses increase by 20%?',
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
      metrics,
      suggestedFollowUps,
    };
  }
}

export const assistantService = new AssistantService();
