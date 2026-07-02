import { adminClient } from "@/lib/sanity/client";

export async function POST(request: Request) {
  try {
    const { workoutId } = await request.json();

    if (!workoutId) {
      return Response.json(
        { success: false, error: "ID do treino não fornecido." },
        { status: 400 },
      );
    }

    // 1. Deleta o documento publicado principal
    await adminClient.delete(workoutId);

    // 2. Garante que se houver um rascunho (Draft), ele também seja deletado
    const draftId = `drafts.${workoutId}`;
    await adminClient.delete(draftId);

    console.log(
      "Treino e rascunhos excluídos com sucesso no Sanity:",
      workoutId,
    );

    return Response.json({
      success: true,
      message: "Treino excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro interno ao excluir o treino:", error);
    return Response.json(
      { success: false, error: "Falha ao deletar o treino no servidor." },
      { status: 500 },
    );
  }
}
