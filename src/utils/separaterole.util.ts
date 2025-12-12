export const separateRole = (role: string) => {
  if (role === "fieldPersonnel") return "field personnel";
  if (role === "subContractor") return "subcontractor";
  if (role === "companyAdmin") return "company admin";
  return role;
};
