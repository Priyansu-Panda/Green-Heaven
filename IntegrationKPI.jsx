import React from 'react';
import DashboardTable from '../../Components/Table/DashboardTable';
import integrationKpiData from "./data/integrationKpi.json"; // assuming you have some local fallback/mock data

const getStyle = () => {
  return "text-center"; // for now keeping it simple, customize if you want fancy alerts
};

const IntegrationKPI = ({ headingName = "", name = ""}) => {

  const task = integrationKpiData.find((t) => t.task_name === name);

  const columns = [
    { field: "subTaskName", colDataClass: v => getStyle(0, v), heading: "ECU-Context" },
    { field: "interface", colDataClass: v => getStyle(1, v), heading: "Interface Accuracy Status (%)" },
    { field: "periodicity", colDataClass: v => getStyle(2, v), heading: "Task Overrun Occurrence (%)" },
    { field: "cpuAvg", colDataClass: v => getStyle(3, v), heading: "CPU Utilization Avg (%)" },
    { field: "cpuPeak", colDataClass: v => getStyle(4, v), heading: "CPU Utilization Peak (%)" },
    { field: "memoryAvg", colDataClass: v => getStyle(5, v), heading: "Memory Load Avg (%)" },
    { field: "memoryPeak", colDataClass: v => getStyle(6, v), heading: "Memory Load Peak (%)" },
  ];

  const formatData = (data) => {
    if (!data) return [];

    return data?.sub_tasks?.map(subtask => ({
      subTaskName: subtask.sub_task_name,
      interface: subtask.metrics.interface,
      periodicity: subtask.metrics.periodicity,
      cpuAvg: subtask.metrics.cpu_avg,
      cpuPeak: subtask.metrics.cpu_peak,
      memoryAvg: subtask.metrics.memory_avg,
      memoryPeak: subtask.metrics.memory_peak,
    })) || [];
  };

  return (
    <DashboardTable
      heading={`Integration KPIs for ${headingName}`}
      data={formatData(task)}
      columns={columns}
    />
  );
};

export default IntegrationKPI;
