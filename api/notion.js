const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

module.exports = async function handler(req, res) {
  try {
    if (!DATABASE_ID) {
      return res.status(400).json({
        error: "NOTION_DATABASE_ID não configurado",
      });
    }

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
      page_size: 30, // ✅ LIMITE DE 30 ITENS
    });

    const posts = response.results.map((page) => {
      const files =
        page.properties["Profile Picture"]?.files || [];

      const images = files
        .map((file) => {
          if (file.type === "file") return file.file.url;
          if (file.type === "external") return file.external.url;
          return null;
        })
        .filter(Boolean);

      return {
        id: page.id,
        images, // 🔁 array → carrossel
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar dados do Notion:", error);
    res.status(500).json({
      error: "Erro ao buscar dados do Notion",
    });
  }
};
