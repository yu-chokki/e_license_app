import type { Tag } from '../types';

type Props = {
  tags: Tag[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
};

export default function TagSelector({ tags, selected, onChange }: Props) {
  // Group eligible tags by ancestor (last ancestor = category)
  const eligibleTags = tags.filter((t) => t.eligible);
  const categories = Array.from(
    new Set(eligibleTags.map((t) => t.ancestors[t.ancestors.length - 2] ?? t.ancestors[0]))
  );

  const toggle = (tagId: string) => {
    const next = new Set(selected);
    if (next.has(tagId)) {
      next.delete(tagId);
    } else {
      next.add(tagId);
    }
    onChange(next);
  };

  const toggleCategory = (category: string) => {
    const categoryTags = eligibleTags.filter(
      (t) => (t.ancestors[t.ancestors.length - 2] ?? t.ancestors[0]) === category
    );
    const allSelected = categoryTags.every((t) => selected.has(t.id));
    const next = new Set(selected);
    categoryTags.forEach((t) => {
      if (allSelected) {
        next.delete(t.id);
      } else {
        next.add(t.id);
      }
    });
    onChange(next);
  };

  const selectAll = () => {
    onChange(new Set(eligibleTags.map((t) => t.id)));
  };

  const clearAll = () => {
    onChange(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={selectAll}
          className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200"
        >
          すべて選択
        </button>
        <button
          onClick={clearAll}
          className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
        >
          クリア
        </button>
        <span className="ml-auto text-xs text-gray-500">{selected.size} タグ選択中</span>
      </div>

      {categories.map((category) => {
        const categoryTags = eligibleTags.filter(
          (t) => (t.ancestors[t.ancestors.length - 2] ?? t.ancestors[0]) === category
        );
        const allSelected = categoryTags.every((t) => selected.has(t.id));
        const someSelected = categoryTags.some((t) => selected.has(t.id));

        return (
          <div key={category} className="bg-gray-50 rounded-xl p-3 space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 w-full text-left"
            >
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  allSelected
                    ? 'bg-indigo-500 border-indigo-500'
                    : someSelected
                    ? 'bg-indigo-200 border-indigo-400'
                    : 'border-gray-300'
                }`}
              >
                {(allSelected || someSelected) && (
                  <span className="text-white text-xs leading-none">
                    {allSelected ? '✓' : '–'}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-gray-700">{category}</span>
            </button>

            <div className="flex flex-wrap gap-2 pl-6">
              {categoryTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggle(tag.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selected.has(tag.id)
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
