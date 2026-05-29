exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const body = JSON.parse(event.body);
    const userText = body.text;

    try {
        // Menggunakan model generasi terbaru yang terbukti didukung oleh API Key kamu
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gagal terhubung ke AI" })
        };
    }
};
