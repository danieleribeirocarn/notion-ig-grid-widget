import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,

      // 🔹 FILTRO: só o que estiver marcado em "Mostrar"
      filter: {
        property: "Mostrar",
        checkbox: {
          equals: true,
        },
      },

      // 🔹 ORDENAÇÃO: mais recentes primeiro
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

        image
