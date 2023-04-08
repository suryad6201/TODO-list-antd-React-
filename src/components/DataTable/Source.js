import { v4 as uuid } from "uuid";
const dataSource = [
  {
    key: uuid(),

    timestamp: "4/6/2023, 7:12:53 PM",
    title: "Meeting",
    description: "Meeting with the client",
    dueDate: "2014-12-24",
    tags: ["High Priority"],
    status: "OPEN",
  },
  {
    key: uuid(),
    timestamp: "4/6/2023, 7:12:53 PM",
    title: "Web page",
    description: "Develop first page website",
    dueDate: "2014-12-24",
    tags: ["Usual"],
    status: "WORKING",
  },
];

export default dataSource;
