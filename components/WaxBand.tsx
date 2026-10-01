// Bandeau décoratif en filet fin, motif wax (cf. Identité visuelle du cahier des charges).
// Jamais en fond plein — uniquement ce filet de séparation.
export default function WaxBand() {
  const segments = ["#6E1E1E", "#D4A63A", "#F5F0E6", "#D4A63A", "#6E1E1E", "#D4A63A", "#F5F0E6", "#D4A63A"];
  return (
    <div className="flex h-1 w-full">
      {segments.map((color, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}
