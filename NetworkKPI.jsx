import React from 'react';
import DashboardTable from '../../Components/Table/DashboardTable';
import networkKpiData from "./data/networkKpi.json";
import networkKpiFeatureData from "./data/networkKpiFeature.json";

const NetworkKpi = ({ headingName = "", name = "", testBenchStatus = null }) => {

  const networkKpi = networkKpiData.find((t) => t.task_name === name);
  const networkKpiFeature = networkKpiFeatureData.find((t) => t.task_name === name);

  const data1 = networkKpi?.sub_tasks?.map((subtask) => {
    if (subtask.metrics.Comm_ID === "0x1401") {
      const isCorrect = testBenchStatus?.network_0x1401_correctness === "true";
      return { ...subtask.metrics, Data_Correctness: isCorrect ? "Pass" : "Fail" };
    }
    return subtask.metrics
  });

  const data2 = networkKpiFeature?.sub_tasks?.map((subtask) => subtask.metrics);

  const getStyle = (value, cellValue) => {
    // Handle NA values for Feature ECU
    if (value === 'Feature' && cellValue === 'NA') {
      return 'bg-yellow-100 text-yellow-600 text-center';
    }

    switch (value) {
      case 'Fail':
        return 'bg-red-200 text-red-600 text-center';
      case 'Pass':
        return 'bg-green-200 text-green-600 text-center';
      case 'Not Tested':
        return 'bg-yellow-100 text-yellow-600 text-center';
      case 'Feature':
        return 'bg-green-200 text-green-600 text-center';
      default:
        return 'text-center';
    }
  };

  const getMetricValue = (metric, originalValue) => {
    const metricsToCheck = ['l_min', 'l_max', 'CPU_Utilization', 'Memory_Utilization', 'l_avg'];

    if (testBenchStatus?.network_0x1401_correctness === "false" && metricsToCheck.includes(metric)) {
      return "NA";
    }

    return originalValue;
  };



  const columns = [
    { field: "Comm_ID", colDataClass: v => getStyle(v), heading: <>Comm-Id<br /><span className="text-xs">(PDU-ID/ Service-ID/ Frame-ID)</span></> },
    { field: "Network_Protocol", colDataClass: v => getStyle(v), heading: "Network Protocol" },
    { field: "Channel_Id", colDataClass: v => getStyle(v), heading: "Channel ID" },
    { field: "Source_Ecu", colDataClass: v => getStyle(v), heading: "Source ECU" },
    { field: "Destination_Ecu", colDataClass: v => getStyle(v), heading: "Destination ECU" },
    {
      field: "Data_Correctness", otherFields: ["Comm_ID"], colDataClass: (v, c) => {
        const status = testBenchStatus?.test_suites ? testBenchStatus?.test_suites["PDUID_" + c] === 'PASS' ? 'Pass' : testBenchStatus?.test_suites["PDUID_" + c] == null ? null : 'Fail' : 'Pass';
        return getStyle(status || v);
      }, heading: "Data Integrity Test Status", formatter: (v, c) => {
        const status = testBenchStatus?.test_suites ? testBenchStatus?.test_suites["PDUID_" + c] === 'PASS' ? 'Pass' : testBenchStatus?.test_suites["PDUID_" + c] == null ? null : 'Fail' : 'Pass';
        return status || v;
      }
    },
    { field: "Signal_Type", colDataClass: v => getStyle(v), heading: "Signal Type" },
    { field: "jitter", colDataClass: v => getStyle(v), heading: "Jitter (%)" },
    { field: "Periodicity", colDataClass: v => getStyle(v), heading: "Measured Periodicity (MS)" },
    { field: "Frame_Loss", colDataClass: v => getStyle(v), heading: "Frame Loss (%)" }
  ];

  const columns2 = [
    { field: "ECU", colDataClass: v => getStyle(v), heading: "ECU" },
    { field: "I_P_PDU", otherFields: ["ECU"], colDataClass: (v, e) => getStyle(e, v), heading: "I/P PDU" },
    { field: "O_P_PDU", otherFields: ["ECU"], colDataClass: (v, e) => getStyle(e, v), heading: "O/P PDU" },
    {
      field: "l_min",
      otherFields: ["ECU"],
      colDataClass: (v, e) => getStyle(e, getMetricValue('l_min', v)),
      heading: "Min Processing Time (ms)",
      formatter: v => getMetricValue('l_min', v)
    },
    {
      field: "l_max",
      otherFields: ["ECU"],
      colDataClass: (v, e) => getStyle(e, getMetricValue('l_max', v)),
      heading: "Max Processing Time (ms)",
      formatter: v => getMetricValue('l_max', v)
    },
    {
      field: "l_avg",
      otherFields: ["ECU"],
      colDataClass: (v, e) => getStyle(e, getMetricValue('l_avg', v)),
      heading: "Avg Processing Time (ms)",
      formatter: v => getMetricValue('l_avg', v)
    },
    {
      field: "CPU_Utilization",
      otherFields: ["ECU"],
      colDataClass: (v, e) => getStyle(e, getMetricValue('CPU_Utilization', v)),
      heading: "CPU Utilization (%)",
      formatter: v => getMetricValue('CPU_Utilization', v)
    },
    {
      field: "Memory_Utilization",
      otherFields: ["ECU"],
      colDataClass: (v, e) => getStyle(e, getMetricValue('Memory_Utilization', v)),
      heading: "Memory Utilization (%)",
      formatter: v => getMetricValue('Memory_Utilization', v)
    }
  ];


  return <DashboardTable isSecondTable={true} heading={`Network KPI's for ${headingName}`} columns={columns} data={data1} columns2={columns2} data2={data2} />

};

export default NetworkKpi;
