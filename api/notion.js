export default async function handler(req, res) {
  const response = await fetch(
    "https://api.notion.com/v1/databases/DATABASE_ID/query",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sorts: [
          { property: "Data da postagem", direction: "ascending" }
        ]
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
