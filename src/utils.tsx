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

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

/**
 * Formats duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string like "1h 23m 45s", "23m 45s", or "45s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    if (remainingSeconds > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m`;
    }
  }
}
