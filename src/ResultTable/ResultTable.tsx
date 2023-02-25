import { Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import IndexedDb from "../IndexedDb/IndexedDb";

// const initialState: PatientInfo = {
//   gender: this?.props.gender,
//   weight: this.props.weight,
//   height: this.props.height,
//   age: this.props.age,
//   naSpot: this.props.naSpot,
//   crSpot: this.props.crSpot,
//   kSpot: this.props.kSpot,
// };

const ResultTable = () => {
  //useEffect(() => console.log(props.crSpot));

  const columns: ColumnsType<Results> = [
    {
      title: "Id",
      dataIndex: "id",
    },
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

  //const [result, setResult] = useState<Results>();

  useEffect(() => {
    const runIndexDb = async () => {
      var items = [];
      const indexedDb = new IndexedDb("urineBaby");
      await indexedDb.createObjectStore(["person"]);
      //setResult(await indexedDb.getAllValue("person"));
      const result1 = await indexedDb.getAllValue("person");
      // setResult(JSON.parse(result1));
      // console.log(result);
      result1.map((item: object) => {
        data.push(item);
      });
      //setResultJson(JSON.stringify(result));
      //console.log(resultJson);
      //setResult(value);
    };
    runIndexDb();
  }, []);

  // const data: Results[] = [
  //   {
  //     key: 1,
  //     gender: result?.gender,
  //     kawasaki: result?.kawasaki,
  //     intersalt: result?.intersalt,
  //     tanaka: result?.tanaka,
  //   },
  // ];
  const data: any = [];

  const onChange: TableProps<Results>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <>
      <div>
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
      {console.log(data)};
    </>
  );
};

export default ResultTable;
