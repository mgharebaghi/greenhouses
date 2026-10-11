// Plain transport contracts. No ORM or framework dependencies.
export type PersonRecord = {
  ID: number;
  PersonCode: string | null;
  PostID: number | null;
  FirstName: string | null;
  LastName: string | null;
  NationalCode: string | null;
  PhoneNumber: string | null;
  EmailAddress: string | null;
  Profesion: string | null;
};

export type PeoplePostRecord = {
  ID: number;
  PostNumber: number | null;
  PostName: string | null;
};
