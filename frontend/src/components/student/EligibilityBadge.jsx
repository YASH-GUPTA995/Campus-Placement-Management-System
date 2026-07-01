import React, { useState } from "react";
import { MdCheckCircle, MdCancel, MdExpandMore, MdExpandLess } from "react-icons/md";

const EligibilityBadge = ({ eligibility }) => {
  const [expanded, setExpanded] = useState(false);
  if (!eligibility) return null;

  const { isEligible, ruleResults } = eligibility;
  const failedRules = ruleResults?.filter((r) => !r.passed) || [];

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
        {isEligible ? <MdCheckCircle size={14} /> : <MdCancel size={14} />}
        {isEligible ? "Eligible" : "Not Eligible"}
        {!isEligible && (expanded ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />)}
      </button>

      {!isEligible && expanded && (
        <ul className="mt-2 space-y-1">
          {failedRules.map((r, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <MdCancel size={13} className="mt-0.5 shrink-0" />
              {r.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EligibilityBadge;
