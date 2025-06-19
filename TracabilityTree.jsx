import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
// to reduce bundle size
echarts.use([TreeChart, TitleComponent, TooltipComponent, CanvasRenderer]); import { GoAlertFill } from 'react-icons/go';
import { getTreeData } from '../../Actions/Dashboard/TraceabilityTree/TraceabilityTree';
import ApiConfigs from '../../Utils/ApiConfigs';
import useSWR from 'swr';
import { makeTreeData } from './TreeData';
import { useSelector } from 'react-redux';

function getTreeDepth(tree) {
  // Base case: If the tree is null or has no children, its depth is 1.
  if (!tree || !tree.children || tree.children.length === 0) {
    return 1;
  }

  // Initialize the maximum depth to 0.
  let maxDepth = 0;

  // Recursively calculate the depth of each child subtree.
  for (const child of tree.children) {
    // Calculate the depth of the current child subtree.
    const childDepth = getTreeDepth(child);

    // Update the maximum depth if the current child subtree is deeper.
    maxDepth = Math.max(maxDepth, childDepth);
  }

  // The depth of the current tree is 1 plus the maximum depth of its child subtrees.
  return 1 + maxDepth;
}

function TracibilityTree() {
  const { data: treeData } = useSWR('treeData', getTreeData, ApiConfigs)
  const { theme } = useSelector(state => state.commonData);
  const data = makeTreeData(treeData)

  const options = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: function (info) {
        return `<div className="tooltip-title">
               ${info?.data?.tooltip}
              </div>`
      },
      // position: 'right'
    },           //kineto ROADMAP                     PROJECT- MODULES    VTI / BILLING
                  /////// SARA HTA DO             3
    series: [
      {
        type: 'tree',
        data: [data],
        top: '9%',
        left: '5%',
        bottom: '5%',
        right: '5%',
        symbolSize: 30,
        // edgeShape : 'polyline',
        label: {
          position: ['110%', '50%'],
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 12,
          fontWeight: 600,
          minMargin: 10,
          color: theme.dark ? 'white' : 'black'
        },
        labelLayout: function () {
          return {
            moveOverlap: 'shiftX'
          };
        },
        leaves: {
          label: {
            position: ['50%', '120%'],
            verticalAlign: 'top',
            align: 'center',
          },
          symbol: 'circle',
        },
        lineStyle: {
          width: 2.5,
          curveness: 0.35
        },
        emphasis: {
          focus: 'relative'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        initialTreeDepth: 9,
        orient: 'vertical',
        height: '85%',
      },
    ],

  };


  const h = getTreeDepth(data);

  const clickHandler = (params) => {
    if (params.event?.target?.style?.text && params.data?.link) {
      window.open(params.data?.link, '_blank');
    }
  }


  return (

    !data ?
      <div role="alert" className="alert alert-error alert-outline flex justify-center rounded-2xl">
        <span><GoAlertFill className="text-error text-2xl" /></span><span className="text-error">Traceability Tree Not Avialable</span>
      </div> :
      <div className="h-full">
        <ReactEChartsCore onEvents={{
          'click': (params, event) => clickHandler(params, event),
        }} style={{ height: `${h * 17}vh` }} option={options} echarts={echarts} />
      </div>
  );
}

export default TracibilityTree;
