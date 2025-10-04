import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function getImmigrationGuidance(userQuestion: string): Promise<string> {
  if (!genAI) {
    return getFallbackResponse(userQuestion);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert immigration assistant. Your role is to help people understand immigration processes in clear, simple language.

User's question: ${userQuestion}

Please provide:
1. A clear explanation of their situation
2. Available options and pathways
3. Key requirements or steps
4. Important deadlines or considerations
5. Any warnings or things to be aware of

Keep your response practical, empathetic, and easy to understand. Avoid legal jargon where possible. If you mention technical terms, explain them simply.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || getFallbackResponse(userQuestion);
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(userQuestion);
  }
}

function getFallbackResponse(userQuestion: string): string {
  const lowerQuestion = userQuestion.toLowerCase();

  if (lowerQuestion.includes('student visa') || lowerQuestion.includes('f-1')) {
    return `**Student Visa Guidance**

If your student visa (F-1) is expiring, you have several options:

**Option 1: Optional Practical Training (OPT)**
• Work authorization for up to 12 months (36 months for STEM)
• Must be related to your field of study
• Apply 90 days before graduation, up to 60 days after

**Option 2: H-1B Sponsorship**
• Requires employer sponsorship
• Apply during annual lottery (March/April)
• 3-year initial period, renewable

**Option 3: Continue Education**
• Enroll in graduate program
• Extends F-1 status
• Must be full-time student

**Important Timeline:**
• Start planning 6-12 months before visa expires
• OPT: Apply during 90-day window
• H-1B: Register in March for October start

**Next Steps:**
1. Check your I-20 expiration date
2. Speak with your school's international office
3. Research employers who sponsor H-1B
4. Consider grad school options

Would you like more details about any specific option?`;
  }

  if (lowerQuestion.includes('h-1b') || lowerQuestion.includes('work visa')) {
    return `**H-1B Work Visa Information**

The H-1B is the most common work visa for skilled professionals:

**Requirements:**
• Bachelor's degree (or equivalent)
• Job offer in specialty occupation
• Employer sponsorship
• Prevailing wage compliance

**Process:**
1. Employer files petition
2. Enter lottery (March registration)
3. If selected, full petition filed
4. Processing takes 3-6 months
5. Start work October 1st

**Key Points:**
• Limited to 85,000 visas yearly
• Selection is by lottery
• Advanced degree holders have advantage
• Can stay up to 6 years initially

**Your Options:**
• Find H-1B sponsoring employer
• Consider cap-exempt employers (universities, nonprofits)
• Use OPT while waiting for lottery
• Look into other work visa categories (O-1, L-1, E-2)

**Timeline:**
• March 1-17: Registration period
• April: Lottery results
• October 1: Earliest start date

Need help with employer search or alternative visa options?`;
  }

  return `**Immigration Assistance**

I'm here to help you navigate the immigration process. Based on your question, here's what you should know:

**Common Pathways:**

**Work-Based:**
• H-1B (specialty occupation)
• L-1 (intracompany transfer)
• O-1 (extraordinary ability)
• Employment-based green card

**Student/Exchange:**
• F-1 (student visa)
• J-1 (exchange visitor)
• OPT (work after studies)

**Family-Based:**
• Spouse/parent sponsorship
• Family preference categories

**General Steps:**
1. Identify which category fits your situation
2. Understand eligibility requirements
3. Gather required documents
4. File appropriate forms
5. Attend interview (if required)
6. Maintain legal status throughout

**Important Tips:**
✓ Start early - immigration takes time
✓ Keep all documents organized
✓ Never overstay your current visa
✓ Consider consulting an immigration attorney
✓ Check official USCIS website for updates

Can you tell me more about your specific situation so I can provide more targeted guidance? For example:
• What's your current status?
• What are your goals?
• What's your timeline?`;
}
