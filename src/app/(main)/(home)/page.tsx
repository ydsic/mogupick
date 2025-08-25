import Header from './_components/Header';

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="min-h-0 flex-1 space-y-8 bg-amber-300">내용 컨텐츠 children</div>
    </div>
  );
}
