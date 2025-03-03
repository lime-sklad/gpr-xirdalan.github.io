export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Разрешить запросы от всех доменов
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Метод не поддерживается" });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Храним в переменных среды
    const REPO_OWNER = "gpr-xirdalan";
    const REPO_NAME = "order";
    const FILE_PATH = "order.json";

    try {
        // **1. Получаем order.json**
        let response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (!response.ok) throw new Error("Ошибка при получении order.json");

        let data = await response.json();
        let existingOrders = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));

        // **2. Добавляем новый заказ**
        const newOrder = req.body;
        existingOrders.push(newOrder);

        // **3. Кодируем JSON в base64**
        let updatedContent = Buffer.from(JSON.stringify(existingOrders, null, 2)).toString("base64");

        // **4. Обновляем order.json через GitHub API**
        response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Добавлен новый заказ",
                content: updatedContent,
                sha: data.sha // SHA нужен для обновления файла
            })
        });

        if (!response.ok) throw new Error("Ошибка при обновлении order.json");

        return res.status(200).json({ message: "Заказ сохранён!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
