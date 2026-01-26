import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryForm } from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import {
  useCategories,
  useDeleteCategory,
  Category,
} from "@/hooks/useCategories";
import { Plus, MoreVertical, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Categories() {
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const handleCloseForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditCategory(null);
  };

  const incomeCategories = categories?.filter((c) => c.type === "income") || [];
  const expenseCategories =
    categories?.filter((c) => c.type === "expense") || [];

  const CategoryList = ({
    items,
    type,
  }: {
    items: Category[];
    type: "income" | "expense";
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {type === "income" ? (
          <TrendingUp className="h-4 w-4 text-income" />
        ) : (
          <TrendingDown className="h-4 w-4 text-expense" />
        )}
        {type === "income" ? "Entradas" : "Despesas"}
      </div>
      {items.length > 0 ? (
        items.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3 transition-all hover:bg-card animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(category)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteCategory.mutate(category.id)}
                  className="text-destructive"
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      ) : (
        <p className="py-2 text-sm text-muted-foreground">
          Nenhuma categoria de {type === "income" ? "entrada" : "despesa"}
        </p>
      )}
    </div>
  );

  return (
    <PageLayout title="Categorias" subtitle="Organize suas transações">
      <div className="space-y-6">
        <Button
          onClick={() => setFormOpen(true)}
          className="w-full gradient-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <div className="space-y-6">
            <CategoryList items={incomeCategories} type="income" />
            <CategoryList items={expenseCategories} type="expense" />
          </div>
        )}
      </div>

      <CategoryForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        editCategory={editCategory}
      />
    </PageLayout>
  );
}
