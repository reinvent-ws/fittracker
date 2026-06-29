import { adminClient } from "@/lib/sanity/client";

export async function POST(request: Request) {
  const { workoutId }: { workoutId: string } = await request.json();

  try {
    await adminClient.delete(workoutId as string);

    console.log("Treino excluído com sucesso:", workoutId);

    return Response.json({
      success: true,
      message: "Treino excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao salvar o treino:", error);
    return Response.json(
      { error: "Falha ao salvar o treino" },
      { status: 500 },
    );
  }
}
