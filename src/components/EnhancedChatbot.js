import React, { useState, useEffect, useRef } from 'react';
import { useMsal } from '@azure/msal-react';

function EnhancedChatbot({ userRole, tenantId }) {
  const { instance, accounts } = useMsal();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your CYPROSECURE 360 AI assistant. I can help you with:\n\n🔒 Security Questions\n💼 Microsoft 365 Issues\n🛠️ Tier 1 Help Desk Support\n🛡️ Defender & Sentinel Insights\n\nHow can I assist you today?"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Build enhanced system prompt with security knowledge
  const buildSystemPrompt = (userQuery) => {
    return `You are the CYPROSECURE 360 AI Assistant, an expert cybersecurity and IT support chatbot with deep knowledge of:

# YOUR EXPERTISE:
1. **Microsoft 365 Security** - Defender, Sentinel, Intune, Azure AD
2. **Tier 1 Help Desk** - Common IT issues, password resets, MFA, device setup
3. **Security Best Practices** - Phishing, malware, compliance, incident response
4. **Network Security** - Firewalls, VPNs, endpoint protection

# HELP DESK KNOWLEDGE BASE:

## Password & MFA Issues:
- **Password Reset**: Guide user to portal.office.com → Security Info → Change Password
- **MFA Setup**: Install Microsoft Authenticator app → Security Info → Add method
- **MFA Not Working**: Try "I have a code instead" or contact admin for bypass
- **Locked Account**: Wait 30 mins or contact admin for unlock

## Microsoft 365 Common Issues:
- **Outlook Not Syncing**: Check internet → Sign out/in → Clear cache → Restart app
- **Teams Call Issues**: Check microphone permissions → Update Teams → Test in web version
- **OneDrive Not Syncing**: Restart OneDrive → Check storage quota → Re-link account
- **Can't Access SharePoint**: Check permissions → Clear browser cache → Try incognito mode

## Security Incidents:
- **Phishing Email**: Don't click links → Report as phishing → Delete immediately
- **Ransomware Suspected**: Disconnect from network → Don't pay ransom → Contact IT immediately
- **Compromised Account**: Change password immediately → Enable MFA → Review recent activity
- **Malware Detected**: Don't ignore → Run full Defender scan → Isolate device if needed

## Device Issues:
- **Slow Computer**: Check Defender scan running → Close unused apps → Restart device
- **Can't Connect to VPN**: Check credentials → Update VPN client → Check network connection
- **Printer Not Working**: Check connection → Restart printer → Update drivers

# RESPONSE STYLE:
- Be concise and actionable
- Use emojis for clarity (🔒 security, ✅ success, ⚠️ warning, 🛠️ technical)
- Provide step-by-step instructions when needed
- If issue requires escalation, say so clearly
- Always be professional and helpful

# USER QUERY:
${userQuery}

Provide a helpful, professional response.`;
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Build enhanced system prompt with security context
      const systemPrompt = buildSystemPrompt(userInput);

      // Call Claude API with enhanced context
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            ...chatMessages.filter(m => m.role !== 'system'),
            newMessage
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.content[0].text
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please try again or contact your IT administrator if the issue persists.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "🔐 How do I reset my password?",
    "📧 I received a suspicious email",
    "💻 My Outlook isn't syncing",
    "🔒 How do I enable MFA?",
    "🛡️ Run a security scan",
    "⚠️ My account was compromised"
  ];

  const handleSuggestedQuestion = (question) => {
    setUserInput(question);
  };

  return (
    <div className={`chatbot-widget ${chatOpen ? 'open' : ''}`}>
      {chatOpen ? (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="bot-icon">🤖</span>
              <span>CYPROSECURE AI Assistant</span>
            </div>
            <button className="chatbot-close" onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {chatMessages.length <= 2 && (
            <div className="suggested-questions">
              <div className="suggestions-label">Quick Help:</div>
              <div className="suggestions-grid">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    className="suggestion-btn"
                    onClick={() => handleSuggestedQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input" onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !userInput.trim()}>
              ➤
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setChatOpen(true)}>
          <span className="bot-icon-large">🤖</span>
          <span className="chat-label">Need Help?</span>
        </button>
      )}
    </div>
  );
}

export default EnhancedChatbot;
