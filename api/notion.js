import { Client } from "@notionhq/client";

// ================================
// CONFIGURAÇÕES
// ================================
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const LIMITE = 30;

// ================================
// HANDLER
// ================================
export default async function handler(req, res) {
  try {
    if (!DATABASE_ID) {
      return res.status(500).json({ error: "DATABASE_ID não configurado" });
    }

    // ================================
    // QUERY NO NOTION
    // ================================
    const response = await notion.databases.query({
      database_id: DATABASE_ID,

      // 👉 FILTRO: só aparece se "Mostrar" estiver marcado
      filter: {
        property: "Mostrar",
        checkbox: {
          equals: true,
        },
      },

      // 👉 ORDENAR (opcional, mas recomendado)
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    // ================================
    // TRATAMENTO DOS DADOS
    // ================================
    let posts = response.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,

        title:
          props.Nome?.title?.[0]?.plain_text || "",

        caption:
          props.Legenda?.rich_text?.[0]?.plain_text || "",

        date:
          props.Date?.date?.start || "",

        status:
          props.Status?.select?.name || "",

        image:
          props.Imagem?.files?.[0]?.file?.url ||
          props.Imagem?.files?.[0]?.external?.url ||
          "",

        show:
          props.Mostrar?.checkbox || false,
      };
    });

    // ================================
    // FILTROS DE SEGURANÇA
    // ================================
    posts = posts
      .filter((post) => post.image) // garante que só vem com imagem
      .slice(0, LIMITE); // limita a 30

    // ================================
    // RESPOSTA
    // ================================
    res.status(200).json(posts);
  } catch (error) {
    console.error("Erro Notion API:", error);
    res.status(500).json({
      error: "Erro ao buscar dados do Notion",
      details: error.message,
    });
  }
}
