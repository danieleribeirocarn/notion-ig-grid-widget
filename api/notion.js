import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
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
      page_size: 30,
    });

    const items = response.results.map(page => {
      const files = page.properties["Profile Picture"]?.files || [];

      const images = files.map(f =>
        f.type === "file" ? f.file.url : f.external.url
      );

      return {
        id: page.id,
        images,
      };
    });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados do Notion" });
  }
}
