exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        // Trik Hack: Kita panggil API Google untuk mendaftar semua model yang tersedia
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const listData = await listResponse.json();

        let modelNames = "Tidak dapat mengambil daftar model.";
        
        if (listData && listData.models) {
            // Kita saring hanya model yang bisa dipakai untuk chat (generateContent)
            const availableModels = listData.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace('models/', '')); // Hapus kata 'models/' agar bersih
            
            modelNames = availableModels.join(", ");
        }

        // Kita bungkus hasilnya dengan format balasan chat AI
        // Supaya daftar modelnya langsung muncul di layar chat-mu!
        return {
            statusCode: 200,
            body: JSON.stringify({
                candidates: [{
                    content: {
                        parts: [{
                            text: "🤖 HASIL SCAN SERVER GOOGLE:\n\nModel yang diizinkan untuk API Key kamu adalah:\n" + modelNames + "\n\nSilakan pilih salah satu dari nama di atas, dan beri tahu aku!"
                        }]
                    }
                }]
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gagal terhubung ke AI" })
        };
    }
};
