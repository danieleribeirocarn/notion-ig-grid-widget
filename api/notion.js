import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 5,
    });

    res.status(200).json(response.results);
  } catch (error) {
    console.error("ERRO REAL:", error);
    res.status(500).json({
      message: "Erro no backend",
      error: error.message,
    });
  }
}
