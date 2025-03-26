import ContractPdfView from "@/components/Document/Contract/ContractPdfView";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetContractByProject from "@/hooks/queries/contract/useGetContractByProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Text } from "@mantine/core";
import _ from "lodash";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";

export default function Contract(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {

    const getProject = useGetProject({ id: props.id ?? "" });
    const getCompanyByUser = useGetCompanyByUser({ user_id: props.user_id ?? "" });
    const getContractByProject = useGetContractByProject({ project_id: props.id ?? "" });

    return (
        <>

            {(getContractByProject.data && getProject.data?.data && getCompanyByUser.data?.data) ? <ContractPdfView
                isPrintMode={true}
                data={getContractByProject.data}
                project={getProject.data?.data}
                company={getCompanyByUser.data?.data}
            /> : <div className="flex justify-center">
                <Text size="xl">ไม่พบข้อมูลสัญญา</Text>
            </div>}
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
            user_id: context.query.user_id?.toString(),
        },
    };
}
