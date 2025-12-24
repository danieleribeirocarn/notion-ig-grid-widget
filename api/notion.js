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

    const posts = data.results.map((page) => {
      return {
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || "",
        caption: page.properties.Text?.rich_text[0]?.plain_text || "",
        date: page.properties["Data da postagem"]?.date?.start || "",
        status: page.properties.Status?.status?.name || "",
        image:
          page.properties["Profile Picture"]?.files[0]?.file?.url || "",
        show: page.properties["Mostrar "]?.checkbox ?? true
      };
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar dados do Notion",
      details: error.message
    });
  }
}
