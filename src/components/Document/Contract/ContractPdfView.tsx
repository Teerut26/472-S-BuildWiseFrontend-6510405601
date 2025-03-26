import { type GetCompanyByUserResponse } from "@/services/company/getCompanyByUser.service";
import { type GetContractByProjectResponse } from "@/services/contract/getContractByProject.service";
import { type GetProjectResponse } from "@/services/project/getProject.service";
import { bahttext } from "bahttext";
import clsx from "clsx";
import { addDays, differenceInDays, format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import dayjs from "dayjs";
import buddhistEra from 'dayjs/plugin/buddhistEra'
import _ from "lodash";

dayjs.extend(buddhistEra);

interface Props {
    isPrintMode: boolean;
    data: GetContractByProjectResponse
    project: GetProjectResponse
    company: GetCompanyByUserResponse
}

export default function ContractPdfView(props: Props) {
    return (
        <div className="text-[14px]">
            <h1 className={clsx("text-2xl font-bold mb-4", props.isPrintMode ? "text-center" : "text-start")}>สัญญาว่าจ้างก่อสร้าง</h1>
            <div className="grid grid-cols-1 gap-4">
                <div className={clsx(props.isPrintMode ? "text-center" : "text-start")}>
                    <span>เมื่อวันที่</span>
                    <span className="ml-2 font-semibold">{format(parseISO(props.data.created_at), "dd MMMM", { locale: th })} {dayjs(parseISO(props.data.created_at)).format("BBBB")}</span>
                    <span className="ml-4">หนังสือสัญญาฉบับนี้ทำขึ้นที่</span>
                </div>
                <div className="text-start">
                    <span className="font-semibold">{props.project.client.name}</span>
                    {/* <span className="ml-2">เลขที่</span>
                    <span className="ml-2 font-semibold">{props.project.client.address.address}, {props.project.client.address.district}, {props.project.client.address.province}, {props.project.client.address.postal_code}</span> */}
                    <span className="ml-2">ระหว่าง</span>
                    <span className="ml-2 font-semibold">{format(parseISO(props.data.start_date), "dd MMMM ", { locale: th })}{dayjs(parseISO(props.data.start_date)).format("BBBB")} - {format(parseISO(props.data.end_date), "dd MMMM ", { locale: th })}{dayjs(parseISO(props.data.end_date)).format("BBBB")}</span>
                    <span className="ml-2">ทะเบียนนิติบุคคล เลขที่</span>
                    <span className="ml-2 font-semibold">{props.project.client.tax_id}</span>
                    {/* <span className="ml-2">ที่ตั้งเลขที่</span>
                    <span className="ml-2 font-semibold">XXXXXXX</span> */}
                    <span className="ml-2">ที่ตั้ง</span>
                    <span className="ml-2 font-semibold">{props.project.client.address.address}, {props.project.client.address.district}, {props.project.client.address.province}, {props.project.client.address.postal_code}</span>
                    <span className="ml-2">ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้ว่าจ้าง” ฝ่ายหนึ่ง</span>
                </div>
                <div className="text-start">
                    <span>กับ</span>
                    <span className="ml-2 font-semibold">{props.company.name}</span>
                    <span className="ml-2">ทะเบียนนิติบุคคลเลขที่</span>
                    <span className="ml-2 font-semibold">{props.company.tax_id}</span>
                    {/* <span className="ml-2">ที่ตั้งเลขที่</span>
                    <span className="ml-2 font-semibold">XXXXXXX</span> */}
                    <span className="ml-2">ที่ตั้ง</span>
                    <span className="ml-2 font-semibold">{props.company.address.address}, {props.company.address.district}, {props.company.address.province}, {props.company.address.postal_code}</span>
                    <span className="ml-2">ซึ่งต่อไปในสัญญานี้เรียกว่า</span>
                    <span className="ml-2">“ผู้รับจ้าง”</span>
                    <span className="ml-2">อีกฝ่ายหนึ่ง</span>
                </div>
                <div className="font-semibold">คู่สัญญาทั้งสองฝ่ายตกลงกันดังต่อไปนี้</div>
            </div>

            <div className="mt-4 text-start">
                <h2 className="text-xl font-bold">1. ขอบเขตและลักษณะของงาน</h2>
                <div>
                    <span>ผู้ว่าจ้าง ตกลงจ้าง ผู้รับจ้าง ให้ก่อสร้าง</span>
                    <span className="ml-2 font-semibold">{props.data.project_description}</span>
                    <span className="ml-2">เนื้อที่</span>
                    <span className="ml-2 font-semibold">{props.data.area_size.toLocaleString("th-TH")}</span>
                    <span className="ml-2">ตารางเมตร</span>
                </div>
                <div>
                    <span>ที่ตั้ง</span>
                    <span className="ml-2 font-semibold">{props.project.address.address}, {props.project.address.district}, {props.project.address.province}, {props.project.address.postal_code}</span>
                    <span className="ml-2">โดยทั้ง</span>
                </div>
                <div>สองฝ่ายตกลงกันว่ารูปแบบและรายการที่แนบท้ายสัญญาต่อไปนี้เป็นส่วนหนึ่งของสัญญา ได้แก่</div>
                <ol className="list-decimal list-inside pl-4">
                    {props.data.format?.map((item, index) => (
                        <li key={index}>
                            <span className="font-semibold">{item}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-bold">2. ราคา</h2>
                <div>
                    <span>ผู้ว่าจ้างตกลงจ่ายค่าจ้างแก่ผู้รับจ้าง ตามลักษณะของงานที่ได้ระบุไว้ในข้อ</span>
                    <span>1. เป็นจำนวนเงินทั้งหมด</span>
                    <span className="ml-2 font-semibold">{_.sumBy(props.data.periods, (o) => o.amount_period).toLocaleString("th-TH")}</span>
                    <span className="ml-1">บาท</span>
                    <span className="ml-1 font-semibold">({bahttext(_.sumBy(props.data.periods, (o) => o.amount_period))})</span>
                    <span className="ml-1">โดยแบ่งชำระเป็นงวดๆ ดังนี้</span>
                </div>
                {props.data.periods.map((period, index) => (
                    <div className="flex flex-col" key={index}>
                        {period.period_number === 1 ?
                            <>
                                <div>
                                    <span className="font-semibold underline">งวดแรก</span>
                                    <span className="ml-2">ผู้ว่าจ้างตกลงจ่ายเงินจำนวน</span>
                                    <span className="ml-2 font-semibold">{period.amount_period.toLocaleString("th-TH")}</span>
                                    <span className="ml-1">บาท</span>
                                    <span className="ml-1 font-semibold">({bahttext(period.amount_period)})</span>
                                    <span className="ml-2">เป็นเงินมัดจำค่าดำเนินงานก่อสร้างตกแต่ง ซึ่งเป็นร้อยละ</span>
                                    <span className="ml-2 font-semibold">{(period.amount_period * 100 / _.sumBy(props.data.periods, (o) => o.amount_period)).toFixed(0)}%</span>
                                    <span className="ml-1"> ของค่าจ้างออกแบบทั้งหมด โดยผู้ว่าจ้างตกลงจ่ายในวันที่ทำสัญญาฉบับนี้</span>
                                </div>
                            </>

                            :
                            <>
                                <div>
                                    <span className="font-semibold underline">งวดที่ {period.period_number}</span>
                                    <span className="ml-2">ผู้ว่าจ้างตกลงจ่ายเงินจำนวน</span>
                                    <span className="ml-2 font-semibold">{period.amount_period.toLocaleString("th-TH")}</span>
                                    <span className="ml-1">บาท</span>
                                    <span className="ml-1 font-semibold">({bahttext(period.amount_period)})</span>
                                    <span className="ml-1" >โดยจ่ายให้เมื่อผู้รับจ้างดำเนินงานต่อไปนี้แล้วเสร็จ</span>
                                </div>
                                <ol className="list-decimal list-inside pl-4">
                                    {period.jobs.map((job, index) => (
                                        <li key={index}>
                                            <span className="font-semibold">{job.job_detail.name} จำนวน {job.job_amount} งาน</span>
                                        </li>
                                    ))}
                                </ol>
                                <div>
                                    <span>โดยกำหนดการส่งมอบงานภายใน</span>
                                    <span className="ml-2 font-semibold">{period.delivered_within}</span>
                                    <span className="ml-1">วันนับแต่วันที่ผู้รับจ้างได้รับค่างวดงานงวด{period.period_number - 1 === 1 ? "แรก" : "ที่ " + (period.period_number - 1) + ""}</span>
                                </div>
                            </>
                        }
                    </div>
                ))}
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">3. กำหนดเวลาแล้วเสร็จ</h2>
                <div>
                    <span>ผู้รับจ้างให้สัญญาว่าจะดำเนินงานตามข้อ 1. ให้แล้วเสร็จภายในเวลา</span>
                    <span className="ml-1 font-semibold">{differenceInDays(parseISO(props.data.end_date), parseISO(props.data.start_date))}</span>
                    <span className="ml-1">วัน</span>
                    <span className="ml-1">นับจากวันที่</span>
                    <span className="ml-1 font-semibold">{format(parseISO(props.data.start_date), "dd", { locale: th })}</span>
                    <span className="ml-1">เดือน</span>
                    <span className="ml-1 font-semibold">{format(parseISO(props.data.start_date), "MMMM", { locale: th })}</span>
                    <span className="ml-1">พ.ศ.</span>
                    <span className="ml-1 font-semibold">{dayjs(parseISO(props.data.start_date)).format("BBBB")}</span>
                    <span className="ml-1">ถึง วันที่</span>
                    <span className="ml-1 font-semibold">{format(parseISO(props.data.end_date), "dd", { locale: th })}</span>
                    <span className="ml-1">เดือน</span>
                    <span className="ml-1 font-semibold">{format(parseISO(props.data.end_date), "MMMM", { locale: th })}</span>
                    <span className="ml-1">พ.ศ.</span>
                    <span className="ml-1 font-semibold">{dayjs(parseISO(props.data.end_date)).format("BBBB")}</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">4. การส่งมอบงานและการตรวจรับงาน</h2>
                <div>
                    <span>ผู้รับจ้างจะแจ้งให้ผู้ว่าจ้างทราบ โดยทำเป็นลายลักษณ์อักษรพร้อมรูปถ่ายประกอบ เพื่อให้ผู้ว่าจ้างหรือ ตัวแทนของผู้ว่าจ้างตรวจรับงวดงาน หากผู้ว่าจ้างหรือตัวแทนผู้ว่าจ้างไม่เข้าตรวจรับมอบงวดงานภายใน</span>
                    <span className="ml-1 font-semibold">{props.data.validate_within}</span>
                    <span className="ml-1">วัน</span>
                    <span className="ml-1">นับแต่วันที่ผู้รับจ้างได้มีหนังสือเป็นลายลักษณ์อักษรแจ้งให้ทราบ ให้ถือว่าผู้ว่าจ้างได้รับ
                        มอบงวดงานเรียบร้อยแล้ว</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">5. กำหนดระยะเวลาการชำระเงิน</h2>
                <div>
                    <span>ผู้ว่าจ้างตกลงชำระเงินค่างวดงานภายใน</span>
                    <span className="ml-1 font-semibold">{props.data.pay_within}</span>
                    <span className="ml-1">วัน</span>
                    <span className="ml-1">นับแต่วันที่ได้ตรวจรับมอบงวดงาน</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">6. เงินประกันผลงาน</h2>
                <div>
                    <span>ทั้งสองฝ่ายตกลงกำหนดเงินค่าประกันผลงานตามสัญญาข้อ 7. จำนวนทั้งหมด</span>
                    <span className="ml-1 font-semibold">{props.data.retention_money.toLocaleString("th-TH")}</span>
                    <span className="ml-1">บาท</span>
                    <span className="ml-1 font-semibold">({bahttext(props.data.retention_money)})</span>
                    <span className="ml-1">โดยให้ผู้ว่าจ้างหักจากเงินค่างวดงานในแต่ละงวดเท่าๆกันจนครบตามจำนวน และหากผู้รับจ้างไม่ปฏิบัติตามสัญญาข้อ 7 ผู้รับจ้างยินยอมให้ผู้ว่าจ้างหักเงินประกันผลงานตามเพื่อชดใช้ความเสียหายที่เกิดขึ้นได้</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">7. การรับประกันผลงาน</h2>
                <div>
                    <span>เมื่องานแล้วเสร็จบริบูรณ์ และผู้ว่าจ้างได้รับมอบงานจ้างจากผู้รับจ้าง หากมีเหตุชำรุดบกพร่อง หรือเสียหายเกิดขึ้น ภายในกำหนด</span>
                    <span className="ml-1 font-semibold">{props.data.guarantee_within}</span>
                    <span className="ml-1">วัน</span>
                    <span className="ml-1">วัน นับถัดจากวันที่ได้รับมอบงานดังกล่าว ซึ่งความชำรุดบกพร่องหรือเสียหายนั้นเกิดจากความบกพร่องในการก่อสร้างของผู้รับจ้างอันเกิดจากการใช้วัสดุที่ไม่ ถูกต้อง หรือทำไว้ไม่เรียบร้อย หรือทำไม่ถูกต้องตามมาตรฐานแห่งหลักวิชา ผู้รับจ้างจะต้องรีบทำการแก้ไขให้เป็นที่เรียบร้อยไม่ชักช้า โดยผู้ว่าจ้างไม่ต้องรับผิดชอบค่าใช้จ่ายใดๆ ในการนี้ทั้งสิ้น</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">8. งานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน</h2>
                <div>
                    <span>{props.data.amendment}</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">9. การบอกเลิกสัญญา</h2>
                <div>
                    <span>{props.data.termination_of_contract}</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">10. การสิ้นสุดแห่งสัญญา</h2>
                <div>
                    <span>{props.data.end_of_contract}</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">11. การผิดสัญญา</h2>
                <div>
                    <span>{props.data.breach_of_contract}</span>
                </div>
            </div>
            <div className="mt-4 page-break-auto">
                <h2 className="text-xl font-bold">12. เหตุสุดวิสัย</h2>
                <div>
                    <span>{props.data.force_majeure}</span>
                </div>
            </div>
            { }
            <div className={clsx("page-break-auto", props.isPrintMode ? "" : "hidden")}>
                <div className="mt-4 break">
                    <div>
                        {/* <span className="ml-5">สัญญานี้มีจำนวนทั้งหมด 5 หน้า</span> */}
                        {/* <span>พร้อม</span> */}
                        <span>เอกสารแนบท้ายสัญญาซึ่งถือเป็นส่วนหนึ่งของสัญญาฉบับนี้ด้วย สัญญาฉบับนี้ได้ทำขึ้นเป็น 2 ฉบับ มีข้อความตรงกันถูกต้องตามความประสงค์ของคู่สัญญาทั้งสอง ซึ่งได้อ่านและเข้าใจข้อความดีโดยตลอดแล้ว เพื่อเป็นหลักฐานจึงได้ลงลายมือชื่อและประทับตราสำคัญต่อหน้าพยาน</span>
                    </div>
                </div>
                <div className="flex mt-10">
                    <div className="flex flex-col items-center w-full">
                        <div>
                            <span>ลงชื่อ</span>
                            <span>....................................................................</span>
                            <span>ผู้ว่าจ้าง</span>
                        </div>
                        <div>
                            <span>(</span>
                            <span>....................................................................</span>
                            <span>)</span>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <div>(ประทับตรา)</div>
                    </div>
                </div>
                <div className="flex mt-10">
                    <div className="flex flex-col items-center w-full">
                        <div>
                            <span>ลงชื่อ</span>
                            <span>....................................................................</span>
                            <span>ผู้รับจ้าง</span>
                        </div>
                        <div>
                            <span>(</span>
                            <span>....................................................................</span>
                            <span>)</span>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <div>(ประทับตรา)</div>
                    </div>
                </div>
                <div className="flex mt-10">
                    <div className="flex flex-col items-center w-full">
                        <div>
                            <span>ลงชื่อ</span>
                            <span>....................................................................</span>
                            <span>พยาน</span>
                        </div>
                        <div>
                            <span>(</span>
                            <span>....................................................................</span>
                            <span>)</span>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">

                    </div>
                </div>
                <div className="flex mt-10">
                    <div className="flex flex-col items-center w-full">
                        <div>
                            <span>ลงชื่อ</span>
                            <span>....................................................................</span>
                            <span>พยาน</span>
                        </div>
                        <div>
                            <span>(</span>
                            <span>....................................................................</span>
                            <span>)</span>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">

                    </div>
                </div>
            </div>
        </div>
    )
}