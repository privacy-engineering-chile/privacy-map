interface Props {
  number: string;
  title: string;
  lead: string;
  accent?: string;
}

export const ChapterHeading = ({ number, title, lead, accent = "text-accent" }: Props) => (
  <div className="flex items-end gap-4 md:gap-6 border-b border-border pb-4 mb-6">
    <div className={`font-display text-6xl md:text-8xl font-black leading-none ${accent}`}>
      {number}
    </div>
    <div className="flex-1 pb-2">
      <h2 className="font-display text-2xl md:text-3xl font-black leading-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{lead}</p>
    </div>
  </div>
);
