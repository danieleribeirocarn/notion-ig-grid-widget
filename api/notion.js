import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,

      filter: {
        property: "Mostrar",
        checkbox: {
          equals: true,
        },
      },

      sorts: [
        {
          property: "Data da postagem",
          direction: "descending",
        },
      ],

      page_size: 30, // 🔹 limite total
    });

    const posts = response.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        title:
          props.Name?.title?.[0]?.plain_text || "Sem título",

        caption:
          props.Text?.rich_text?.[0]?.plain_text || "",

        date:
          props["Data da postagem"]?.date?.start || null,

        status:
          props.Status?.status?.name || "",

        image:
          props["Profile Picture"]?.files?.[0]?.file?.url ||
          props["Profile Picture"]?.files?.[0]?.external?.url ||
          null,

        show:
          props["Mostrar "]?.checkbox || false,
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("ERRO NOTION API:", error);
    res.status(500).json({
      message: "Erro ao buscar dados do Notion",
      error: error.message,
    });
  }
}
