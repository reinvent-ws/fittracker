import { adminClient } from "@/lib/sanity/client";

export interface WorkoutData {
  _type: string;
  userId: string | any;
  userName: string | any;
  date: string;
  duration: number;
  exercises: {
    _type: string;
    _key: string;
    exercise: {
      _type: string;
      _ref: string;
    };
    sets: {
      _type: string;
      _key: string;
      reps: number;
      weight: number;
      weightUnit: "lbs" | "kg";
    }[];
  }[];
}

export async function POST(request: Request) {
  const { workoutData }: { workoutData: WorkoutData } = await request.json();

  try {
    // Save to Sanity using admin client
    const result = await adminClient.create(workoutData);

    console.log("Treino salvo com sucesso: ", result);

    return Response.json({
      success: true,
      workoutId: result._id,
      message: "Treino salvo com sucesso",
    });
  } catch (error) {
    console.error("Erro ao salvar o treino: ", error);
    return Response.json(
      { error: "Falha ao salvar o treino" },
      { status: 500 },
    );
  }
}
