export const customers = [
  { id: 'C-10482', name: 'Mitchell, Sarah', email: 'sarah.m@email.ca', type: 'Residential', plan: 'Variable', marketer: 'NRG Direct', balance: '$0.00', status: 'Active', since: 'Jan 2024', hasCase: true, caseId: 'CS-8824' },
  { id: 'C-10481', name: 'Lakeside Industrial Ltd.', email: 'ops@lakeside.ca', type: 'Industrial', plan: 'Fixed', marketer: 'PrairieEnergy', balance: '$14,200.00', status: 'Pending', since: 'Mar 2026' },
  { id: 'C-10480', name: "O'Brien, Connor", email: 'cobrien@outlook.com', type: 'Residential', plan: 'Variable', marketer: 'AltaEnergy', balance: '$0.00', status: 'Active', since: 'Feb 2026' },
  { id: 'C-10478', name: 'MacGregor Industrial Ltd.', email: 'admin@macgregorhold.ca', type: 'Industrial', plan: 'Variable', marketer: 'GreenPath', balance: '$8,400.00', status: 'Exception', since: 'Nov 2023', caseId: 'CS-4821' },
  { id: 'C-10475', name: 'Tremblay, Marie', email: 'mtremblay@shaw.ca', type: 'Residential', plan: 'Fixed', marketer: 'NRG Direct', balance: '$0.00', status: 'Active', since: 'Jun 2023' },
  { id: 'C-10473', name: 'Sutherland Industrial Group', email: 'finance@sutherland-ig.ca', type: 'Industrial', plan: 'Fixed', marketer: 'Calgary Energy', balance: '$0.00', status: 'Active', since: 'Apr 2023' },
  { id: 'C-10470', name: 'Wilson, Barbara', email: 'bwilson@gmail.com', type: 'Residential', plan: 'Variable', marketer: 'NRG Direct', balance: '$124.00', status: 'Pending', since: 'Mar 2023' },
  { id: 'C-10468', name: 'Pemberton Resources Corp', email: 'ar@pemberton.ca', type: 'Industrial', plan: 'Variable', marketer: 'PrairieEnergy', balance: '$0.00', status: 'Active', since: 'Jan 2023' },
];

export const billingExceptions = [
  { id: 'EXC-0311-A', customer: 'MacGregor Industrial Ltd.', customerId: 'C-10478', type: 'Meter Data', description: 'Usage reading missing for March 1–8 period. AESO feed returned null for Meter ID MGH-44821. Billing calculation blocked.', impact: '$4,200', status: 'Unresolved' },
  { id: 'EXC-0311-B', customer: 'Wilson, Barbara', customerId: 'C-10470', type: 'Rate Mismatch', description: 'Applied rate $0.0892/kWh does not match NRG Direct contract rate $0.0854/kWh effective Feb 15. Overcharged by $38.40.', impact: '$38.40', status: 'Unresolved' },
  { id: 'EXC-0311-C', customer: 'Moreau, Jean-Pierre', customerId: 'C-10451', type: 'Banking Error', description: 'RBC pre-authorized payment returned NSF. Account balance owing $124.00. PAD agreement requires re-authorization.', impact: '$124', status: 'Unresolved' },
];

export const marketers = [
  { id: 'MKT-001', name: 'NRG Direct', customers: 4821, revenue: '$841,200', margin: '5.0%', status: 'Active' },
  { id: 'MKT-002', name: 'PrairieEnergy', customers: 3112, revenue: '$612,400', margin: '5.0%', status: 'Active' },
  { id: 'MKT-003', name: 'AltaGas Retail', customers: 2408, revenue: '$481,600', margin: '5.0%', status: 'Exception' },
  { id: 'MKT-004', name: 'GreenPath', customers: 1944, revenue: '$388,800', margin: '5.0%', status: 'Active' },
  { id: 'MKT-005', name: 'Calgary Energy', customers: 1102, revenue: '$220,400', margin: '4.5%', status: 'Review' },
  { id: 'MKT-006', name: 'AltaEnergy', customers: 893, revenue: '$178,600', margin: '5.0%', status: 'Active' },
];

export const settlementData = [
  { name: 'NRG Direct', customers: 4821, revenue: '$841,200', commission: '$42,060', status: 'Reconciled' },
  { name: 'PrairieEnergy', customers: 3112, revenue: '$612,400', commission: '$30,620', status: 'Reconciled' },
  { name: 'AltaGas Retail', customers: 2408, revenue: '$481,600', commission: '$—', status: 'Exception', variance: 1640, utilitynetCalc: 481600, altagasSubmitted: 483240 },
  { name: 'GreenPath', customers: 1944, revenue: '$388,800', commission: '$19,440', status: 'Reconciled' },
  { name: 'Calgary Energy', customers: 1102, revenue: '$220,400', commission: '$—', status: 'In Review' },
  { name: 'AltaEnergy', customers: 893, revenue: '$178,600', commission: '$8,930', status: 'Reconciled' },
];

export const kpiData = {
  dashboard: {
    revenue: '$2.34M',
    revenueDelta: '↑ 12.4% vs. last month',
    customers: '14,291',
    customersDelta: '↑ 3.1% MoM',
    marketers: '52',
    marketersDelta: '4 onboarding',
    settlement: '98.2%',
    settlementDelta: '↑ 1.4% reconciled',
  },
};

export const cases = [
  { id: 'CS-4821', customerId: 'C-10478', type: 'Billing Dispute — February invoice', created: 'Mar 8', status: 'Open' },
  { id: 'CS-8824', customerId: 'C-10482', type: 'Billing dispute — Feb invoice', created: 'Mar 8', status: 'Open' },
];

export const timelineItems = [
  { title: 'Run March billing batch B-2026-0311', sub: 'Completed 8:14 AM · 2,847 invoices', done: true },
  { title: 'Review 3 billing exceptions', sub: 'Flagged by system · CAD $8,400 at risk', active: true },
  { title: 'Approve 4 new marketer onboarding files', sub: 'Due today · AltaEnergy, GreenPath + 2 more', pending: true },
  { title: 'Q1 settlement report to CFO', sub: 'Due March 15 · Emberlyn can draft', pending: true },
];

export const marketerPerf = [
  ['NRG Direct', '$841K', 92],
  ['PrairieEnergy', '$612K', 78],
  ['AltaGas Retail', '$482K', 61],
  ['GreenPath', '$389K', 49],
  ['Calgary Energy', '$220K', 28],
];
