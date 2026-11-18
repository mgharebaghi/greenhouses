export type DashboardPeriod = "7" | "30" | "90" | "365" | "all";
export type DashboardRange = {
  period: DashboardPeriod | "custom";
  start: string | null;
  end: string;
};
export type ProductionStage = "order" | "planting" | "seedling" | "grafting";

export type ActivityBucket = {
  start: string;
  end: string;
  count: number;
};

export type DashboardOverview = {
  activity: ActivityBucket[];
  stages: Record<ProductionStage, number>;
  plantedSeeds: number;
  activeGreenhouses: number;
  ordersWithoutPlanting: number;
  expiringPackages: number;
  expiredPackages: number;
  recentOrders: {
    id: number;
    code: string | null;
    date: string;
    customer: string;
    quantity: number | null;
    stage: ProductionStage;
  }[];
};
