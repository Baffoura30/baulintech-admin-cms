import clsx from "clsx";

type StatusType = 
  | "enquiry" | "discovery" | "proposal" | "onboarding" 
  | "in_production" | "in_review" | "launching" | "active" 
  | "at_risk" | "churned";

interface StatusPillProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  enquiry: { label: "Enquiry", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  discovery: { label: "Discovery", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  proposal: { label: "Proposal Sent", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  onboarding: { label: "Onboarding", className: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  in_production: { label: "In Production", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  in_review: { label: "Client Review", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  launching: { label: "Launching", className: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  active: { label: "Active", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  at_risk: { label: "At Risk", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  churned: { label: "Churned", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
};

export default function StatusPill({ status }: StatusPillProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  );
}
