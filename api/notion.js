export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar dados do Notion",
      details: error.message
    });
  }
}
