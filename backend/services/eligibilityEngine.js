/**
 * Eligibility Engine — Pure Function
 * Evaluates a student against a role's eligibility criteria.
 * Returns { isEligible, ruleResults, checkedAt }
 */
export const evaluateEligibility = (student, criteria) => {
  if (!criteria) return { isEligible: true, ruleResults: [], checkedAt: new Date() };

  const results = [];

  if (criteria.minCGPA > 0) {
    const passed = (student.cgpa || 0) >= criteria.minCGPA;
    results.push({
      rule: `Minimum CGPA: ${criteria.minCGPA}`,
      passed,
      reason: passed ? null : `Your CGPA (${student.cgpa}) is below the minimum (${criteria.minCGPA})`,
    });
  }

  if (criteria.allowedBranches && criteria.allowedBranches.length > 0) {
    const passed = criteria.allowedBranches.includes(student.branch);
    results.push({
      rule: `Allowed Branches: ${criteria.allowedBranches.join(", ")}`,
      passed,
      reason: passed ? null : `Your branch (${student.branch}) is not in the eligible list`,
    });
  }

  if (criteria.min10thPercent > 0) {
    const actual = student.tenth?.percentage || 0;
    const passed = actual >= criteria.min10thPercent;
    results.push({
      rule: `Minimum 10th %: ${criteria.min10thPercent}`,
      passed,
      reason: passed ? null : `Your 10th % (${actual}) is below the minimum (${criteria.min10thPercent})`,
    });
  }

  if (criteria.min12thPercent > 0) {
    const actual = student.twelfth?.percentage || 0;
    const passed = actual >= criteria.min12thPercent;
    results.push({
      rule: `Minimum 12th %: ${criteria.min12thPercent}`,
      passed,
      reason: passed ? null : `Your 12th % (${actual}) is below the minimum (${criteria.min12thPercent})`,
    });
  }

  if (criteria.maxActiveBacklogs !== undefined && criteria.maxActiveBacklogs >= 0) {
    const actual = student.activeBacklogs || 0;
    const passed = actual <= criteria.maxActiveBacklogs;
    results.push({
      rule: `Max Active Backlogs: ${criteria.maxActiveBacklogs}`,
      passed,
      reason: passed ? null : `You have ${actual} active backlog(s). Max allowed: ${criteria.maxActiveBacklogs}`,
    });
  }

  if (criteria.eligibleCTCRequired) {
    const passed = student.eligibleForCTC === true;
    results.push({
      rule: "Eligible for CTC Placement",
      passed,
      reason: passed ? null : "You are not marked eligible for CTC placement. Contact TPO.",
    });
  }

  if (!criteria.pwdAllowed && student.isPWD) {
    results.push({
      rule: "PWD Category",
      passed: false,
      reason: "This drive does not accept PWD category applications.",
    });
  }

  if (criteria.graduationYearMin > 0 && student.graduationYear) {
    const passed =
      student.graduationYear >= criteria.graduationYearMin &&
      student.graduationYear <= (criteria.graduationYearMax || 9999);
    results.push({
      rule: `Graduation Year: ${criteria.graduationYearMin}–${criteria.graduationYearMax || "N/A"}`,
      passed,
      reason: passed ? null : `Your graduation year (${student.graduationYear}) is out of range`,
    });
  }

  return {
    isEligible: results.length === 0 || results.every((r) => r.passed),
    ruleResults: results,
    checkedAt: new Date(),
  };
};
