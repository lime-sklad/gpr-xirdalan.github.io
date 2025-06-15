const GITHUB_TOKEN = ""; 
const REPO_OWNER = "gpr-xirdalan";
const REPO_NAME = "gpr-xirdalan.github.io";
const FILE_PATH = "order.json";
let order = [];

function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

async function saveOrder(order) {
    try {
        // **1. Получаем order.json**
        let response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (!response.ok) throw new Error("Ошибка при получении order.json");

        let data = await response.json();
        let existingOrders = JSON.parse(atob(data.content)); // Декодируем base64

        // **2. Добавляем новый заказ**
        existingOrders.push(order);

        // **3. Кодируем JSON в base64**
        let updatedContent = encodeBase64(JSON.stringify(existingOrders, null, 2));

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

        console.log("Заказ сохранён!");
    } catch (error) {
        console.error("Ошибка:", error);
    }
}




