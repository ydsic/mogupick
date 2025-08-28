interface Props {
  text: string;
  adver?: boolean;
}

export default function Title({ text, adver = false }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold">{text}</h2>
      {adver && (
        <span className="rounded-2xl border border-black px-2 text-sm font-semibold">광고</span>
      )}
    </div>
  );
}
