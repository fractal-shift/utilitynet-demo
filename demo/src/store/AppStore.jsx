import { createContext, useContext, useReducer } from 'react';
import {
  customers as initialCustomers,
  billingExceptions as initialExceptions,
  marketers as initialMarketers,
  settlementData as initialSettlement,
  timelineItems as initialTimeline,
  cases as initialCases,
} from '../data/demoData';

const billingBatches = [
  {
    id: 'B-2026-0311',
    period: 'March 2026',
    type: 'Residential + Industrial',
    invoices: 2847,
    total: '$1,841,233',
    exceptions: 3,
    status: 'In Review',
    runDate: 'Mar 11',
  },
];

const STORAGE_KEY = 'utilitynet-store';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initialState = {
  customers: initialCustomers,
  billingBatches,
  billingExceptions: initialExceptions,
  marketers: initialMarketers,
  settlementData: initialSettlement,
  timelineItems: initialTimeline,
  cases: initialCases,
  finance: {
    pendingJournalEntries: [],
    billingPostedAt: null,
  },
};

function mergePersisted(init, persisted) {
  if (!persisted) return init;
  return {
    ...init,
    customers: persisted.customers ?? init.customers,
    billingBatches: persisted.billingBatches ?? init.billingBatches,
    billingExceptions: persisted.billingExceptions ?? init.billingExceptions,
    marketers: persisted.marketers ?? init.marketers,
    settlementData: persisted.settlementData ?? init.settlementData,
    timelineItems: persisted.timelineItems ?? init.timelineItems,
    cases: persisted.cases ?? init.cases,
    finance: persisted.finance ?? init.finance,
  };
}

function getInitialState() {
  const persisted = loadPersisted();
  return mergePersisted(initialState, persisted);
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function nextCustomerId(customers) {
  const nums = customers.map((c) => parseInt(c.id.replace(/\D/g, ''), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 10482;
  return `C-${max + 1}`;
}

function nextMarketerId(marketers) {
  const nums = marketers.map((m) => parseInt(m.id.replace(/\D/g, ''), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 6;
  return `MKT-00${max + 1}`;
}

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'ADD_CUSTOMER':
      next = {
        ...state,
        customers: [...state.customers, action.payload],
      };
      break;
    case 'ADD_BILLING_BATCH':
      next = {
        ...state,
        billingBatches: [action.payload, ...state.billingBatches],
      };
      break;
    case 'RESOLVE_BILLING_EXCEPTION':
      next = {
        ...state,
        billingExceptions: state.billingExceptions.map((e) =>
          e.id === action.payload ? { ...e, status: 'Resolved' } : e
        ),
      };
      break;
    case 'RESOLVE_SETTLEMENT':
      next = {
        ...state,
        settlementData: state.settlementData.map((s) =>
          s.name === action.payload
            ? { ...s, status: 'Reconciled', commission: '$24,080' }
            : s
        ),
      };
      break;
    case 'ADD_MARKETER':
      next = {
        ...state,
        marketers: [...state.marketers, action.payload],
      };
      break;
    case 'UPDATE_TIMELINE_ITEM':
      next = {
        ...state,
        timelineItems: state.timelineItems.map((t, i) =>
          i === action.payload.index ? { ...t, ...action.payload.updates } : t
        ),
      };
      break;
    case 'UPDATE_CASE_STATUS':
      next = {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
      };
      break;
    case 'ADD_PENDING_JOURNAL_ENTRY':
      next = {
        ...state,
        finance: {
          ...state.finance,
          pendingJournalEntries: [...(state.finance?.pendingJournalEntries || []), action.payload],
        },
      };
      break;
    case 'POST_BILLING_TO_GL':
      next = {
        ...state,
        finance: {
          ...state.finance,
          billingPostedAt: action.payload,
        },
      };
      break;
    default:
      return state;
  }
  persist(next);
  return next;
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const addCustomer = (customer) => dispatch({ type: 'ADD_CUSTOMER', payload: customer });
  const addBillingBatch = (batch) => dispatch({ type: 'ADD_BILLING_BATCH', payload: batch });
  const resolveBillingException = (id) => dispatch({ type: 'RESOLVE_BILLING_EXCEPTION', payload: id });
  const resolveSettlement = (name) => dispatch({ type: 'RESOLVE_SETTLEMENT', payload: name });
  const addMarketer = (marketer) => dispatch({ type: 'ADD_MARKETER', payload: marketer });
  const updateTimelineItem = (index, updates) =>
    dispatch({ type: 'UPDATE_TIMELINE_ITEM', payload: { index, updates } });
  const updateCaseStatus = (id, status) =>
    dispatch({ type: 'UPDATE_CASE_STATUS', payload: { id, status } });
  const addPendingJournalEntry = (entry) =>
    dispatch({ type: 'ADD_PENDING_JOURNAL_ENTRY', payload: entry });
  const postBillingToGL = (date) =>
    dispatch({ type: 'POST_BILLING_TO_GL', payload: date });

  const actions = {
    addCustomer,
    addBillingBatch,
    resolveBillingException,
    resolveSettlement,
    addMarketer,
    updateTimelineItem,
    updateCaseStatus,
    addPendingJournalEntry,
    postBillingToGL,
    nextCustomerId: () => nextCustomerId(state.customers),
    nextMarketerId: () => nextMarketerId(state.marketers),
  };

  return (
    <AppStoreContext.Provider value={{ state, actions }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
