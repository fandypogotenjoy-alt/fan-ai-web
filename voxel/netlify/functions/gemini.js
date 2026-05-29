exports.handler = async function(event, context) {
    // Hanya izinkan metode POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Mengambil API Key dari Environment Variable Netlify
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // Mengambil pesan yang dikirim dari web Fandy
    const body = JSON.parse(event.body);
    const userText = body.text;

    try {
        // Menghubungi Google Gemini dari server (URL dipastikan utuh 1 baris)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await response.json();
        
        // Mengembalikan jawaban dari AI ke web
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