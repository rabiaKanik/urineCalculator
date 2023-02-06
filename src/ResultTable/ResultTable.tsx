import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect } from "react";

// const initialState: PatientInfo = {
//   gender: this?.props.gender,
//   weight: this.props.weight,
//   height: this.props.height,
//   age: this.props.age,
//   naSpot: this.props.naSpot,
//   crSpot: this.props.crSpot,
//   kSpot: this.props.kSpot,
// };

const ResultTable = (props) => {
  //useEffect(() => console.log(props.crSpot));

  const columns: ColumnsType<Results> = [
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Kawasaki",
      dataIndex: "kawasaki",
      //   sorter: {
      //     compare: (a, b) => a.kawasaki - b.kawasaki,
      //     multiple: 3,
      //   },
    },
    {
      title: "Intersalt",
      dataIndex: "intersalt",
      //   sorter: {
      //     compare: (a, b) => a.intersalt - b.intersalt,
      //     multiple: 2,
      //   },
    },
    {
      title: "Tanaka",
      dataIndex: "tanaka",
      //   sorter: {
      //     compare: (a, b) => a.tanaka - b.tanaka,
      //     multiple: 1,
      //   },
    },
  ];

  const data: Results[] = [
    {
      key: "1",
      gender: props.message,
      kawasaki: props.kawasaki,
      intersalt: props.intersalt,
      tanaka: props.tanaka,
    },
  ];

  const onChange: TableProps<Results>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default ResultTable;
