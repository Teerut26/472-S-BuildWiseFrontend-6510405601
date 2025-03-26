/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Image, Table } from "@mantine/core";
const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

export default function Index() {
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));
  return (
    <div className="flex flex-col text-[14px]">
      <div className="flex justify-between">
        <div className="flex w-full flex-col">
          <div className="mb-3 flex flex-col text-xl font-bold uppercase text-blue-400">
            <div>ใบรายการประมาณราคา</div>
            <div className="leading-5">Bill Of Quantity</div>
          </div>
          <div className="flex w-full flex-col rounded-md bg-blue-100 px-2 py-1">
            <div className="flex gap-2">
              <div className="font-bold">เลขที่ :</div>
              <div>LA00078</div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="font-bold">โครงการ :</div>
                <div>โครงการ โครงการ</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="font-bold">เจ้าของ :</div>
                <div>เจ้าของ เจ้าของ</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="font-bold">สถานที่ :</div>
                <div>สถานที่ สถานที่</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table withColumnBorders withTableBorder className="mt-5">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ลำดับ</Table.Th>
            <Table.Th>รายละเอียด</Table.Th>
            <Table.Th>ปริมาณ</Table.Th>
            <Table.Th>หน่วย</Table.Th>
            <Table.Th>รวมค่าวัสดุ</Table.Th>
            <Table.Th>รวมค่าแรง</Table.Th>
            <Table.Th>รวม</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
}
