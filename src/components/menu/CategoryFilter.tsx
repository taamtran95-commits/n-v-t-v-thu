import { CategorySlug, categories } from '@/data/menu';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: CategorySlug;
  onChange: (slug: CategorySlug) => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => (
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
          <span>{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
