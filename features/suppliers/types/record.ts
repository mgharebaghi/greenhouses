// Plain transport contracts. No ORM or framework dependencies.
export type SupplierRecord = {
  ID: number;
  People_CompaniesID: number | null;
  Legal: boolean | null;
  CompanyName: string | null;
  BrandName: string | null;
  SupplierCountry: string | null;
  SupplierCity: string | null;
  FirstName: string | null;
  LastName: string | null;
  ContactEmail: string | null;
  ContactTel: string | null;
  CompanyAddress: string | null;
  LicenseNumber: string | null;
};

export type SupplierPersonOption = Pick<
  SupplierRecord,
  "ID" | "Legal" | "CompanyName" | "FirstName" | "LastName"
> & { PersonCode: string | null };
