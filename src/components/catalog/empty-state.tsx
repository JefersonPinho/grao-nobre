import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-lg text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" size="xl" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
