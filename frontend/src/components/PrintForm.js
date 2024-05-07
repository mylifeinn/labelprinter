import { Button, Col, Form, Input, Row, Select, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const { Option } = Select;

const PrintForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [regex, setRegex] = useState("");
  const dataRef = useRef();

  //字体选择
  const fontOptions = {
    "1(8dots)": "1",
    "2(12dots)": "2",
    "3(16dots)": "3",
    "4(24dots)": "4",
    "5(32dots)": "5",
    "6(14dots)": "6",
    "7(21dots)": "7",
    "8(14dots)": "8",
  };

  // fontDots 值字典
  const fontDotsOptions = {
    1: "8",
    2: "12",
    3: "16",
    4: "24",
    5: "32",
    6: "14",
    7: "21",
    8: "14",
  };

  // 设置正则表达式默认值
  const defaultRegex = /IMEI:(\d{15}),MAC:([A-Fa-f0-9]{12})/;

  // 从本地存储中加载数据并填充表单
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("formData"));
    if (storedData) {
      form.setFieldsValue(storedData);
      form.setFieldValue("data", null);
    }
    setTimeout(() => {
      dataRef.current?.focus();
    }, 500);
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      let { data, url, textString } = values;
      const pattern = regex || defaultRegex; // 使用用户填写的正则表达式，若未填写则使用默认的

      // 使用正则表达式进行匹配
      const match = data.match(new RegExp(pattern));

      let groups = [];

      if (!match) {
        // 如果未匹配到任何数据，则直接返回，不执行后续代码
        message.error("未匹配到任何数据");
        return;
      }

      if (match) {
        // 若匹配成功，提取出匹配到的所有组数据
        for (let i = 1; i < match.length; i++) {
          groups.push(match[i] || "");
        }
      }

      console.log("Groups:", groups);

      // 组合URL
      let finalUrl = url;
      for (let i = 0; i < groups.length; i++) {
        finalUrl = finalUrl.replace(`{group${i}}`, groups[i] || "");
      }
      console.log("Final URL:", finalUrl);

      // 检查textString是否匹配到的组数据存在于groups数组中
      const textStringPattern = /\{group(\d+)\}/;
      const textStringMatch = textString.match(textStringPattern);
      if (textStringMatch) {
        const groupIndex = parseInt(textStringMatch[1]);
        if (groupIndex >= groups.length) {
          message.error(
            "超出数组边界：文本中指定的组数据超出正则匹配到的数据范围。"
          );
          return;
        }
        textString = groups[groupIndex];
      }
      console.log("Text to print:", textString);

      // 发送 HTTP 请求到后端接口
      await axios.post("/api/print", {
        ...values,
        data: data,
        dataMatches: groups,
        url: finalUrl,
        textString: textString, // 使用匹配到的组数据
        fontDots: fontDotsOptions[form.getFieldValue("textStringType")], //用于计算字符数所占点数dots
      });

      // 将数据存储到本地存储中，如果数据发生变化
      if (
        JSON.stringify(values) !==
        JSON.stringify(JSON.parse(localStorage.getItem("formData")))
      ) {
        localStorage.setItem("formData", JSON.stringify(values));
      }

      // 打印请求成功的消息
      message.success("打印请求成功发送");
      // 清空 data 字段的值
      form.setFieldsValue({ data: "" });
    } catch (error) {
      // 打印请求失败的消息
      message.error("发送打印请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ marginTop: "10px", marginLeft: "100px", marginRight: "100px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          venderId: "",
          productId: "",
          cellWidth: "1",
          errorCorrectionLevel: "0",
          rotation: "0",
          nbLabels: "1",
          qrcodeX: "",
          qrcodeY: "",
          dots: "",
          labelDistance: "",
          labelWidth: "",
          labelLength: "",
          url: "http://example.com/pid?imei={group0}&mac={group1}",
          data: "",
          textStringX: "",
          textStringY: "",
          textStringType: "",
          multipliCationX: 1,
          multipliCationY: 1,
          textString: "{group0}",
          fontDots: "0",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="打印机制造商ID"
              name="venderId"
              rules={[
                { required: true, message: "请输入打印机制造商ID" },
                {
                  pattern: /^[0-9a-fA-F]+$/,
                  message: "请输入有效的打印机制造商ID",
                },
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>

            <Form.Item
              label="打印机产品ID"
              name="productId"
              rules={[
                { required: true, message: "请输入打印机产品ID" },
                {
                  pattern: /^[0-9a-fA-F]+$/,
                  message: "请输入有效的打印机产品ID",
                },
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>

            <Form.Item
              label="二维码大小"
              name="cellWidth"
              rules={[
                { required: true, message: "请选择二维码大小" },
                { pattern: /^[1-9]|10$/, message: "请选择有效的二维码大小" },
              ]}
            >
              <Select>
                {[...Array(10).keys()].map((i) => (
                  <Option key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="二维码纠错等级"
              name="errorCorrectionLevel"
              rules={[
                { required: true, message: "请选择二维码纠错等级" },
                { pattern: /^[0-3]$/, message: "请选择有效的二维码纠错等级" },
              ]}
            >
              <Select>
                <Option value="0">低</Option>
                <Option value="1">中等</Option>
                <Option value="2">高</Option>
                <Option value="3">最高</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="打印角度"
              name="rotation"
              rules={[
                { required: true, message: "请选择打印角度" },
                { pattern: /^[0-4]$/, message: "请选择有效的打印角度" },
              ]}
            >
              <Select>
                <Option value="0">0 度</Option>
                <Option value="1">90 度</Option>
                <Option value="2">180 度</Option>
                <Option value="3">270 度</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="打印份数"
              name="nbLabels"
              rules={[
                { required: true, message: "请输入打印份数" },
                { pattern: /^[1-9]\d*$/, message: "请输入有效的打印份数" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="1mm 像素比例"
              name="dots"
              rules={[{ required: true, message: "请输入 1mm 像素比例" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签间距"
              name="labelDistance"
              rules={[{ required: true, message: "请输入标签间距" }]}
            >
              <Input />
            </Form.Item>

            {/* 设置打印文本的参数 */}
            <Form.Item
              label="文本相对二维码左下角X方向偏移量(mm)"
              name="textStringX"
              rules={[{ required: true, message: "请输入文本宽度" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="文本相对二维码左下角Y方向偏移量(mm)"
              name="textStringY"
              rules={[{ required: true, message: "请输入文本高度" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="文本宽度放大比率"
              name="multipliCationX"
              rules={[{ required: true, message: "请宽度放大比率" }]}
            >
              <Select>
                {[...Array(10).keys()].map((i) => (
                  <Option key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 设置打印文本的参数 */}
            <Form.Item
              label="文本高度放大比率"
              name="multipliCationY"
              rules={[{ required: true, message: "请高度放大比率" }]}
            >
              <Select>
                {[...Array(10).keys()].map((i) => (
                  <Option key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="字体选择"
              name="textStringType"
              rules={[{ required: true, message: "请选择字体" }]}
            >
              <Select>
                {Object.keys(fontOptions).map((key) => (
                  <Option key={key} value={fontOptions[key]}>
                    {key}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* 显示自定义输入框 */}

            <Form.Item
              label="要打印的文本"
              name="textString"
              rules={[{ required: false, message: "请输入要打印的文本" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签宽(mm)"
              name="labelWidth"
              rules={[
                { required: true, message: "请输入标签宽度" },
                { pattern: /^[0-9]+$/, message: "请输入有效的数字" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签长(mm)"
              name="labelLength"
              rules={[
                { required: true, message: "请输入标签长度" },
                { pattern: /^[0-9]+$/, message: "请输入有效的数字" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="二维码宽度(mm)"
              name="qrcodeX"
              rules={[{ required: true, message: "请输入二维码宽度" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="二维码长度(mm)"
              name="qrcodeY"
              rules={[{ required: true, message: "请输入二维码长度" }]}
            >
              <Input />
            </Form.Item>

            {/* 正则表达式输入框 */}
            <Form.Item label="正则表达式" name="regex">
              <Input
                placeholder={defaultRegex}
                onChange={(e) => setRegex(e.target.value)}
              />
            </Form.Item>

            {/* data */}
            <Form.Item
              label="待匹配数据"
              name="data"
              rules={[{ required: true, message: "请输入待匹配的数据" }]}
            >
              <Input ref={dataRef} />
            </Form.Item>

            {/* URL 地址 */}
            <Form.Item
              label="URL 地址"
              name="url"
              rules={[{ required: true, message: "请输入 URL 地址" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            打印标签
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrintForm;
