type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

// Chip de filtre utilisé sur Classement général (cf. Bloc Composants > FilterChip).
export default function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 h-8 px-3.5 rounded-full text-xs whitespace-nowrap ${
        active ? "bg-pabo-gold text-pabo-bg" : "border border-pabo-border text-pabo-muted"
      }`}
    >
      {label}
    </button>
  );
}
