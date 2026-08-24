"""
ControlFlow AI — Machine Learning Anomaly Detection Service
Implements Isolation Forest, Z-Score, and Robust Interquartile Range (IQR) 
for identifying financial expenditure anomalies and fraudulent outflows.
"""

import json
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class FinancialAnomalyDetector:
    def __init__(self, contamination: float = 0.08, random_state: int = 42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=100,
            max_samples='auto'
        )
        self.scaler = StandardScaler()
        self.category_stats = {}

    def fit_and_predict(self, transactions_df: pd.DataFrame) -> pd.DataFrame:
        """
        Fits Isolation Forest on transaction amounts and category features,
        and computes multi-factor risk scores.
        """
        df = transactions_df.copy()
        
        # Filter expense transactions
        expense_mask = df['type'] == 'expense'
        expenses_df = df[expense_mask].copy()

        # Compute Category Baselines
        for cat, group in expenses_df.groupby('category'):
            amounts = group['amount'].values
            q1, q3 = np.percentile(amounts, [25, 75])
            iqr = q3 - q1
            self.category_stats[cat] = {
                'mean': float(np.mean(amounts)),
                'std': float(np.std(amounts)),
                'q1': float(q1),
                'q3': float(q3),
                'iqr': float(iqr),
                'iqr_upper': float(q3 + 1.5 * iqr)
            }

        # Feature Engineering for Isolation Forest
        expenses_df['log_amount'] = np.log1p(expenses_df['amount'])
        expenses_df['is_recurring_num'] = expenses_df['isRecurring'].astype(int)
        
        # Relative ratio against category mean
        def get_category_ratio(row):
            cat = row['category']
            stats = self.category_stats.get(cat, {'mean': 5000})
            mean = stats['mean'] if stats['mean'] > 0 else 5000
            return row['amount'] / mean

        expenses_df['cat_ratio'] = expenses_df.apply(get_category_ratio, axis=1)

        # Feature matrix
        X = expenses_df[['log_amount', 'is_recurring_num', 'cat_ratio']].values
        X_scaled = self.scaler.fit_transform(X)

        # Fit Isolation Forest
        self.model.fit(X_scaled)
        
        # Anomaly score: lower score = more abnormal; scikit-learn decision_function
        raw_scores = self.model.decision_function(X_scaled)
        # Normalize into [0, 1] range where 1 = highest anomaly risk
        min_score = np.min(raw_scores)
        max_score = np.max(raw_scores)
        score_range = max_score - min_score if max_score != min_score else 1.0
        normalized_anomaly_scores = 1.0 - ((raw_scores - min_score) / score_range)
        
        predictions = self.model.predict(X_scaled) # -1 for anomaly, 1 for normal

        expenses_df['ml_anomaly_score'] = np.round(normalized_anomaly_scores, 3)
        expenses_df['is_ml_anomaly'] = predictions == -1

        # Calculate Z-Scores
        def calc_zscore(row):
            cat = row['category']
            stats = self.category_stats.get(cat, {'mean': 5000, 'std': 2500})
            std = stats['std'] if stats['std'] > 0 else 1000
            return (row['amount'] - stats['mean']) / std

        expenses_df['z_score'] = np.round(expenses_df.apply(calc_zscore, axis=1), 2)

        # Determine Risk Tier
        def assign_risk(row):
            z = row['z_score']
            ml_score = row['ml_anomaly_score']
            cat = row['category']
            amt = row['amount']
            
            if ml_score > 0.85 or z > 3.0 or (cat == 'Cloud Infrastructure' and amt > 25000):
                return 'critical'
            elif ml_score > 0.70 or z > 2.0 or amt > 35000:
                return 'high'
            elif ml_score > 0.50 or z > 1.5:
                return 'medium'
            return 'low'

        expenses_df['assigned_risk'] = expenses_df.apply(assign_risk, axis=1)

        # Merge back with full dataframe
        df = df.merge(
            expenses_df[['id', 'ml_anomaly_score', 'z_score', 'assigned_risk']],
            on='id',
            how='left'
        )
        df['ml_anomaly_score'] = df['ml_anomaly_score'].fillna(0.05)
        df['z_score'] = df['z_score'].fillna(0.0)
        df['assigned_risk'] = df['assigned_risk'].fillna('low')

        return df

if __name__ == '__main__':
    sample_data = [
        {"id": "tx-001", "merchant": "AWS", "category": "Cloud Infrastructure", "amount": 28450.0, "type": "expense", "isRecurring": True},
        {"id": "tx-002", "merchant": "Apex Global Logistics", "category": "Operations", "amount": 12800.0, "type": "expense", "isRecurring": False},
        {"id": "tx-003", "merchant": "Meta Ads", "category": "Marketing", "amount": 42500.0, "type": "expense", "isRecurring": True},
        {"id": "tx-004", "merchant": "Synthesia AI", "category": "Software & Subscriptions", "amount": 9900.0, "type": "expense", "isRecurring": False},
        {"id": "tx-005", "merchant": "Lufthansa Airlines", "category": "Travel & Entertainment", "amount": 3450.0, "type": "expense", "isRecurring": False},
        {"id": "tx-008", "merchant": "Gusto Payroll", "category": "Payroll & Benefits", "amount": 86400.0, "type": "expense", "isRecurring": True},
        {"id": "tx-010", "merchant": "Salesforce CRM", "category": "Software & Subscriptions", "amount": 14500.0, "type": "expense", "isRecurring": True},
        {"id": "tx-013", "merchant": "Datadog", "category": "Cloud Infrastructure", "amount": 6800.0, "type": "expense", "isRecurring": True},
    ]

    df = pd.DataFrame(sample_data)
    detector = FinancialAnomalyDetector(contamination=0.25)
    results = detector.fit_and_predict(df)
    
    print("\n=== ControlFlow AI: Isolation Forest Anomaly Detection Results ===")
    print(results[['id', 'merchant', 'amount', 'z_score', 'ml_anomaly_score', 'assigned_risk']].to_string(index=False))
