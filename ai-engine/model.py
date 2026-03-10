import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

def train_model():
    # Generate synthetic data for training
    import numpy as np
    np.random.seed(42)
    
    n_samples = 1000
    attendance = np.random.uniform(40, 100, n_samples)
    marks = np.random.uniform(30, 100, n_samples)
    assignments = np.random.uniform(20, 100, n_samples)
    participation = np.random.uniform(10, 100, n_samples)
    
    # Calculate SSIS to determine risk labels
    ssis = (0.30 * attendance) + (0.40 * marks) + (0.20 * assignments) + (0.10 * participation)
    
    # Labels: 0 = Low Risk (SSIS >= 80), 1 = Medium Risk (60 <= SSIS < 80), 2 = High Risk (SSIS < 60)
    labels = []
    for score in ssis:
        if score >= 80:
            labels.append(0)
        elif score >= 60:
            labels.append(1)
        else:
            labels.append(2)
            
    df = pd.DataFrame({
        'attendance_percentage': attendance,
        'average_marks': marks,
        'assignment_completion_rate': assignments,
        'participation_score': participation,
        'risk_level': labels
    })
    
    X = df.drop('risk_level', axis=1)
    y = df['risk_level']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print(f"Model Accuracy: {model.score(X_test, y_test):.2f}")
    
    # Save the model
    joblib.dump(model, 'student_risk_model.pkl')
    print("Model saved to student_risk_model.pkl")

if __name__ == "__main__":
    train_model()
