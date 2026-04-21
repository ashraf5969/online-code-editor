// @desc    Generate code using AI
// @route   POST /api/ai/generate
exports.generateCode = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, error: "Prompt is required" });

        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback agar API key module nahi dali hui
        if (!apiKey || apiKey === 'add_your_gemini_api_key_here') {
            return res.status(200).json({
                success: true,
                data: {
                    html: `<!-- AI Mock HTML for: ${prompt} -->\n<div class="ai-box">\n  <h1>AI is Connected!</h1>\n  <p>To get real AI code, please add your <b>GEMINI_API_KEY</b> in the backend/.env file.</p>\n</div>`,
                    css: "/* AI Mock CSS */\n.ai-box {\n  text-align: center;\n  padding: 50px;\n  background: #2b2b2b;\n  color: #5ce1e6;\n  font-family: sans-serif;\n  border-radius: 10px;\n}",
                    javascript: "// AI Mock JS\nconsole.log('AI feature is successfully connected to the frontend!');"
                }
            });
        }

        // Real Google Gemini API Call (Supports Node.js 18+ Native Fetch)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an expert code generator. Generate HTML, CSS, and JS for this request: "${prompt}". 
                        Return ONLY a raw JSON object with exactly three keys: "html", "css", and "javascript". 
                        Do not include code blocks formatting like \`\`\`json or \`\`\`. Start JSON with { and end with } directly.`
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log("Gemini API Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            return res.status(400).json({ success: false, error: data.error?.message || "AI API Error" });
        }

        let aiText = data.candidates[0].content.parts[0].text;
        console.log("Raw AI Text:", aiText);
        
        // Clean markdown formatting if AI unexpectedly adds it
        aiText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsedCode = JSON.parse(aiText);

        res.status(200).json({ success: true, data: parsedCode });

    } catch (error) {
        console.error("AI Generation Error Details:", error);
        
        let errorMessage = "Failed to generate code from AI.";
        if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('fetch failed')) {
            errorMessage = "Network Error: Cannot connect to Google AI server. (Check your internet or VPN)";
        }
        
        res.status(500).json({ success: false, error: errorMessage });
    }
};