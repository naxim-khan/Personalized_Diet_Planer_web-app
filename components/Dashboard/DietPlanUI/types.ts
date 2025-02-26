import { DietPlanTypes } from "../../../types/index";

export type DietPlanProps = {
  dietPlan: DietPlanTypes;
  userData: any;
  printRef: React.RefObject<HTMLDivElement>;
  COLORS: string[];
  chartRef: React.RefObject<HTMLDivElement>;
};

export type BMICalculation = {
  weight: number;
  height: number;
}