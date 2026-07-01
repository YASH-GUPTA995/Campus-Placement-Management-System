// import * as XLSX from "xlsx";

// import * as XLSX from "xlsx";
import XLSX from "xlsx";

console.log(XLSX);

export const parseStudentExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const students = [];
  const errors = [];

  rawData.forEach((row, index) => {
    const rowNum = index + 2;

    // ── REQUIRED FIELDS ──────────────────────────────────────
    // Your Excel uses "Email Address" as college email
    const collegeEmail = String(
      row["Email Address"] || row["College Email ID"] || row["college_email"] || ""
    ).trim().toLowerCase();

    const rollNumber = String(
      row["Roll Number"] || row["roll_number"] || ""
    ).trim().toUpperCase();

    const fullName = String(
      row["Full Name"] || row["Name"] || row["full_name"] || ""
    ).trim();

    const branch = String(
      row["Branch"] || row["Department"] || row["branch"] || ""
    ).trim().toUpperCase();

    // Skip row if any required field is missing
    if (!rollNumber || !collegeEmail || !fullName || !branch) {
      errors.push({
        row: rowNum,
        reason: `Missing required fields. Got: roll=${rollNumber}, email=${collegeEmail}, name=${fullName}, branch=${branch}`,
      });
      return;
    }

    // ── CGPA ─────────────────────────────────────────────────
    // Your Excel uses "CGPA (upto 6th Semester)"
    const cgpaRaw =
      row["CGPA (upto 6th Semester)"] ||
      row["CGPA"] ||
      row["cgpa"] ||
      0;
    const cgpa = parseFloat(cgpaRaw) || 0;

    // ── 10th FIELDS ──────────────────────────────────────────
    // Your Excel uses "10th Passing Year" and "10th Percentage/CGPA"
    const tenth_year = parseInt(
      row["10th Passing Year"] || row["10th Year"] || 0
    ) || 0;

    const tenth_pct = parseFloat(
      row["10th Percentage/CGPA"] || row["10th Percentage"] || row["10th %"] || 0
    ) || 0;

    const tenth_board = String(
      row["10th Board"] || row["10th Board Name"] || ""
    ).trim();

    // ── 12th FIELDS ──────────────────────────────────────────
    // Your Excel uses "12th Passing Year" and "12th Percentage/CGPA"
    const twelfth_year = parseInt(
      row["12th Passing Year"] || row["12th Year"] || 0
    ) || 0;

    const twelfth_pct = parseFloat(
      row["12th Percentage/CGPA"] || row["12th Percentage"] || row["12th %"] || 0
    ) || 0;

    const twelfth_board = String(
      row["12th Board"] || row["12th Board Name"] || ""
    ).trim();

    // ── BACKLOGS ─────────────────────────────────────────────
    // Your Excel has two columns: "Non Blocking" and "Blocking"
    // "Any Active Backlog?" = Yes means has backlogs
    const activeBacklogField = String(
      row["Any Active Backlog?"] || row["Active Backlog"] || row["Backlogs"] || "No"
    ).trim().toLowerCase();

    // Count non-blocking + blocking separately if present
    const nonBlocking = parseInt(row["Non Blocking"] || 0) || 0;
    const blocking    = parseInt(row["Blocking"] || 0) || 0;
    const activeBacklogs =
      blocking + nonBlocking > 0
        ? blocking + nonBlocking
        : activeBacklogField === "yes"
        ? 1
        : 0;

    // ── PWD ──────────────────────────────────────────────────
    // Your Excel uses "Is PwD?"
    const isPWD = String(
      row["Is PwD?"] || row["PWD"] || row["Differently Abled"] || "No"
    ).trim().toLowerCase() === "yes";

    // ── MIN ELIGIBLE CTC ──────────────────────────────────────
    // Your Excel has "Min Elligible CTC" (note typo in your Excel)
    const minCTCRaw = String(
      row["Min Elligible CTC"] || row["Min Eligible CTC"] || row["Eligible for CTC"] || ""
    ).trim().toLowerCase();
    // If blank or 0 = eligible, if has a value = eligible
    const eligibleForCTC = minCTCRaw !== "no";

    // ── OTHER FIELDS ─────────────────────────────────────────
    const personalEmail = String(
      row["Personal Email ID"] || row["Personal Email"] || ""
    ).trim().toLowerCase();

    const gender = String(row["Gender"] || "").trim();

    const contactNumber = String(
      row["Contact Number"] || row["Mobile"] || row["Phone"] || ""
    ).trim();

    const nationality = String(row["Nationality"] || "Indian").trim();

    const permanentAddress = String(
      row["Permanent Address"] || row["Address"] || ""
    ).trim();

    const dateOfBirth = row["Date of Birth"] || row["DOB"] || null;

    // Graduation year — not in your Excel, derive from 12th year + 4
    const graduationYear = twelfth_year > 0 ? twelfth_year + 4 : null;

    students.push({
      rollNumber,
      collegeEmail,
      personalEmail,
      fullName,
      branch,
      dateOfBirth,
      gender,
      cgpa,
      contactNumber,
      nationality,
      permanentAddress,
      tenth: {
        year: tenth_year,
        percentage: tenth_pct,
        board: tenth_board,
      },
      twelfth: {
        year: twelfth_year,
        percentage: twelfth_pct,
        board: twelfth_board,
      },
      activeBacklogs,
      eligibleForCTC,
      isPWD,
      graduationYear,
    });
  });

  return { students, errors };
};

export const generateExcel = (rows, columns) => {
  const data = rows.map((row) => {
    const obj = {};
    columns.forEach((col) => {
      obj[col.label] = row[col.key] ?? "";
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
