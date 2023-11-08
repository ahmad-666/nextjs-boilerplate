import { useState } from "react";
import Pagination from ".";

export default function Example() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <Pagination
        page={page}
        setPage={(newVal) => setPage(newVal)}
        pageSize={10}
        total={100}
        color="primary"
        rounded
        size={35}
      />
    </div>
  );
}
