import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,

      // 🔹 filtro: só itens marcados em "Mostrar"
      filter: {
        property: "Mostrar",
        checkbox: {
          equals: true,
        },
      },

      // 🔹 ordenação pela data
      sorts: [
        {
          property: "Data da postagem",
          direction: "descending",
        },
      ],

      page_size: 30, // 10 linhas de 3 colunas
    });

    const posts = response.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,

        image:
          props["Profile Picture"]?.files?.[0]?.file?.url ||
          props["Profile Picture"]?.files?.[0]?.external?.url ||
          null,

        caption:
          props.Text?.rich_text?.[0]?.plain_text || "",
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erro Notion API:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
}
