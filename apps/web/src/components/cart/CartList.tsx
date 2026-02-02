import CartItem from "./CartItem";

type CartItemData = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string | null;
};

type CartListProps = {
  items: CartItemData[];
  onRemove: (id: number) => void;
  onQtyChange: (id: number, qty: number) => void;
  format: (value: number) => string;
};

export default function CartList({ items, onRemove, onQtyChange, format }: CartListProps) {
  return (
    <section className="rounded-[20px] border border-black/10 p-4 sm:p-6">
      {items.map((item, index) => (
        <div key={item.id}>
          <CartItem item={item} onRemove={onRemove} onQtyChange={onQtyChange} format={format} />
          {index !== items.length - 1 && <div className="my-4 h-px bg-black/10" />}
        </div>
      ))}
    </section>
  );
}
