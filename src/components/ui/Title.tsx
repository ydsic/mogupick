import ADIcon from '@/assets/icons/common/ad-14px.svg';

interface Props {
  text: string;
  adver?: boolean;
}

export default function Title({ text, adver = false }: Props) {
  return (
    <div className="mb-4 flex items-end justify-between text-[var(--color-text-primary)]">
      <h2 className="text-lg font-bold">{text}</h2>
      {adver && <ADIcon />}
    </div>
  );
}
