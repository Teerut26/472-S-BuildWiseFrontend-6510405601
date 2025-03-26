import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

interface Period {
  period_number: number;
  amount_period: number;
  delivered_within: number;
  jobs: Job[];
}

interface Job {
  job_id: string;
  job_amount: number;
}

export type EditContractProps = {
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
  periods: Period[];
};

const editContract = async (props: EditContractProps) => {
  try {
    const data = props;
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/contracts/${props.project_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default editContract;
