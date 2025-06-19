import React, { useMemo } from 'react';
import DashboardTable from '../../Components/Table/DashboardTable';
import testCasesData from "./data/testcases.json";

Date.prototype.getWeek = function () {
    var target = new Date(this.valueOf());
    var dayNr = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
};

// Helper to get week and year together
function getWeekAndYear(date) {
    const week = date.getWeek();
    let year = date.getFullYear();

    // Edge cases: Week 1 in December or Week 52/53 in January
    if (date.getMonth() === 11 && week === 1) {
        year += 1;
    }
    if (date.getMonth() === 0 && week >= 52) {
        year -= 1;
    }
    return { week, year };
}

// Function to format the way you want: '25CW18'
function formatWeekYear(year, week) {
    return `${year.toString().slice(-2)}CW${week}`;
}

// Current week
const today = new Date();
const { week: currentWeek, year: currentYear } = getWeekAndYear(today);

// +1 week
const oneWeekLater = new Date(today);
oneWeekLater.setDate(today.getDate() + 7);
const { week: nextWeek, year: nextYear } = getWeekAndYear(oneWeekLater);

// -1 weeks
const oneWeekBefore = new Date(today);
oneWeekBefore.setDate(today.getDate() - 7);
const { week: previousWeek3, year: previousYear3 } = getWeekAndYear(oneWeekBefore);

// -2 weeks
const twoWeekBefore = new Date(today);
twoWeekBefore.setDate(today.getDate() - 14);
const { week: previousWeek2, year: previousYear2 } = getWeekAndYear(twoWeekBefore);

// -3 weeks
const threeWeekBefore = new Date(today);
threeWeekBefore.setDate(today.getDate() - 21);
const { week: previousWeek, year: previousYear } = getWeekAndYear(threeWeekBefore);


const TestCases = ({ name = "", testBenchStatus = null , headingName ="" }) => {

    const task = testCasesData.find((t) => t.task_name === headingName);

    const calculatePassPercentage = (subTasks, weekKey) => {
        const filteredTasks = subTasks.filter(task => !task.head);
        if (filteredTasks.length === 0) return 0;
        const passCount = filteredTasks.filter(task => task.metrics[weekKey] === "Pass").length;
        return ((passCount / filteredTasks.length) * 100).toFixed(2);
    };

    const getStyle = (value) => {
        if (!isNaN(value)) return 'text-center';
        switch (value) {
            case 'Fail': return 'bg-red-200 text-red-600 text-center';
            case 'Pass': return 'bg-green-200 text-green-600 text-center';
            case 'Not Tested': return 'bg-yellow-100 text-yellow-600 text-center';
            default: return 'text-center';
        }
    };

    const columns = useMemo(() => [
        { field: "sub_task_name", otherFields: ['isHead'], heading: "Functionality", colDataClass: (v, isHead) => `text-center ${isHead ? 'bg-base-content/20' : ''}` },
        { field: "calender_week_1", heading: formatWeekYear(previousYear, previousWeek), colDataClass: (v) => getStyle(v) },
        { field: "calender_week_2", heading: formatWeekYear(previousYear2, previousWeek2), colDataClass: (v) => getStyle(v) },
        { field: "calender_week_3", heading: formatWeekYear(previousYear3, previousWeek3), colDataClass: (v) => getStyle(v) },
        { field: "calender_week_4", heading: formatWeekYear(currentYear, currentWeek), colDataClass: (v) => getStyle(v) },
        { field: "calender_week_5", heading: formatWeekYear(nextYear, nextWeek), colDataClass: (v) => getStyle(v) },
    ], []);

    const processedData = useMemo(() => {

        if (!task?.sub_tasks) return [];

        let updatedSubTasks = JSON.parse(JSON.stringify(task.sub_tasks));

        updatedSubTasks = updatedSubTasks.map(subtask => {
            if (!subtask.head && testBenchStatus?.bench_type === "platform") {
                return {
                    ...subtask,
                    metrics: { ...subtask.metrics, calender_week_5: "Not Tested" }
                };
            }
            if (!subtask.head && testBenchStatus?.bench_type === "feature" && testBenchStatus?.testcases) {
                const match = testBenchStatus.testcases.find(tc => subtask.sub_task_name.includes(tc.testcase_name));
                if (match) {
                    return {
                        ...subtask,
                        metrics: {
                            ...subtask.metrics,
                            calender_week_5: match.testcase_status === 'FAIL' ? 'Fail' : 'Pass',
                            version: match.testcase_version,
                            description: match.testcase_description || ''
                        }
                    };
                }
            }
            return subtask;
        });

        // Updating Headers
        let currentHeader = null;
        let headerSubTasks = [];

        updatedSubTasks.forEach((subtask, index) => {
            if (subtask.head) {
                if (currentHeader !== null && headerSubTasks.length > 0) {
                    updatedSubTasks[currentHeader].metrics = {
                        calender_week_1: calculatePassPercentage(headerSubTasks, 'calender_week_1'),
                        calender_week_2: calculatePassPercentage(headerSubTasks, 'calender_week_2'),
                        calender_week_3: calculatePassPercentage(headerSubTasks, 'calender_week_3'),
                        calender_week_4: calculatePassPercentage(headerSubTasks, 'calender_week_4'),
                        calender_week_5: calculatePassPercentage(headerSubTasks, 'calender_week_5')
                    };
                }
                currentHeader = index;
                headerSubTasks = [];
            } else {
                headerSubTasks.push(subtask);
            }
        });

        return updatedSubTasks.map(st => ({
            isHead: st?.head ? true : false,
            sub_task_name: st.sub_task_name,
            calender_week_1: st.metrics?.calender_week_1 || '',
            calender_week_2: st.metrics?.calender_week_2 || '',
            calender_week_3: st.metrics?.calender_week_3 || '',
            calender_week_4: st.metrics?.calender_week_4 || '',
            calender_week_5: st.metrics?.calender_week_5 || '',
        }));
    }, [task, testBenchStatus]);

    return (

        <DashboardTable
            heading={`Test Cases for ${headingName}`}
            columns={columns}
            data={processedData}
        />
    );
};

export default TestCases;
