// Plain transport contracts. No ORM or framework dependencies.
export type PlantRecord = {
  ID: number;
  CommonName: string | null;
  ScientificName: string | null;
  PlantFamily: string | null;
  Notes: string | null;
};
