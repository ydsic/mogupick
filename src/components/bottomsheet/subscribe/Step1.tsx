export default function Step1({
  productName,
  pricePerItem,
  quantity,
  total,
  increase,
  decrease,
  goNext,
}: {
  productName: string;
  pricePerItem: number;
  quantity: number;
  total: number;
  increase: () => void;
  decrease: () => void;
  goNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <div className="flex flex-col justify-between gap-3 rounded bg-gray-100 px-4 py-3">
        <span className="text-base font-medium">{productName}</span>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center text-base font-medium">
            <button className="rounded-tl rounded-bl bg-white px-3 py-1" onClick={decrease}>
              -
            </button>
            <span className="bg-white px-3 py-2 text-xs">{quantity}</span>
            <button className="rounded-tr rounded-br bg-white px-3 py-1" onClick={increase}>
              +
            </button>
          </div>
          <div className="text-lg font-medium">
            <span>{pricePerItem.toLocaleString()}</span>원
          </div>
        </div>
      </div>
      <p className="flex items-center justify-end gap-2 text-sm font-medium">
        총 합계
        <span className="text-lg font-semibold"> {total.toLocaleString()}원</span>
      </p>
      <button onClick={goNext} className="w-full rounded bg-black py-3 text-white">
        다음
      </button>
    </div>
  );
}
