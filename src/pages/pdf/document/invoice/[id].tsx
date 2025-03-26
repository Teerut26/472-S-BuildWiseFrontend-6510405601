import InvoicePdfView from "@/components/Document/Invoice/InvoicePdfView";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetInvoice from "@/hooks/queries/invoice/useGetInvoice";
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

    const getProject = useGetProject({ id: props.project_id ?? "" });
    const getCompanyByUser = useGetCompanyByUser({ user_id: props.user_id ?? "" });
    const getInvoice = useGetInvoice({ invoice_id: props.id ?? "" });

    return (
        <>

            {(getProject.data?.data && getCompanyByUser.data?.data && getInvoice.data?.data) ? <InvoicePdfView
                data={getInvoice.data?.data}
                isPrintMode={true}
                project={getProject.data?.data}
                company={getCompanyByUser.data?.data}
            /> : <div className="flex justify-center">
                <Text size="xl">ไม่พบข้อมูลใบแจ้งหนี้</Text>
            </div>}
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
            user_id: context.query.user_id?.toString(),
            project_id: context.query.project_id?.toString(),
        },
    };
}
