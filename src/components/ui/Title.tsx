import ADIcon from '@/assets/icons/common/ad-14px.svg';

interface Props {
  text: string;
  adver?: boolean;
}

export default function Title({ text, adver = false }: Props) {
  return (
    <div className="mb-2 flex items-end justify-between">
      <h2 className="text-lg font-bold">{text}</h2>
      {adver && <ADIcon />}
    </div>
  );
}
