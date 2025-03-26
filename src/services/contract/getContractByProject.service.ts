import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Period {
  period_id: string;
  period_number: number;
  amount_period: number;
  delivered_within: number;
  jobs: Job[];
}

interface Job {
  job_id: string;
  job_amount: number;
  job_detail: Jobdetail;
}

interface Jobdetail {
  job_id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  labor_cost: number;
}

interface Data {
  contract_id: string;
  project_id: string;
  project_description: string;
  area_size: number;
  start_date: string;
  end_date: string;
  force_majeure: string;
  breach_of_contract: string;
  end_of_contract: string;
  termination_of_contract: string;
  amendment: string;
  guarantee_within: number;
  retention_money: number;
  pay_within: number;
  validate_within: number;
  format: string[];
  created_at: string;
  updated_at: string;
  periods: Period[];
  status: string;
}

export type GetContractByProjectResponse = Data;

export type GetContractByProjectProps = {
  project_id: string;
};

const getContractByProject = async (props: GetContractByProjectProps) => {
  try {
    const res = await axiosAPI.get<Data>(`/contracts/${props.project_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getContractByProject;
