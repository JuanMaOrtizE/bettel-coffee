import {
  Ban,
  CircleCheck,
  Coffee,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import availableTableImage from "../../assets/tables/table-available.png";
import inactiveTableImage from "../../assets/tables/table-inactive.png";
import occupiedTableImage from "../../assets/tables/table-occupied.png";
import pendingPaymentTableImage from "../../assets/tables/table-pending-payment.png";
import type { CafeTable, TableStatus } from "./tables.schema";

type TableCardProps = {
  table: CafeTable;
};

type StatusPresentation = {
  label: string;
  icon: LucideIcon;
  imageSrc: string;
  accentClass: string;
  badgeClass: string;
};

const statusPresentation: Record<TableStatus, StatusPresentation> = {
  AVAILABLE: {
    label: "Disponible",
    icon: CircleCheck,
    imageSrc: availableTableImage,
    accentClass: "bg-available",
    badgeClass: "border-available/30 bg-available/10 text-available",
  },
  OCCUPIED: {
    label: "Ocupada",
    icon: Coffee,
    imageSrc: occupiedTableImage,
    accentClass: "bg-brand",
    badgeClass: "border-brand/30 bg-brand/10 text-brand",
  },
  PENDING_PAYMENT: {
    label: "Por cobrar",
    icon: ReceiptText,
    imageSrc: pendingPaymentTableImage,
    accentClass: "bg-payment",
    badgeClass: "border-payment/30 bg-payment/10 text-payment",
  },
};

const inactivePresentation: StatusPresentation = {
  label: "Inactiva",
  icon: Ban,
  imageSrc: inactiveTableImage,
  accentClass: "bg-muted",
  badgeClass: "border-line bg-canvas text-muted",
};

export function TableCard({ table }: TableCardProps) {
  const presentation = table.isActive
    ? statusPresentation[table.status]
    : inactivePresentation;

  const Icon = presentation.icon;

  return (
    <article className="flex w-full max-w-52 min-w-0 flex-col items-center text-center">
      <div className="relative flex h-36 w-full items-center justify-center sm:h-40 xl:h-44">
        <span
          aria-hidden="true"
          className={`absolute bottom-5 h-8 w-3/5 rounded-[50%] opacity-15 blur-lg ${presentation.accentClass}`}
        />

        <img
          src={presentation.imageSrc}
          alt=""
          aria-hidden="true"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
          draggable={false}
          className="relative size-full object-contain"
        />
      </div>

      <h2 className="-mt-1 max-w-full break-words font-display text-2xl font-bold leading-none text-ink">
        {table.label}
      </h2>

      <span
        className={`mt-2 inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-xs font-bold ${presentation.badgeClass}`}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        {presentation.label}
      </span>
    </article>
  );
}
