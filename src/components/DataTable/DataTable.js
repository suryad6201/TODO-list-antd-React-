import React, { useContext, useState, useEffect } from "react";
//Antd imports
import {
  Row,
  Table,
  Tag,
  Popconfirm,
  Button,
  Tooltip,
  Space,
  Form,
  Input,
  Select,
} from "antd";
//Antd icon imports
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { DataContext } from "../AddNotes";

const { Option } = Select;
const { Search } = Input;
const DataTable = () => {
  //--------------- STATES --------------
  const [form] = Form.useForm();
  const { data, setData } = useContext(DataContext);
  const [searchInfo, setSearchInfo] = useState(data);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [chooseData, setChooseData] = useState(true);
  //--------------- SIDE EFFECTS --------------
  useEffect(() => {
    if (searchText === "") {
      setChooseData(true);
    }
  }, [searchText]);

  useEffect(() => {
    setSearchInfo(data);
  }, [data]);

  //--------------- COLUMNS --------------
  const columns = [
    //No.
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    //TimeStamp
    {
      key: "timestamp",
      title: "Time stamp",
      dataIndex: "timestamp",
      sorter: (a, b) => a.timestamp > b.timestamp,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "timestamp" && sortedInfo.order,
    },
    //Title
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      editable: true,
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order,
    },
    //Description
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      sorter: (a, b) => a.description.length - b.description.length,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "description" && sortedInfo.order,
    },
    //Due Date
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      editable: true,
      sorter: (a, b) => a.dueDate > b.dueDate,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "dueDate" && sortedInfo.order,
    },
    //Tags
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      editable: true,
      filters: [
        { text: "Crucial", value: "Crucial" },
        { text: "High Prority", value: "High Priority" },
        { text: "Low Prority", value: "Low Priority" },
        { text: "Usual", value: "Usual" },
      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 4 ? "blue" : "purple";
            return (
              <Space wrap direction="horizontal" align="center">
                <Tag
                  color={color}
                  style={{ margin: "2px" }}
                  bordered={false}
                  key={tag}
                >
                  {tag.toUpperCase()}
                </Tag>
              </Space>
            );
          })}
        </>
      ),
    },
    //Status
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "WORKING", value: "WORKING" },
        { text: "DONE", value: "DONE" },
        { text: "OVERDUE", value: "Overdue" },
      ],
      render: (status) => {
        let color = "red";
        let icon;
        if (status === "DONE") {
          color = "success";
          icon = <CheckCircleOutlined />;
        } else if (status === "WORKING") {
          color = "processing";
          icon = <SyncOutlined spin />;
        } else if (status === "OVERDUE") {
          color = "error";
          icon = <ClockCircleOutlined />;
        } else {
          color = "warning";
          icon = <FolderOpenOutlined />;
        }
        return (
          <>
            <Tag icon={icon} color={color} bordered={false} key={status}>
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    //Action
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return data.length >= 1 ? (
          <Space>
            {editable ? (
              <span>
                <Space wrap align="center">
                  <Button
                    size="medium"
                    type="primary"
                    onClick={() => saveEdit(record.key)}
                  >
                    Save
                  </Button>
                  <Popconfirm
                    title="Are you sure want to cancel?"
                    onConfirm={cancelEdit}
                  >
                    <Button size="medium">Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Tooltip title="Edit">
                <Button
                  type="primary"
                  onClick={() => editRecord(record)}
                  icon={<EditOutlined />}
                ></Button>
              </Tooltip>
            )}

            <Popconfirm
              title="Are you sure want to delete?"
              onConfirm={() => handleDelete(record)}
            >
              <Tooltip title="Delete">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={editable}
                ></Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : null;
      },
    },
  ];

  //--------------- LOAD DATA HANDLERS --------------
  const loadData = () => {
    setData(data);
  };
  //--------------- DELETE HANDLERS --------------
  const handleDelete = (record) => {
    const dataSource = [...data];
    const filteredData = dataSource.filter((item) => item.key !== record.key);
    setData(filteredData);
  };

  //--------------- EDIT HANDLERS --------------
  const statusList = ["OPEN", "WORKING", "DONE", "OVERDUE"];
  const tagList = ["Crucial", "High Priority", "Low Priority", "Usual"];
  const isEditing = (record) => {
    return record.key === editRowKey;
  };

  const editRecord = (record) => {
    form.setFieldsValue({
      title: "",
      description: "",
      dueDate: "",
      tags: "",
      status: "",
      ...record,
    });
    setEditRowKey(record.key);
  };
  const saveEdit = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditRowKey("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const cancelEdit = () => {
    setEditRowKey("");
  };
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let input = <Input />;
    if (inputType === "status") {
      input = (
        <Select placeholder="Set Status">
          {statusList.map((status, index) => {
            return (
              <Option key={index} value={status}>
                {status}
              </Option>
            );
          })}
        </Select>
      );
    } else if (inputType === "tags") {
      input = (
        <Select mode="tags" placeholder="Tags" allowClear>
          {tagList.map((tag, index) => {
            return (
              <Option key={index} value={tag}>
                {tag}
              </Option>
            );
          })}
        </Select>
      );
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[{ required: true, message: `Please enter ${title}` }]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const alteredColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  //--------------- SORT HANDLERS --------------
  const handleTableChange = (...sorter) => {
    console.log("Sorter", sorter);
    const { order, field } = sorter[2];
    setSortedInfo({ columnKey: field, order });
  };

  //--------------- SEARCH HANDLERS --------------
  const reset = () => {
    setChooseData(true);
    setSearchText("");
    loadData();
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (searchText === "") {
      setChooseData(true);
    }
  };

  const onSearch = (value) => {
    let filteredData = searchInfo.filter(
      (text) =>
        text.title.toLowerCase().includes(value.toLowerCase()) ||
        text.description.toLowerCase().includes(value.toLowerCase()) ||
        text.dueDate.toString().includes(value.toLowerCase()) ||
        text.timestamp.toString().includes(value.toLowerCase())
    );

    setSearchInfo(filteredData);
    setChooseData(false);
  };

  return (
    <>
      {/* SEARCH BAR*/}
      <Row style={{ marginBottom: "20px" }} align="center">
        <Space>
          <Search
            allowClear
            placeholder="Search"
            onChange={handleSearch}
            value={searchText}
            enterButton
            onSearch={onSearch}
            style={{
              width: 412,
              color: "#222222",
            }}
          />
          <Button onClick={reset}>Reset</Button>
        </Space>
      </Row>
      {/* TABLE */}
      <Row>
        <Form form={form} component={false}>
          <Table
            tableLayout="fixed"
            columns={alteredColumns}
            components={{ body: { cell: EditableCell } }}
            dataSource={chooseData ? data : searchInfo}
            style={{ position: "absolute", top: "100%", fontSize: "12px" }}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            onChange={handleTableChange}
          />
        </Form>
      </Row>
    </>
  );
};

export default DataTable;
