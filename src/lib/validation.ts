import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return isoString;
  }
}

const PLANT_STATUS_LABELS: Record<string, string> = {
  fresh: "Tanaman Sehat",
  moderate: "Tanaman Stres",
  poor: "Kondisi Kritis",
  uncertain: "Tidak Meyakinkan",
};

export function getFreshnessBadge(status: string, category?: string) {
  const badge = getProduceFreshnessBadge(status);
  if (category === "plant") {
    return { ...badge, label: PLANT_STATUS_LABELS[status] ?? badge.label };
  }
  return badge;
}

function getProduceFreshnessBadge(status: string) {
  switch (status) {
    case "fresh":
      return {
        label: "Tampak Segar",
        color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        ring: "text-emerald-500",
        bgLight: "bg-emerald-50",
      };
    case "moderate":
      return {
        label: "Perlu Pemeriksaan",
        color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        ring: "text-amber-500",
        bgLight: "bg-amber-50",
      };
    case "poor":
      return {
        label: "Indikasi Kerusakan",
        color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        ring: "text-rose-500",
        bgLight: "bg-rose-50",
      };
    case "uncertain":
    default:
      return {
        label: "Tidak Meyakinkan",
        color: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
        ring: "text-slate-400",
        bgLight: "bg-slate-50",
      };
  }
}

const PLANT_ACTION_LABELS: Record<string, { label: string; desc: string }> = {
  recommended: {
    label: "Lanjutkan Perawatan Rutin",
    desc: "Tanaman tampak sehat. Pertahankan pola penyiraman, cahaya, dan pemupukan saat ini.",
  },
  inspect_closely: {
    label: "Perlu Penanganan Segera",
    desc: "Terlihat tanda stres atau gangguan. Lakukan langkah penanganan dalam beberapa hari ke depan.",
  },
  avoid_using: {
    label: "Penyelamatan Darurat",
    desc: "Tanaman dalam kondisi kritis. Segera lakukan tindakan penyelamatan dan pisahkan dari tanaman lain bila ada tanda hama/penyakit.",
  },
};

export function getRecommendedActionBadge(action: string, category?: string) {
  const badge = getProduceActionBadge(action);
  if (category === "plant" && PLANT_ACTION_LABELS[action]) {
    return { ...badge, ...PLANT_ACTION_LABELS[action] };
  }
  return badge;
}

function getProduceActionBadge(action: string) {
  switch (action) {
    case "recommended":
      return {
        label: "Dapat Dikonsumsi / Digunakan",
        color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        desc: "Kondisi visual tampak baik dan layak digunakan dengan pencucian standar.",
      };
    case "inspect_closely":
      return {
        label: "Periksa & Kupas Teliti",
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        desc: "Potong bagian yang memar/berubah warna atau periksa aroma dan tekstur sebelum digunakan.",
      };
    case "avoid_using":
      return {
        label: "Hindari Penggunaan / Buang",
        color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        desc: "Tampak tanda pembusukan, jamur, atau degradasi berat. Jangan dicicipi.",
      };
    default:
      return {
        label: "Tinjau Manual",
        color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
        desc: "Pengamatan visual belum cukup memberikan kesimpulan pasti.",
      };
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "fruit":
      return "Buah-buahan";
    case "vegetable":
      return "Sayuran";
    case "plant":
      return "Tanaman";
    case "other":
      return "Bahan Pangan Lain";
    case "unknown":
    default:
      return "Belum Dikenali";
  }
}

export function getSurvivalBadge(outlook: string) {
  switch (outlook) {
    case "likely_survive":
      return {
        label: "Kemungkinan Besar Bertahan",
        color: "bg-emerald-500/10 text-emerald-800 border-emerald-500/25",
      };
    case "at_risk":
      return {
        label: "Berisiko — Masih Bisa Diselamatkan",
        color: "bg-amber-500/10 text-amber-800 border-amber-500/25",
      };
    case "likely_die":
      return {
        label: "Peluang Hidup Rendah",
        color: "bg-rose-500/10 text-rose-800 border-rose-500/25",
      };
    case "uncertain":
    default:
      return {
        label: "Prognosis Belum Pasti",
        color: "bg-slate-500/10 text-slate-700 border-slate-500/25",
      };
  }
}
