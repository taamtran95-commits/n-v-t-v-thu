import { useMenu } from '@/context/MenuContext';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: string;
  onChange: (slug: string) => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  const { categories } = useMenu();

  const allCategories = [
    { id: 'all', name: 'Tất cả', slug: 'all' },
    ...categories,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            selected === cat.slug
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
