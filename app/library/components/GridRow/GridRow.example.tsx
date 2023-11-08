import GridRow from "./index";
import GridCol from "../GridCol";

export default function Example() {
  return (
    <div>
      <GridRow>
        {[...new Array(6)].map((item, i) => (
          <GridCol key={i} cols={12} sm={6} md={4} lg={3} xl={2}>
            <div className="h-[200px] bg-sky-500"></div>
          </GridCol>
        ))}
      </GridRow>
    </div>
  );
}
