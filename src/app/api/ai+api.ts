import OpenAi from "openai";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { exerciseName } = await request.json();

    if (!exerciseName) {
      return Response.json(
        { error: "Nome do exercício é necessário." },
        { status: 400 }, // Alterado para 400 (Bad Request) que é o mais adequado aqui
      );
    }

    const prompt = `
    Você é um instrutor de fitness.

    Você recebeu um exercício; forneça instruções claras sobre como executá-lo. Inclua se algum equipamento é necessário.

    Explique o exercício em detalhes e inclua uma dica.

    O nome do exercício é: ${exerciseName}

    Seja breve e conciso. Use formatação Markdown.

    Use o seguinte formato:

    ## Equipamentos Necessários

    ## Instruções

    ## Dicas

    ## Variações

    ## Segurança

    Mantenha o espaçamento entre os títulos e o conteúdo.

    Sempre use titles e subtitles.
    `;

    // 1. Faz a chamada real para a API da OpenAI utilizando o modelo gpt-4o-mini (ou gpt-4o)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // 2. Extrai o texto gerado pela inteligência artificial
    const aiResponse = completion.choices[0].message.content;

    // 3. RETORNA A RESPOSTA (Isso corrige o erro do seu terminal!)
    return Response.json({ data: aiResponse });
  } catch (error: any) {
    console.error("Erro interno na rota da AI:", error);
    return Response.json(
      {
        error: "Erro interno ao processar a requisição com a AI.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
