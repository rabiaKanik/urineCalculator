import React, { useEffect, useState } from "react";
import "./AppStyle.css";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  theme,
  Typography,
} from "antd";

import ResultTable from "./ResultTable/ResultTable";
import IndexedDb from "./IndexedDb/IndexedDb";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [form] = Form.useForm();
  const { Title } = Typography;
  const [gender, setGender] = useState("Female");
  const [weight, setWeigth] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [naSpot, setNaSpot] = useState("");
  const [kSpot, setKSpot] = useState("");
  const [crSpot, setCrSpot] = useState("");

  const options = [
    { label: "Female", value: "Female" },
    { label: "Male", value: "Male" },
  ];
  const [info, setInfo] = useState<PatientInfo>();
  const [tableData, setTableData] = useState<Results[]>();
  const [result, setResult] = useState<Results>({
    gender: "",
    kawasaki: "",
    intersalt: "",
    tanaka: "",
  });

  const onSubmit = () => {
    setInfo({
      gender: gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      naSpot: parseFloat(naSpot),
      crSpot: parseFloat(crSpot),
      kSpot: parseFloat(kSpot),
    });
  };

  const onFinish = (values: PatientInfo) => {
    console.log("Success:", values);
    // console.log(info);
    // setBool(true);
    let kawasaki = calculateKawasaki();
    let intersalt = calculateIntersalt();
    let tanaka = calculateTanaka();
    setResult({
      gender: gender,
      kawasaki: kawasaki.toString(),
      intersalt: intersalt.toString(),
      tanaka: tanaka.toString(),
    });

    // const checkEmptyInput = !Object.values(result).every((res) => res === "");
    // if (checkEmptyInput) {
    //   const newData = (data) => [...data, result];
    //   setTableData(newData);
    //   const emptyInput = {
    //     gender: "",
    //     kawasaki: "",
    //     intersalt: "",
    //     tanaka: "",
    //   };
    //   setResult(emptyInput);
    // }

    form.resetFields();
    message.success("EVERYTHING IS PERFECT BABY 🧑🏻‍🔬");
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Something gone very very wrong bro");
    console.log("Failed:", errorInfo);
  };

  const onChangeRadio = ({ target: { value } }: RadioChangeEvent) => {
    setGender(value);
  };

  useEffect(() => {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb("test");
      await indexedDb.createObjectStore(["books", "students"]);
      await indexedDb.putValue("books", { name: "A Game of Thrones" });
      await indexedDb.putBulkValue("books", [
        { name: "A Song of Fire and Ice" },
        { name: "Harry Potter and the Chamber of Secrets" },
      ]);
      await indexedDb.getValue("books", 1);
      await indexedDb.getAllValue("books");
      await indexedDb.deleteValue("books", 1);
    };
    runIndexDb();
  }, []);

  const handleSubmit = (evnt) => {
    evnt.preventDefault();

    const checkEmptyInput = !Object.values(result).every((res) => res === "");
    if (checkEmptyInput) {
      const newData = (data) => [...data, result];
      setTableData(newData);
      const emptyInput = {
        gender: "",
        kawasaki: "",
        intersalt: "",
        tanaka: "",
      };
      setResult(emptyInput);
    }
  };

  const calculateKawasaki = () => {
    let Pr24h = 0;
    let Na24 = 0;

    try {
      if (gender == "Female") {
        let calWeigth = parseFloat(weight) * 8.58;
        let calHeight = parseFloat(height) * 5.09;
        let calAge = parseInt(age) * 4.72;
        Pr24h = calWeigth + calHeight - calAge - 74.95;
      } else if (gender == "Male") {
        let calWeigth = parseFloat(weight) * 15.12;
        let calHeight = parseFloat(height) * 7.39;
        let calAge = parseInt(age) * 12.63;
        Pr24h = calWeigth + calHeight - calAge - 79.9;
      } else message.warning("gender type is undefineed or null");

      if (Pr24h != 0) {
        let pow = Math.pow(
          parseFloat(naSpot) / (parseFloat(crSpot) * Pr24h),
          0.5
        );
        Na24 = 23 * 16.3 * pow;
        console.log(Na24);
      } else message.error("There is something wrong: pr24h is not calculated");
    } catch (error) {
      message.error("I said 'Something gone wrong': " + error);
    }
    return Na24;
  };

  const calculateIntersalt = () => {
    let Na24 = 0;
    let formula = 0;

    try {
      let BMI = parseFloat(weight) / Math.pow(parseFloat(height), 2);

      if (gender == "Female") {
        let calNaSpot = parseInt(naSpot) * 0.34;
        let calCrSpot = parseFloat(crSpot) * 2.16;
        let calKSpot = parseFloat(kSpot) * 0.09;
        let calAgePo = parseInt(age) * 2.35;
        let calAgeNe = Math.pow(parseInt(age), 2) * 0.03;
        formula =
          5.07 +
          calNaSpot -
          calCrSpot -
          calKSpot +
          2.39 * BMI +
          calAgePo -
          calAgeNe;
      } else if (gender == "Male") {
        let calNaSpot = parseFloat(naSpot) * 0.46;
        let calCrSpot = parseFloat(crSpot) * 2.75;
        let calKSpot = parseFloat(kSpot) * 0.13;
        let calAgePo = parseInt(age) * 0.26;
        formula =
          25.46 + calNaSpot - calCrSpot - calKSpot + 4.1 * BMI + calAgePo;
      } else message.warning("gender type is undefineed or null");

      if (formula != 0) {
        Na24 = formula * 23;
        console.log(formula);
      } else
        message.error(
          "There is something wrong: base formula is not calculated"
        );
    } catch (error) {
      console.log("Something gone wrong" + error);
    }
    return Na24;
  };

  const calculateTanaka = () => {
    let Na24 = 0;

    try {
      let calWeigth = info!.weight * 14.89;
      let calHeight = parseFloat(height) * 16.14;
      let calAge = parseInt(age) * 2.04;
      let Pr24h = calWeigth + calHeight - calAge - 2244.45;
      let a = parseFloat(naSpot) / (parseFloat(crSpot) * Pr24h);
      if (a < 0) {
        message.error(
          "Check your input (NaSpot / CrSpot * Pr24H) => should be positive but it is negative"
        );
        console.log(
          "check your input (NaSpot / CrSpot * Pr24H) => should be positive but it is negative "
        );
      }
      let pow = Math.pow(a, 0.392);
      console.log(a);
      Na24 = 23 * 21.98 * pow;
      //console.log(Na24);
    } catch (error) {
      console.log(
        "check your input (NaSpot / CrSpot * Pr24H) => should be positive but it is negative"
      );
    }

    return Na24;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="costum-header" style={{ background: "#0554F2" }}>
        <div className="logo">
          <h1>Urine Calculator</h1>
        </div>
      </Header>
      <Content style={{ padding: "30px 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={{ padding: "24px 0", background: colorBgContainer }}>
          <Sider style={{ background: colorBgContainer }} width={200}></Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <Row>
              <Col>
                <h2>Personal Information</h2>
              </Col>
            </Row>
            <Row>
              <Space size={"large"}>
                <Col span={16}>
                  <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      name="genderRadio"
                      label="Gender"
                      rules={[
                        { required: true, message: "Please pick a gender!" },
                      ]}
                    >
                      <Radio.Group
                        options={options}
                        onChange={onChangeRadio}
                        value={gender}
                        optionType="button"
                      ></Radio.Group>
                    </Form.Item>

                    <Form.Item
                      label="Weigth"
                      name="weigth"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient weight!",
                        },
                      ]}
                    >
                      <Input
                        value={weight}
                        onChange={(value) => setWeigth(value.target.value)}
                        addonAfter="kg"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Heigth"
                      name="heigth"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient heigth!",
                        },
                      ]}
                    >
                      <Input
                        value={height}
                        onChange={(value) => setHeight(value.target.value)}
                        addonAfter="cm"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Age"
                      name="age"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient age!",
                        },
                      ]}
                    >
                      <Input
                        value={age}
                        addonAfter="year"
                        onChange={(value) => setAge(value.target.value)}
                      />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                      label="Na Spot"
                      name="naSpot"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient Na spot!",
                        },
                      ]}
                    >
                      <Input
                        value={naSpot}
                        onChange={(value) => setNaSpot(value.target.value)}
                        addonAfter="mmol/L"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Cr Spot"
                      name="crSpot"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient Cr spot!",
                        },
                      ]}
                    >
                      <Input
                        value={crSpot}
                        onChange={(value) => setCrSpot(value.target.value)}
                        addonAfter="mmol/L"
                      />
                    </Form.Item>
                    <Form.Item
                      label="K Spot"
                      name="kSpot"
                      rules={[
                        {
                          required: true,
                          message: "Please input patient K spot!",
                        },
                      ]}
                    >
                      <Input
                        value={kSpot}
                        onChange={(value) => setKSpot(value.target.value)}
                        addonAfter="mmol/L"
                      />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button
                        style={{ background: "#0DD965" }}
                        type="primary"
                        htmlType="submit"
                        onClick={onSubmit}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Space>
            </Row>
            <Divider>
              {" "}
              <h3 style={{ color: "#1374F2" }}>Results</h3>
            </Divider>
            <Row>
              <Col span={22}>
                <ResultTable tableData={tableData}></ResultTable>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Rabia Design ©2023 Created by SugaRabia
      </Footer>
    </Layout>
  );
};

export default App;
