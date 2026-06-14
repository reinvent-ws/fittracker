export const getDifficulty = (
  difficulty: string,
): { color: string; title: string } => {
  switch (difficulty) {
    case "beginner":
      return { color: "bg-green-400", title: "Iniciante" };
    case "intermediate":
      return { color: "bg-yellow-400", title: "Intermediário" };
    case "advanced":
      return { color: "bg-red-400", title: "Avançado" };
    default:
      return { color: "bg-gray-400", title: "Desconhecido" };
  }
};
