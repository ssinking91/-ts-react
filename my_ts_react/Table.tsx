import * as React from "react";
import { Dispatch, FunctionComponent, useMemo } from "react";
import Tr from "./Tr";

interface Props {
  tableData: string[][]; // 2차원 배열
  dispatch: Dispatch<any>; // 정확하게 하려면 => Dispatch<액션타입>
  onClick: () => void;
}
const Table: FunctionComponent<Props> = ({ tableData, dispatch }) => {
  return (
    <table>
      {Array(tableData.length)
        .fill(null)
        .map((tr, i) =>
          // 캐싱하기 위해서
          useMemo(
            () => (
              <Tr
                key={i}
                dispatch={dispatch}
                rowIndex={i}
                rowData={tableData[i]}
              />
            ),
            [tableData[i]]
          )
        )}
    </table>
  );
};

export default Table;
