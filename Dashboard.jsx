import React, { useEffect, useState } from 'react';
import GanttChart from '../../Components/GanttChart/GanttChart';
import projectsDatat from "./data/projectData.json";
import { getBenchStatus, getSubfeatureDetails } from '../../Actions/Dashboard/Dashboard';
import useSWR from 'swr';
import { FaRegClock, FaLongArrowAltLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import ApiConfigs from '../../Utils/ApiConfigs';
import Tabs from '../../Components/Common/Tabs';
import ComponentKPI from './ComponentKPI';
import NetworkKpi from './NetworkKPI';
import TestCases from './TestCases';
import IntegrationKPI from './IntegrationKPI';
import TracibilityTree from './TracabilityTree';
import { defaultTreeData } from './TreeData';


const Dashboard = () => {
  const projects = projectsDatat.projects;
  const [projectIndex, setProjectIndex] = useState(0);
  const [tab, setTab] = useState(0);
  const [type, setType] = useState('features');
  const [ganttData, setGanttData] = useState(projects?.[projectIndex]?.components);
  const { data: jobData } = useSWR('jobData', getBenchStatus, ApiConfigs)
  const [componentName, setComponentName] = useState('');
  const navigate = useNavigate();

  const tabList = [
    { name: "KPIs", value: 0 },
    { name: "Traceability Tree", value: 1 }
  ]

  useEffect(() => {
    setGanttData(projects?.[projectIndex]?.components)
  }, [projectIndex]);

  const onBarClick = async (barData) => {
    const component = projects?.[projectIndex]?.components.find(
      (comp) => comp?.componentName === barData?.name && barData?.type === "component"
    );

    setComponentName(component?.componentName);

    if (component) {
      const tasks = await getSubfeatureDetails(component.componentName, projects?.[projectIndex]?.projectName);
      if (tasks && Object.keys(tasks).length > 0) {
        setType('subFeatures')
        setGanttData(tasks);
      }
    }
  }

  const openJob = () => {
    localStorage.setItem('openJob', jobData.cosim_job_id);
    navigate('/cosimulation')
  }


  const handleBack = () => {
    setGanttData(projects?.[projectIndex]?.components)
    setType('features')
  }



  return (
    <div className='p-4 h-full overflow-y-auto bg-base-200 rounded-lg grow w-full flex flex-col items-start'>
      <div className="flex gap-4 items-center mt-2">
        <button disabled={type === 'features'} onClick={() => handleBack()} className={`text-xl duration-300 border-base-content cursor-pointer ${type === 'features' ? 'opacity-0' : ''}`}>
          <FaLongArrowAltLeft />
        </button>
        <div>
          <div className="join">
            <div className="flex items-center px-3 bg-base-content/4 text-base-content border-t-2 border-l border-base-content/20 join-item shadow focus-within:outline-none font-bold">Module</div>
            <select value={projectIndex} onChange={(e) => setProjectIndex(e.target.value)} className="select bg-base-content/10 cursor-pointer border-t-2 border-r border-b-0 shadow border-base-content/20 join-item focus-within:outline-none">
              {projects?.map((project, i) => <option className='text-black' key={project.projectName + i} value={i}>{project?.projectName}</option>)}
            </select>
          </div>
        </div>

        <div className={`gap-3 items-center ${type !== 'features' ? 'flex' : 'hidden'}`}>
          <span>For Cosimulation Job Id:</span>
          <button onClick={() => openJob()} className='underline cursor-pointer'>{jobData?.cosim_job_id}</button>
          <span className='flex items-center'><FaRegClock className='mr-3' /> : {jobData?.duration}</span>
        </div>
      </div>

      <div className="heading mt-3">
        Vehicle Feature Details And Readiness Status
      </div>

      <div className='overflow-auto min-h-[30vh] w-full mt-3'>
        <GanttChart onBarClick={onBarClick} type={type} data={ganttData} />
      </div>
      {
        type !== 'features' && <Tabs id="dashboard" tab={tab} setTab={setTab} tabList={tabList} />
      }

      {
        type !== 'features' && tab === 0 && <div className='card shadow  flex flex-col gap-6 w-full py-6 px-2 bg-base-100 border-base-content/20'>
          <ComponentKPI headingName={componentName} name={"User Story"} year={projects[projectIndex].projectName} />
          {componentName !== 'In Vehicle Infotainment' && <NetworkKpi headingName={componentName} name={"User Story"} testBenchStatus={jobData} />}
          <TestCases headingName={componentName} name={"User Story"} testBenchStatus={jobData} />
          {componentName !== 'In Vehicle Infotainment' && <IntegrationKPI headingName={"ECU/Context (having SWCs of TrckCtrl)"} name={"User Story"} testBenchStatus={jobData} />}
        </div>
      }

      {
        type !== 'features' && tab === 1 && <div className='card shadow  flex flex-col gap-6 w-full py-6 px-2 bg-base-100 border-base-content/20'>
          <TracibilityTree data={defaultTreeData} />
        </div>
      }
    </div>
  );
};

export default Dashboard;