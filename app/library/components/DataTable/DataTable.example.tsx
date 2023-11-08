import { useMemo, useState } from "react";
import Image from "next/image";
import Icon from "../Icon";
import DataTable from "./index";
import type { Header, Item } from "./types";

const statuses = [
  { value: "success", text: "Success", color: "bg-success-main" },
  { value: "pending", text: "Pending", color: "bg-warning-main" },
  { value: "error", text: "Error", color: "bg-error-main" },
];
export default function Example() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [users, setUsers] = useState<Item[]>([
    {
      id: 1,
      name: "name#1",
      age: 10,
      imgSrc: "/imgs/img-1.jpg",
      status: "pending",
      desc: "desc-1",
    },
  ]);
  const headers = useMemo<Header[]>(() => {
    return [
      { value: "name", text: "Name", sortable: true },
      { value: "age", text: "Age", sortable: true },
      {
        value: "status",
        text: "Status",
        sortable: false,
        headerJsx: ({ header }: { header: Header }) => {
          return <span>{header.text}-Jsx</span>;
        },
        itemJsx: ({ item }: { item: Item }) => {
          const status = statuses.find((s) => s.value === item.status)!;
          return (
            <span className={`rounded-sm p-2 text-white ${status.color}`}>
              {status.text}
            </span>
          );
        },
      },
      {
        value: "imgSrc",
        text: "Image",
        sortable: false,
        itemJsx: ({ item }: { item: Item }) => {
          return (
            <Image
              src={item.imgSrc}
              alt={item.imgSrc}
              width={150}
              height={150}
              className="h-[100px] w-[100px] rounded-sm"
            />
          );
        },
      },
      {
        value: "actions",
        text: "Actions",
        sortable: false,
        itemJsx: ({ item }: { item: Item }) => {
          return (
            <div className="flex flex-wrap items-center gap-4">
              <Icon
                icon="mdi:pen"
                size="sm"
                color="primary"
                onClick={() => {
                  setUsers((old) => {
                    return old.map((o) => {
                      if (o.id !== item.id) return o;
                      else return { ...o, name: "new-name" };
                    });
                  });
                }}
              />
              <Icon
                icon="mdi:delete-outline"
                size="sm"
                color="error"
                onClick={() => {
                  setUsers((old) => old.filter((o) => o.id !== item.id));
                }}
              />
            </div>
          );
        },
      },
    ];
  }, []);
  const headersExpand = useMemo<Header[]>(() => {
    return [
      { value: "name", text: "Name", sortable: true },
      { value: "age", text: "Age", sortable: true },
      {
        value: "expand",
        text: "",
        sortable: false,
        itemJsx: ({
          item,
          isExpanded,
          updateExpandedRows,
        }: {
          item: Item;
          isExpanded: boolean;
          updateExpandedRows: (id: any) => void;
        }) => {
          return (
            <Icon
              icon={!isExpanded ? "mdi:chevron-down" : "mdi:chevron-up"}
              size="sm"
              color="primary"
              className="cursor-pointer select-none"
              onClick={() => {
                updateExpandedRows(item.id);
              }}
            />
          );
        },
      },
    ];
  }, []);
  return (
    <div>
      <h1>1-Simple Table</h1>
      <DataTable
        headers={headers}
        items={users}
        totalItems={users.length}
        page={page}
        setPage={(page) => setPage(page)}
        pageSize={pageSize}
        setPageSize={(pageSize) => setPageSize(pageSize)}
      />

      <h1>2-Table with Checkbox</h1>
      <DataTable
        headers={headers}
        items={users}
        totalItems={users.length}
        page={page}
        setPage={(page) => setPage(page)}
        pageSize={pageSize}
        setPageSize={(pageSize) => setPageSize(pageSize)}
        selection
        selectedRows={selectedRows}
        setSelectedRows={(val) => setSelectedRows(val)}
      />

      <h1>3-Table with Expand</h1>
      <DataTable
        headers={headersExpand}
        items={users}
        expand
        singleExpand
        expandRowClassName="bg-slate-100"
        expandJsx={({ item }) => <p className="text-red-500">{item.desc}</p>}
      />
    </div>
  );
}
