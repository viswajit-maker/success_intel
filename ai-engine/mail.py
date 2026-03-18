from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import resend

API_KEY_1 = "re_GrBBRmaE_6qGMjkM13qxgj116NT2hxbow"
API_KEY_2 = "re_CDCsbcCx_Ens7Gkq8DiXqvGtHFRibJqxm"

resend.api_key = API_KEY_1
resend.api_key = API_KEY_2
try:
    r_2 = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": "sudharshan.dinesh07@gmail.com",
        "subject": "Hello World",
        "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
    })
    print("Startup email (Account 2) sent successfully")
except Exception as e:
    print("Startup email (Account 2) failed:", e)

# Reset to primary key for the API
resend.api_key = API_KEY_1


app = FastAPI(title="Student Risk Prediction API")

# Load the trained model
try:
    model = joblib.load('student_risk_model.pkl')
except FileNotFoundError:
    model = None
    print("Warning: Model not found. Please run model.py first.")

class StudentData(BaseModel):
    student_name: str
    student_email: str
    attendance_percentage: float
    average_marks: float
    assignment_completion_rate: float
    participation_score: float

@app.post("/predict-risk")
def predict_risk(data: StudentData):
    if model is None:
        return {"error": "Model not loaded"}
        
    features = np.array([[
        data.attendance_percentage,
        data.average_marks,
        data.assignment_completion_rate,
        data.participation_score
    ]])
    
    prediction = model.predict(features)[0]
    
    risk_mapping = {
        0: "Low Risk",
        1: "Medium Risk",
        2: "High Risk"
    }

    risk_text = risk_mapping.get(prediction, "Unknown")

    if prediction == 2:
        
        try:
            resend.api_key = API_KEY_1
            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": [data.student_email, "aivexus6@gmail.com", "viswajit0412@gmail.com"],
                "subject": "Academic Performance Notice",
                "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #334155; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e293b; margin-bottom: 16px;">Academic Performance Notice</h2>
          <p>Dear {data.student_name},</p>
          <p>Our system has detected low attendance, lower test scores, incomplete assignments, and limited participation. This has reduced your overall performance level.</p>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">SSIS score is at HIGH RISK (Sent via Account 1)</p>
          </div>
          <p>Please attend classes regularly, submit assignments on time, prepare well for exams, and participate actively in class.</p>
          <p>We are here to support your improvement.</p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold;">Academic Support Team</p>
            <p style="margin: 2px 0 0 0;">ERP Portal</p>
          </div>
        </div>
      """
            })
            print("Alert sent via Account 1")
        except Exception as e:
            print("Email sending failed (Account 1):", e)

      
        try:
            resend.api_key = API_KEY_2
            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": ["sudharshan.dinesh07@gmail.com", "sreemans048@gmail.com"],
                "subject": "High Academic Risk Alert (Support Copy)",
                "html": f"<h2>High Risk Detected for {data.student_name}</h2><p>Student Email: {data.student_email}</p><p>Please review immediately.</p>"
            })
            print("Alert sent via Account 2")
        except Exception as e:
            print("Email sending failed (Account 2):", e)
        
        
        resend.api_key = API_KEY_1

    return {
        "prediction": risk_text,
        "risk_code": int(prediction)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
