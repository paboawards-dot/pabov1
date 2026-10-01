import { Check, X } from "lucide-react";

type Props = { status: "success" | "failed" };

// Icône de confirmation (cf. Bloc Composants > StatusIcon).
// Or pour succès, gris neutre pour échec — jamais rouge alarmant (règle Bloc Pages 1.6).
export default function StatusIcon({ status }: Props) {
  const isSuccess = status === "success";
  return (
    <div
      className="h-20 w-20 rounded-full flex items-center justify-center mx-auto"
      style={{ backgroundColor: isSuccess ? "#D4A63A" : "#3a3330" }}
    >
      {isSuccess ? (
        <Check size={40} className="text-pabo-bg" />
      ) : (
        <X size={40} className="text-pabo-muted" />
      )}
    </div>
  );
}
