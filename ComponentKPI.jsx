import React from 'react';
import DashboardTable from '../../Components/Table/DashboardTable';
import componentKpiData from "./data/componentKpi.json";
import { getComponentKPI } from '../../Actions/Dashboard/ComponentKpi/ComponentKpi';
import useSWR from 'swr';
import ApiConfigs from '../../Utils/ApiConfigs';
import { Link } from 'react-router';
import { componentKPIDataFormatter } from '../../Utils/DataFormatters';

const getStyle = (i, value) => {

    if (value === 'No Build Available') {
        return "bg-yellow-100 text-yellow-600 text-center";
    }

    let violation = false;

    if (i === 0 || i === 1 || i === 2 || i == 4 || i == 8) violation = false;
    if (i === 3) violation = value < 20 || value > 50;
    if (i === 5) violation = value < 0 || value > 5;
    if (i === 6) violation = value > 0;
    if (i === 7) violation = value < 0 || value > 20;
    if (i === 9 || i === 11) violation = value < 100 || value > 100;
    if (i === 10 || i === 12) violation = value < 95 || value > 100;

    return violation ? "bg-red-200 text-red-600 text-center" : "text-[inherit] text-center";
}

const headingToSkip = ['In Vehicle Infotainment'];

const ComponentKPI = ({headingName = "", name = "", year = "" }) => {

    const task = componentKpiData.find((t) => t.task_name === name);

    const { data , isLoading } = useSWR(['componentKPI', headingName, year], async () => await getComponentKPI(headingName, year), ApiConfigs)

    const columns = [
        { field: "componentName", colDataClass: v => getStyle(0, v), otherFields: ['component_link'], heading: "Component Name", formatter: (cName, cLink) => cLink ? <Link className='text-primary underline' target='_blank' to={cLink}>{cName}</Link> : cName },
        { field: "deploymentTarget", colDataClass: v => getStyle(1, v), heading: "Deployment Target", },
        { field: "commitNumber", colDataClass: v => getStyle(2, v), heading: "Commit #", },
        { field: "commentsPercentage", colDataClass: v => getStyle(3, v), heading: "Comments (%)", },
        { field: "lineOfCode", colDataClass: v => getStyle(4, v), heading: "Line of Code", },
        { field: "codeDuplication", colDataClass: v => getStyle(5, v), heading: "Code Duplication", },
        { field: "codeViolation", colDataClass: v => getStyle(6, v), heading: "Code Violation", },
        { field: "maxCodeComplexity", colDataClass: v => getStyle(7, v), heading: "Max Code Complexity (%)", },
        { field: "functionAboveThreshold", colDataClass: v => getStyle(8, v), heading: "Function Above Threshold (%)", },
        { field: "utsPass", colDataClass: v => getStyle(9, v), heading: "UTs Pass (%)", },
        { field: "codeCoverage", colDataClass: v => getStyle(10, v), heading: "Code Coverage (%)", },
        { field: "softwareTestPass", colDataClass: v => getStyle(11, v), heading: "Software Test Pass (%)", },
        { field: "requirementCoverage", colDataClass: v => getStyle(12, v), heading: "Requirement Coverage (%)", }
    ];
    return (
        <DashboardTable heading={`${headingName} Component KPIs`} loading={isLoading} data={componentKPIDataFormatter(data, task , headingToSkip.includes(headingName) )} columns={columns} />
    );
};

export default ComponentKPI;