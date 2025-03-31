export interface Division {
  id: number;
  name: string;
  parentDivisionId: number;
  level: number;
  collaboratorsCount: number;
  subdivisionsCount: number | null;
  ambassadorName: string | null;
  parentDivision: SubDivision | null;
}
export interface SubDivision {
  id: number;
  name: string;
  level: number;
  collaboratorsCount: number;
  ambassadorName: string | null;
}
